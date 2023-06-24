import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { avatars } from "statics";
import { PatchSelection } from "@sanity/client";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const form = await request.formData();
  const blob = form.get("blob");
  const formData = JSON.parse(await (blob as Blob)!.text());
  let data;
  const { name, userEmail, username, userImage, imageDetails } = formData;
  const images = form.getAll("image");

  const nameTrimmed = name.trim();
  const userEmailTrimmed = userEmail.trim();
  const usernameTrimmed = username.trim();
  const dateUpdated = getTodayDate();
  const dateUpdatedNumber = getDateNow();

  if (uid && nameTrimmed && userEmailTrimmed) {
    const query = groq`
    *[_type == "user" && uid == "${uid}" && isDeleted != true ][0]`;

    const userToUpdate = await sanityClient.fetch(query).catch(console.error);
    const { _id } = userToUpdate;

    if (!userImage) {
      const isDefaultAvatar = avatars.includes(userToUpdate.image);
      let newDocProfileImage;
      if (imageDetails.length === 0) {
        const avatarImageUrl =
          avatars[Math.floor(Math.random() * avatars.length)];
        data = await sanityClient
          .patch(_id)
          .set({ name })
          .set({ email: userEmail })
          .set({ username: usernameTrimmed })
          .set({ image: avatarImageUrl })
          .setIfMissing({ dateUpdated: "" })
          .setIfMissing({ dateUpdatedNumber: 0 })
          .set({ dateUpdated })
          .set({ dateUpdatedNumber })
          .commit()
          .catch((err) =>
            console.error("Updating user profile failed: ", err.message)
          );
      } else {
        const { type, name: imageName } = images[0] as Blob;
        const buffer = Buffer.from(await (images[0] as Blob).arrayBuffer());
        const uploadedImage = await sanityClient.assets.upload(
          "image",
          buffer,
          {
            filename: imageName,
            contentType: type,
          }
        );
        data = await sanityClient
          .patch(_id)
          .set({ image: uploadedImage.url })
          .commit();
        const { height, width } = imageDetails[0].dimensions;
        const userProfileImage = {
          _type: "userProfileImage",
          height,
          width,
          uid,
          dateUploaded: dateUpdated,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedImage._id,
            },
          },
        };
        newDocProfileImage = await sanityClient.create(userProfileImage);
        if (newDocProfileImage === null) {
          return NextResponse.json(
            { error: "Failed to create document for user profile image" },
            { status: 500 }
          );
        }
      }
      //Delete preexisting use image profilel picture
      if (!isDefaultAvatar && data !== null) {
        //userImage can exist as a string from using OAuth to create account that is not an imageUrl from us
        const query = groq`
        *[_type == "userProfileImage" && uid == "${uid}" && isDeleted != true ]`;
        const userProfileImages = await sanityClient
          .fetch(query)
          .catch(console.error);
        let newProfileImageId = "";
        if (newDocProfileImage) {
          newProfileImageId = newDocProfileImage._id;
          const filteredUserProfileImages = userProfileImages.filter(
            (image: { _id: string }) => image._id !== newProfileImageId
          );
          filteredUserProfileImages.forEach(
            (image: { _id: PatchSelection }) => {
              sanityClient
                .patch(image._id)
                .setIfMissing({ isDeleted: true })
                .set({ isDeleted: true })
                .commit();
            }
          );
        } else {
          userProfileImages.forEach((image: { _id: PatchSelection }) => {
            sanityClient
              .patch(image._id)
              .setIfMissing({ isDeleted: true })
              .set({ isDeleted: true })
              .commit();
          });
        }
      }
    } else {
      data = await sanityClient
        .patch(_id)
        .set({ name })
        .set({ email: userEmail })
        .set({ username: usernameTrimmed })
        .setIfMissing({ dateUpdated: "" })
        .setIfMissing({ dateUpdatedNumber: 0 })
        .set({ dateUpdated })
        .set({ dateUpdatedNumber })
        .commit()
        .catch((err) =>
          console.error("Updating user profile failed: ", err.message)
        );
    }

    if (data !== null) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json(
        { data: "Updating user profile failed" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { data: "Updating user profile failed" },
      { status: 500 }
    );
  }
}
