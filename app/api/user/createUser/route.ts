import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate } from "utils";
import * as bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const { name, email, password, image, username, uid, provider } =
    await request.json();
  const dateJoined = getTodayDate();

  let passwordHashed = password ? await bcrypt.hash(password, 10) : "";

  if (name && email && image && username && uid) {
    const doc = {
      _type: "user",
      _id: uid,
      name,
      email,
      password: passwordHashed,
      image,
      username,
      uid,
      dateJoined,
      provider,
    };
    const result = await sanityClient.createOrReplace(doc).catch(console.error);
    //TODO: proper validation check for creating user here
    if (typeof result === "object" && result !== null) {
      return NextResponse.json(
        { data: "new user created or replaced" },
        { status: 200 }
      );
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
