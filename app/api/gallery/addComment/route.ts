import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";

export async function POST(request: NextRequest) {
  const data = await getServerSession(authOptions);
  const uid = data && data.user.uid;
  const name = data && data.user.name;
  const userImage = data && data.user.image;
  const userEmail = data && data.user.email;
  const username = data && data.user.username;
  const datePosted = getTodayDate();
  const datePostedNumber = getDateNow();
  const { comment, aid } = await request.json();
  const commentTrimmed = comment.trim();
  if (comment && aid && uid) {
    const doc = {
      _type: "comment",
      uid,
      aid,
      name,
      userEmail,
      userImage,
      username,
      comment: commentTrimmed,
      datePosted,
      datePostedNumber,
    };
    const document = await sanityClient.create(doc).catch(console.error);
    const documentResult = await sanityClient
      .patch(aid)
      .setIfMissing({ comments: [] })
      .append("comments", [{ _ref: document!._id, _type: "reference" }])
      .commit({ autoGenerateArrayKeys: true })
      .catch((err) => console.error("Adding comment failed: ", err.message));
    if (documentResult !== null) {
      const query = groq`
			*[_type == "artwork" && _id == "${documentResult!._id}"][0]{
				...,
				comments[]-> {
          _id,
					uid,
					aid,
					name,
					userEmail,
					userImage,
					username,
					comment,
					datePosted,
					datePostedNumber,
          dateUpdated,
					dateUpdatedNumber,
				},
				likes[]-> {
          _id,
					uid,
					aid,
					name,
					userEmail,
					userImage,
					username,
					datePosted,
					datePostedNumber,
				},
				tags[]-> {
          _id,
					label
				},
				images[]-> {
          _id,
					height,
					width,
					"imageUrl": image.asset->url,
				}
			}
			`;
      let data = await sanityClient.fetch(query).catch(console.error);
      const likes = data.likes ? data.likes : [];
      data.isVisitorLiked = likes.some((like: ILike) => like.uid === uid);
      return NextResponse.json({ data: data }, { status: 200 });
    } else {
      return NextResponse.json({ data: "Adding comment failed" }, { status: 500 });
    }
  }
}
