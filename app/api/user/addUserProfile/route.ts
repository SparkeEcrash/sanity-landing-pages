import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import { getTodayDate, getDateNow } from "utils";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { verifyEmail, getDefaultUserAvatar } from "utils";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const blob = form.get("blob");
  const formData = JSON.parse(await (blob as Blob)!.text());
  const { name, userEmail, username, password, imageDetails } = formData;
  const images = form.getAll("image");
  const dateJoined = getTodayDate();
  const dateJoinedNumber = getDateNow();
  const id = "user." + uuidv4();
  const uid = "credentials." + id.split(".")[1];

  if (name && verifyEmail(userEmail) && password) {
    const nameTrimmed = name.trim();
    const userEmailTrimmed = userEmail.trim();
    const usernameTrimmed = username ? username.trim() : "";
    const passwordTrimmed = password.trim();
    const passwordHashed = passwordTrimmed
      ? await bcrypt.hash(passwordTrimmed, 10)
      : "";

    const query = groq`
      *[_type == "user" && (email == "${userEmailTrimmed}" || username == "${username}")][0]
      `;
    const preExistingUser = await sanityClient
      .fetch(query)
      .catch(console.error);

    if (preExistingUser !== null) {
      if (preExistingUser.email === userEmailTrimmed) {
        return NextResponse.json(
          { error: "An account with the email already exists" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "An account with the username already exists" },
          { status: 200 }
        );
      }
    }

    const doc = {
      _type: "user",
      _id: id,
      name: nameTrimmed,
      email: userEmailTrimmed,
      username: usernameTrimmed,
      password: passwordHashed,
      isPasswordSet: true,
      provider: "credentials",
      roles: ["user"],
      uid,
      dateJoined,
      dateJoinedNumber,
    };
    const data = (await sanityClient.create(doc).catch(console.error)) as any;

    /* Handle User Profile Image */
    if (images.length > 0) {
      const { type, name: imageName } = images[0] as Blob;
      const buffer = Buffer.from(await (images[0] as Blob).arrayBuffer());
      const uploadedImage = await sanityClient.assets.upload("image", buffer, {
        filename: imageName,
        contentType: type,
      });
      if (uploadedImage === null) {
        sanityClient.delete(id).catch((err) => {
          console.error("Delete failed: ", err.message);
        });
        return NextResponse.json(
          { error: "Failed to upload user image" },
          { status: 500 }
        );
      } else {
        const docUserProfileWithImage = await sanityClient
          .patch(id)
          .set({ image: uploadedImage.url })
          .commit();
        if (docUserProfileWithImage === null) {
          sanityClient.delete(id).catch((err) => {
            console.error("Delete failed: ", err.message);
          });
          return NextResponse.json(
            { error: "Failed to link image to user profile" },
            { status: 500 }
          );
        }
        const { height, width } = imageDetails[0].dimensions;
        const userProfileImage = {
          _type: "userProfileImage",
          height,
          width,
          uid: id,
          dateUploaded: dateJoined,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedImage._id,
            },
          },
        };
        const docProfileImage = await sanityClient.create(userProfileImage);
        if (docProfileImage === null) {
          return NextResponse.json(
            { error: "Failed to create document for user profile image" },
            { status: 500 }
          );
        }
      }
    } else {
      /*Add default profile image */
      const avatarImageUrl = getDefaultUserAvatar();
      const docUserProfileWithImage = await sanityClient
        .patch(id)
        .set({ image: avatarImageUrl })
        .commit();
      if (docUserProfileWithImage === null) {
        sanityClient.delete(id).catch((err) => {
          console.error("Delete failed: ", err.message);
        });
        return NextResponse.json(
          { error: "Failed to link image to user profile" },
          { status: 500 }
        );
      }
    }

    if (data !== null) {
      delete data.password;
      delete data.uid;
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { error: "Failed to create user account" },
    { status: 500 }
  );
}

//https://github.com/Vetrivel-VP/watchme_fullstack_sanity_project/blob/master/watchme_frontend/src/components/CreatePin.jsx

//https://www.npmjs.com/package/@sanity/client#creating-documents
