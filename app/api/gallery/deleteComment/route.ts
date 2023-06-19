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
  const { aid, comment_id } = await request.json();
  const commentToRemove = [`comments[_ref=="${comment_id}"]`];
  if (aid && comment_id) {
    await sanityClient
      .patch(comment_id)
      .setIfMissing({ isDeleted: true })
      .setIfMissing({ dateUpdated: "" })
      .setIfMissing({ dateUpdatedNumber: 0 })
      .set({ dateUpdated })
      .set({ dateUpdatedNumber })
      .commit()
      .catch((err) => console.error("Removing comment failed: ", err.message));
    const documentResult = await sanityClient
      .patch(aid)
      .unset(commentToRemove)
      .commit({ autoGenerateArrayKeys: true })
      .catch((err) => console.error("Removing comment failed: ", err.message));
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
    }
  } else {
    return NextResponse.json(
      { data: "Removing comment failed" },
      { status: 500 }
    );
  }
}
