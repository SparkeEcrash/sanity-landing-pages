import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";

export async function PATCH(request: NextRequest) {
  const { aid, isVisitorLiked } = await request.json();
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const name = user && user.name;
  const userEmail = user && user.email;
  const userImage = user && user.image;
  const username = user && user.username;
  const uid = user && user.uid;
  const datePosted = getTodayDate();
  const datePostedNumber = getDateNow();
  let documentResult;

  if (uid && !isVisitorLiked) {
    //add a like
    const doc = {
      _type: "like",
      aid,
      name,
      userEmail,
      userImage,
      username,
      uid,
      datePosted,
      datePostedNumber,
    };
    const document = await sanityClient
      .create(doc)
      .catch((err) => console.error("Adding like failed: ", err.message));
    documentResult = await sanityClient
      .patch(aid)
      .setIfMissing({ likes: [] })
      .append("likes", [{ _ref: document!._id, _type: "reference" }])
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
        isHidden,
        hiddenBy,
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
    const data = await sanityClient.fetch(query).catch(console.error);
    const likes = data.likes ? data.likes : [];
    data.isVisitorLiked = likes.some((like: ILike) => like.uid === uid);
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json({ data: "Adding like failed" }, { status: 500 });
  }
}
// export async function GET(request: NextRequest) {
//   const aid = request.nextUrl.searchParams.get("aid");
//   const uid = request.nextUrl.searchParams.get("uid");

//   console.log(aid);

//   const queryForArtwork = groq`
// 	*[_type == "artwork" && _id == "${aid}" && isDeleted != true]
//   `;

//   const queryForUser = groq`
// 	*[_type == "user" && _id == "${uid}"]
//   `;

//   const data = await sanityClient.fetch(queryForArtwork);
//   if (data.length !== 0) {
//     const likes = data[0].likes;
//     const result = await sanityClient
//       .patch(aid!)
//       .inc({likes: 1}) // Increment field by count
//       .commit();
//     if ("_id" in result) {
//       return NextResponse.json({ likes: likes + 1 }, { status: 200 });
//     }
//   }
//   //TODO: proper validation check for checking user here
//   if (data instanceof Array) {
//     return NextResponse.json({ newUser: data.length === 0 }, { status: 200 });
//   } else {
//     return NextResponse.json({ data: "an error occured" }, { status: 500 });
//   }
// }
