import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function PATCH(request: NextRequest) {
  let comment_id: string;
  let isHidden: boolean;
  let uid: string;
  const session = await getServerSession(authOptions);
  if (session === null) {
    const data = await request.json();
    comment_id = data.comment_id;
    isHidden = data.isHidden;
    if (!data.uid) {
      return NextResponse.json(
        { data: "Toggling hide comment failed" },
        { status: 500 }
      );
    } else {
      uid = data.uid;
    }
  } else {
    const data = await request.json();
    comment_id = data.comment_id;
    isHidden = data.isHidden;
    uid = session.user.uid;
  }
  let documentResult;
  if (isHidden) {
    documentResult = await sanityClient
      .patch(comment_id)
      .set({ isHidden: false })
      .set({ hiddenBy: "" })
      .commit()
      .catch((err) => console.error("Showing comment failed: ", err.message));
  } else {
    documentResult = await sanityClient
      .patch(comment_id)
      .setIfMissing({ isHidden: true })
      .set({ isHidden: true })
      .setIfMissing({ hiddenBy: uid })
      .set({ hiddenBy: uid })
      .commit()
      .catch((err) => console.error("Hiding comment failed: ", err.message));
  }
  if (documentResult !== null) {
    const query = groq`
		*[_type == "artwork" && _id == "${
      documentResult!.aid
    }" && isDeleted != true][0]{
			${queryArtwork}
			}
			`;
    let data = await sanityClient.fetch(query).catch(console.error);
    return NextResponse.json({ data: data.comments }, { status: 200 });
  } else {
    return NextResponse.json(
      { data: "Toggling hide comment failed" },
      { status: 500 }
    );
  }
}

// <Button
// text={`${comment.isHidden ? "Show" : "Hide"}`}
// className={"w-[105px]"}
// disabled={isTogglingHideComment}
// clickFn={() => {
// 	dispatch(
// 		fetchToggleHideComment({
// 			comment_id: comment._id,
// 			isHidden: comment.isHidden,
// 		})
// 	);
// 	dispatch(
// 		addMessage({
// 			text: comment.isHidden
// 				? "Showing the comment"
// 				: "Hiding the comment",
// 			showLoading: true,
// 			key: "toggle hide for selected comment",
// 			dark: true,
// 		})
// 	);
// }}
// noHover
// />
