import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  const queryUser = groq`
	*[_type == "user" && username == "${username}" && isDeleted != true][0]`;

  const userData = await sanityClient.fetch(queryUser).catch(console.error);
  if (!userData) {
    return NextResponse.json(
      { data: "an error occured getting artworks of the user" },
      { status: 500 }
    );
  }
  const { uid } = userData;
  const user = {
    name: userData.name,
    userEmail: userData.email,
    userImage: userData.image,
    username: userData.username,
    uid: userData.uid,
  };
  const queryArtworks = groq`
  *[_type == "artwork" && uid == "${uid}" && posted == true && isDeleted != true]{
    ${queryArtwork}
    }
    `;

  const data = await sanityClient.fetch(queryArtworks).catch(console.error);

  //TODO: proper validation check for getting tag here
  if (data !== null) {
    return NextResponse.json({ user, artworks: data }, { status: 200 });
  } else {
    return NextResponse.json(
      { data: "an error occured getting artworks of the user" },
      { status: 500 }
    );
  }
}
