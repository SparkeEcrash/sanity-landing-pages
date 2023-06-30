import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function POST(request: NextRequest) {
  const data = await getServerSession(authOptions);
  const uid = data && data.user.uid;
  const id = data && data.user.id;
  const datePosted = getTodayDate();
  const datePostedNumber = getDateNow();
  const { comment, aid } = await request.json();
  const commentTrimmed = comment.trim();
  if (comment && aid && uid) {
    const doc = {
      _type: "comment",
      user: {
        _type: "user",
        _ref: id,
      },
      artwork: {
        _type: "artwork",
        _ref: aid,
      },
      uid,
      aid,
      comment: commentTrimmed,
      datePosted,
      datePostedNumber,
      isHidden: false,
      hiddenBy: "",
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
			*[_type == "artwork" && _id == "${
        documentResult!._id
      }" && isDeleted != true][0]{
        ${queryArtwork}
        }
        `;
      let data = await sanityClient.fetch(query).catch(console.error);
      const likes = data.likes ? data.likes : [];
      data.isVisitorLiked = likes.some((like: ILike) => like.uid === uid);
      return NextResponse.json({ data: data }, { status: 200 });
    } else {
      return NextResponse.json(
        { data: "Adding comment failed" },
        { status: 500 }
      );
    }
  }
}
