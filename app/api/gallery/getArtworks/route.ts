import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function GET(request: NextRequest) {
  const query = groq`
	*[_type == "artwork" && posted == true && isDeleted != true]{
    ${queryArtwork}
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
