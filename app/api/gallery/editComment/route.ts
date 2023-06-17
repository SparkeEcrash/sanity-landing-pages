import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const dateUpdated = getTodayDate();
  const dateUpdatedNumber = getDateNow();
  const { comment, _id } = await request.json();
  const commentTrimmed = comment.trim();
  if (commentTrimmed && _id) {
    const documentResult = await sanityClient
      .patch(_id)
      .setIfMissing({ dateUpdated: "" })
      .setIfMissing({ dateUpdatedNumber: 0 })
      .set({ comment: commentTrimmed })
      .set({ dateUpdated })
      .set({ dateUpdatedNumber })
      .commit({ autoGenerateArrayKeys: true })
      .catch((err) => console.error("Adding comment failed: ", err.message));
    if (documentResult !== null) {
      const query = groq`
			*[_type == "artwork" && _id == "${documentResult!.aid}"][0]{
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
      return NextResponse.json({ data: "Adding like failed" }, { status: 500 });
    }
  }
}
