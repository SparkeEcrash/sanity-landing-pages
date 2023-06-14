import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const tagLabel = request.nextUrl.searchParams.get("tagLabel");

  const query = groq`
	*[_type == "tag" && label == "${tagLabel}"]
  `;

  const data = await sanityClient.fetch(query);
  //TODO: proper validation check for getting tag here
  if (data instanceof Array) {
    return NextResponse.json({ data: data[0] }, { status: 200 });
  } else {
    return NextResponse.json({ data: "an error occured getting the tag" }, { status: 500 });
  }
}
