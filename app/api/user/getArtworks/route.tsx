import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import mockData from "./data";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("user");

  const query = groq`
	*[_type == "artwork" && uid == "${uid}"]{
		...,
		tags[]-> {
			label
		},
		images[]-> {
			height,
			width,
			"imageUrl": image.asset->url,
		}
	}
  `;

  let data;
  if (false) {
    data = await sanityClient.fetch(query);
    //change to const instead of let when ready for production
  } else {
    data = mockData;
  }

  //TODO: proper validation check for getting tag here
  if (data instanceof Array) {
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json(
      { data: "an error occured getting the artworks for the user" },
      { status: 500 }
    );
  }
}
