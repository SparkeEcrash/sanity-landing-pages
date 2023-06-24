import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import * as bcrypt from "bcrypt";

interface RequestBody {
  oldPassword: string;
  newPassword: string;
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const { oldPassword, newPassword }: RequestBody = await request.json();
  const dateUpdated = getTodayDate();
  const dateUpdatedNumber = getDateNow();

  if (oldPassword.length > 0 && newPassword.length > 0) {
    const oldPasswordTrimmed = oldPassword.trim();
    const newPasswordTrimmed = newPassword.trim();
    const query = groq`
		*[_type == "user" && uid == "${uid}"][0]
		`;
    const user = await sanityClient.fetch(query).catch(console.error);
    if (user) {
      const passwordCompare = user.password;
      const doesPasswordMatch = await bcrypt.compare(
        oldPasswordTrimmed,
        passwordCompare
      );
      if (doesPasswordMatch) {
        const newPasswordHashed = newPasswordTrimmed
          ? await bcrypt.hash(newPasswordTrimmed, 10)
          : "";
        const result = await sanityClient
          .patch(user._id)
          .setIfMissing({ dateUpdated: "" })
          .setIfMissing({ dateUpdatedNumber: 0 })
          .set({ password: newPasswordHashed })
          .set({ dateUpdated })
          .set({ dateUpdatedNumber })
          .commit()
          .catch((err) =>
            console.error("Failed to reset password: ", err.message)
          );
        if (result !== null) {
          return NextResponse.json(
            { data: "password was reset" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { data: "an error occured" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json({ data: "wrong password" }, { status: 200 });
      }
    } else {
      return NextResponse.json({ data: "an error occured" }, { status: 500 });
    }
  } else if (oldPassword.length === 0 && newPassword.length > 0) {
    const query = groq`
		*[_type == "user" && uid == "${uid}"][0]
		`;
    const user = await sanityClient.fetch(query).catch(console.error);
    if (!user.password) {
      const newPasswordTrimmed = newPassword.trim();
      const newPasswordHashed = newPasswordTrimmed
        ? await bcrypt.hash(newPasswordTrimmed, 10)
        : "";
      const result = await sanityClient
        .patch(user._id)
        .setIfMissing({ password: "" })
        .set({ password: newPasswordHashed })
        .setIfMissing({ isPasswordSet: true })
        .set({ isPasswordSet: true })
        .setIfMissing({ dateUpdated: "" })
        .setIfMissing({ dateUpdatedNumber: 0 })
        .set({ dateUpdated })
        .set({ dateUpdatedNumber })
        .commit()
        .catch((err) =>
          console.error("Failed to reset password: ", err.message)
        );
      if (result !== null) {
        return NextResponse.json({ data: "password was set" }, { status: 200 });
      } else {
        return NextResponse.json({ data: "an error occured" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ data: "an error occured" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ data: "an error occured" }, { status: 400 });
  }
}
