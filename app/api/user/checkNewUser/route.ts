import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("user");

  const query = groq`
	*[_type == "user" && uid == "${uid}"][0]
  `;

  const data = await sanityClient.fetch(query).catch(console.error);
  //TODO: proper validation check for checking user here

  //optional query runners
  if (false) {
    console.log("your custom query ran!!!!!!!!!!!!!!!!!!!!!!!!");
    //https://www.sanity.io/docs/js-client
    const result = await sanityClient.delete({
      query: '*[_type == "comment"]',
    });
    console.log(result);
  }

  if (data !== null) {
    return NextResponse.json({ newUser: data }, { status: 200 });
  } else {
    return NextResponse.json({ data: "an error occured" }, { status: 500 });
  }
}
