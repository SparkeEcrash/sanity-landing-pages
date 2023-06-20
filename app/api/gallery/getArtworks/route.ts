import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const query = groq`
	*[_type == "artwork" && posted == true && isDeleted != true]{
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

  const data = await sanityClient.fetch(query).catch(console.error);
  //TODO: proper validation check for checking user here
  if (data !== null) {
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json({ data }, { status: 404 });
  }
}
