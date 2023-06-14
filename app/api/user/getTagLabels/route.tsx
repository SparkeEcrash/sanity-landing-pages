import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const query = groq`
	*[_type == "tag"]
  `;

  const data = await sanityClient.fetch(query);
  const tags: string[] = [];
  data.forEach((tag: ITag) => {
    tags.push(tag.label);
  });

  //TODO: proper validation check for data here
  if (data) {
    return NextResponse.json({ data: tags }, { status: 200 });
  } else {
    return NextResponse.json({ data: "an error occured getting the tag labels" }, { status: 500 });
  }
}
