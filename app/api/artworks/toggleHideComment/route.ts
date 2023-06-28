import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function PATCH(request: NextRequest) {
  const { comment_id, isHidden } = await request.json();
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
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
    return NextResponse.json({ data: "Adding like failed" }, { status: 500 });
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
