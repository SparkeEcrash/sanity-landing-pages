import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import * as bcrypt from "bcrypt";

interface RequestBody {
  usernameOrEmail: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const { usernameOrEmail, password }: RequestBody = await request.json();
  let query;

  if (usernameOrEmail.includes("@")) {
    query = groq`
		*[_type == "user" && email == "${usernameOrEmail}"][0]
		`;
  } else {
    query = groq`
		*[_type == "user" && username == "${usernameOrEmail}"][0]
		`;
  }

  //TODO:
  const user = await sanityClient.fetch(query).catch(console.error);

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...userWithoutPass } = user;
    return new Response(JSON.stringify(userWithoutPass));
  } else return new Response(JSON.stringify(null));
}
