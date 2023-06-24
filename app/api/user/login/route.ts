import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import * as bcrypt from "bcrypt";
import { verifyEmail } from "utils";

interface RequestBody {
  usernameOrEmail: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const { usernameOrEmail, password }: RequestBody = await request.json();
  let query;
  let user;

  const usernameOrEmailTrimmed = usernameOrEmail.trim();
  const passwordTrimmed = password.trim();
  const isEmail = verifyEmail(usernameOrEmailTrimmed);

  if (!usernameOrEmailTrimmed || !passwordTrimmed) {
    return new Response(
      JSON.stringify({ result: "missing credentials", status: 200 })
    );
  }

  if (isEmail) {
    query = groq`
		*[_type == "user" && email == "${usernameOrEmailTrimmed}"][0]
		`;
    user = await sanityClient.fetch(query).catch(console.error);
    if (user === null) {
      query = groq`
      *[_type == "user" && username == "${usernameOrEmailTrimmed}"][0]
      `;
      user = await sanityClient.fetch(query).catch(console.error);
    }
  } else {
    query = groq`
		*[_type == "user" && username == "${usernameOrEmailTrimmed}"][0]
		`;
    user = await sanityClient.fetch(query).catch(console.error);
  }
  if (user) {
    if (!user.password) {
      return new Response(
        JSON.stringify({
          result: "account already exists from another provider",
          status: 200,
        })
      );
    } else {
      if (await bcrypt.compare(passwordTrimmed, user.password)) {
        return new Response(
          JSON.stringify({ result: "authenticated", user, status: 200 })
        );
      } else {
        return new Response(
          JSON.stringify({ result: "incorrect password", status: 403 })
        );
      }
    }
  } else {
    return new Response(
      JSON.stringify({ result: "no username or email", status: 200 })
    );
  }
}
