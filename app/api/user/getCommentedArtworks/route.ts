import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import { verifyJwt } from "@lib/jwt";
import jwt_decode from "jwt-decode";

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("authorization");
  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json(
      { error: "not signed in and unauthorized" },
      { status: 401 }
    );
  }

  const decoded = jwt_decode(accessToken) as any;
  const uid = request.nextUrl.searchParams.get("user");
  if (decoded.uid !== uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const query = groq`
	*[_type == "comment" && uid == "${uid}" && isDeleted != true]{
    ...,
    artwork-> {
      ...,
      user-> {
        name,
        email,
        image,
        username,
        },
      images[]-> {
        _id,
        height,
        width,
        "imageUrl": image.asset->url,
      }
    }
  }
	`;

  const data = await sanityClient.fetch(query).catch(console.error);
  let commentsWithUniqueArtwork: CommentProps[] = [];
  data.forEach((comment: CommentProps) => {
    const index = commentsWithUniqueArtwork.findIndex(
      (commentWithUniqueArtwork) =>
        commentWithUniqueArtwork.artwork._id === comment.artwork._id
    );
    if (index === -1) {
      commentsWithUniqueArtwork = [
        ...commentsWithUniqueArtwork,
        { ...comment },
      ];
    }
  });

  if (data !== null) {
    return NextResponse.json(
      { data: commentsWithUniqueArtwork },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { data: "an error occured getting user's likes" },
      { status: 500 }
    );
  }
}
