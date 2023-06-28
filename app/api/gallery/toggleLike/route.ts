import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function PATCH(request: NextRequest) {
  const { aid, isVisitorLiked } = await request.json();
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const id = user && user.id;
  const datePosted = getTodayDate();
  const datePostedNumber = getDateNow();
  let documentResult;

  if (id && uid && !isVisitorLiked) {
    //add a like
    const doc = {
      _type: "like",
      user: {
        _type: "user",
        _ref: id,
      },
      artwork: {
        _type: "artwork",
        _ref: aid,
      },
      aid,
      uid,
      datePosted,
      datePostedNumber,
    };
    const likeDoc = await sanityClient
      .create(doc)
      .catch((err) => console.error("Adding like failed: ", err.message));
    documentResult = await sanityClient
      .patch(aid)
      .setIfMissing({ likes: [] })
      .append("likes", [{ _ref: likeDoc!._id, _type: "reference" }])
      .commit({ autoGenerateArrayKeys: true })
      .catch((err) => console.error("Adding like failed: ", err.message));
  } else {
    const query = groq`*[_type == "like" && aid == "${aid}" && uid == "${uid}" && isDeleted != true][0]`;
    let like = await sanityClient.fetch(query).catch(console.error);
    const likeToRemove = [`likes[_ref=="${like._id}"]`];
    documentResult = await sanityClient
      .patch(aid)
      .unset(likeToRemove)
      .commit({ autoGenerateArrayKeys: true })
      .catch((err) => console.error("Removing like failed: ", err.message));
    sanityClient
      .delete(like._id)
      .catch((err) => console.error("Removing like failed: ", err.message));
  }

  if (documentResult !== null) {
    const query = groq`
    *[_type == "artwork" && _id == "${
      documentResult!._id
    }" && isDeleted != true][0]{
      ${queryArtwork}
      }
      `;
    const data = await sanityClient.fetch(query).catch(console.error);
    const likes = data.likes ? data.likes : [];
    data.isVisitorLiked = likes.some((like: ILike) => like.uid === uid);
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json({ data: "Adding like failed" }, { status: 500 });
  }
}
