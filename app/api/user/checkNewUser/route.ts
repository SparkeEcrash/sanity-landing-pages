import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("user");

  const query = groq`
	*[_type == "user" && uid == "${uid}"]
  `;

  const data = await sanityClient.fetch(query).catch(console.error);

  if (data !== null) {
    return NextResponse.json({ newUser: data.length === 0 }, { status: 200 });
  } else {
    return NextResponse.json({ data: "an error occured" }, { status: 500 });
  }
}
