import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import mockData from "./data";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const aid = request.nextUrl.searchParams.get("aid");

  const query = groq`
	*[_type == "artwork" && _id == "${aid}" && posted == true][0]{
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
			label,
		},
		images[]-> {
      _id,
			height,
			width,
			"imageUrl": image.asset->url,
		}
	}
  `;

  let data: any;

  if (true) {
    data = await sanityClient.fetch(query).catch(console.error);
    console.log(data);
  } else {
    data = mockData;
    data.isVisitorLiked = true;
  }
  //TODO: proper validation check for checking user here
  if (data !== null) {
    const likes = data.likes ? data.likes : [];
    data.isVisitorLiked = likes.some((like: ILike) => like.uid === uid);
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json({ data }, { status: 404 });
  }
}
