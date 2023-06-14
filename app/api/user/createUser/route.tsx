import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate } from "utils";

export async function POST(request: NextRequest) {
  const { name, email, image, username, uid } = await request.json();
  const dateJoined = getTodayDate();
  if (name && email && image && username && uid) {
    const doc = {
      _type: "user",
      _id: uid,
      name,
      username,
      email,
      image,
      uid,
      dateJoined,
    };
    const result = await sanityClient.createOrReplace(doc);
    //TODO: proper validation check for creating user here
    if (typeof result === "object" && result !== null) {
      return NextResponse.json({ data: "new user created or replaced" }, { status: 200 });
    } else {
      return NextResponse.json(
        { data: "new user not created" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ data: "new user not created" }, { status: 500 });
}

//https://github.com/Vetrivel-VP/watchme_fullstack_sanity_project/blob/master/watchme_frontend/src/components/CreatePin.jsx

//https://www.npmjs.com/package/@sanity/client#creating-documents
