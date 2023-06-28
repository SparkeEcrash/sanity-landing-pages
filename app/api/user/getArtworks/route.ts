import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import mockData from "./data";
import { verifyJwt } from "@lib/jwt";
import jwt_decode from "jwt-decode";
import { queryArtwork } from "@utils/groq";

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
  *[_type == "artwork" && uid == "${uid}" && isDeleted != true]{
    ${queryArtwork}
    }
    `;

  let data;
  if (true) {
    data = await sanityClient.fetch(query).catch(console.error);
    //change to const instead of let when ready for production
  } else {
    data = mockData;
  }

  //TODO: proper validation check for getting tag here
  if (data !== null) {
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json(
      { data: "an error occured getting the artworks for the user" },
      { status: 500 }
    );
  }
}