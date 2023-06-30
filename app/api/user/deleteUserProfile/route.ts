import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { PatchSelection } from "@sanity/client";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const dateUpdated = getTodayDate();
  const dateUpdatedNumber = getDateNow();
  const { uid: uidFromClient } = await request.json();

  if (uid === uidFromClient) {
    const queryUser = groq`
	*[_type == "user" && uid == "${uid}" && isDeleted != true ][0]`;
    const userToUpdate = await sanityClient
      .fetch(queryUser)
      .catch(console.error);

    const deletedUserDoc = {
      _type: "userDeleted",
      name: userToUpdate.name,
      username: userToUpdate.username,
      email: userToUpdate.email,
      image: userToUpdate.image,
      password: userToUpdate.password,
      uid: userToUpdate.uid,
      roles: userToUpdate.roles,
      dateJoined: userToUpdate.dateJoined,
      dateJoinedNumber: userToUpdate.dateJoinedNumber,
      provider: userToUpdate.provider,
      isEmailVerified: userToUpdate.isEmailVerified,
      dateUpdated,
      dateUpdatedNumber,
      isDeleted: true,
    };

    const deletedUser = await sanityClient
      .create(deletedUserDoc)
      .catch(console.error);
    if (deletedUser) {
      //delete profile picture
      const queryProfilePictures = groq`
      *[_type == "userProfileImage" && uid == "${uid}" && isDeleted != true ]`;
      const userProfileImagesToDelete = await sanityClient
        .fetch(queryProfilePictures)
        .catch(console.error);
      userProfileImagesToDelete.forEach((image: { _id: PatchSelection }) => {
        sanityClient
          .patch(image._id)
          .setIfMissing({ isDeleted: true })
          .set({ isDeleted: true })
          .commit();
      });
      //delete likes
      const queryLikes = groq`
      *[_type == "like" && uid == "${uid}" && isDeleted != true ]`;
      const userLikesToDelete = await sanityClient
        .fetch(queryLikes)
        .catch(console.error);
      for (let i = 0; i < userLikesToDelete.length; i++) {
        await sanityClient
          .patch(userLikesToDelete[i]._id)
          .setIfMissing({ isDeleted: true })
          .setIfMissing({ dateUpdated: "" })
          .setIfMissing({ dateUpdatedNumber: 0 })
          .set({ dateUpdated })
          .set({ dateUpdatedNumber })
          .set({ isDeleted: true })
          .set({ user: { _type: "userDeleted", _ref: deletedUser._id } })
          .commit()
          .catch((err) =>
            console.error("deleting user's likes failed: ", err.message)
          );
      }
      //delete artworks
      const queryArtworks = groq`
      *[_type == "artwork" && uid == "${uid}" && isDeleted != true ]`;
      const userArtworksToDelete = await sanityClient
        .fetch(queryArtworks)
        .catch(console.error);
      for (let i = 0; i < userArtworksToDelete.length; i++) {
        await sanityClient
          .patch(userArtworksToDelete[i]._id)
          .setIfMissing({ isDeleted: true })
          .setIfMissing({ dateUpdated: "" })
          .setIfMissing({ dateUpdatedNumber: 0 })
          .set({ posted: false })
          .set({ dateUpdated })
          .set({ dateUpdatedNumber })
          .set({ isDeleted: true })
          .set({ user: { _type: "userDeleted", _ref: deletedUser._id } })
          .commit()
          .catch((err) =>
            console.error("deleting user's artworks failed: ", err.message)
          );
      }
      //delete comments
      const queryComments = groq`
      *[_type == "comment" && uid == "${uid}" && isDeleted != true ]`;
      const userCommentsToDelete = await sanityClient
        .fetch(queryComments)
        .catch(console.error);
      for (let i = 0; i < userCommentsToDelete.length; i++) {
        await sanityClient
          .patch(userCommentsToDelete[i]._id)
          .setIfMissing({ isDeleted: true })
          .setIfMissing({ dateUpdated: "" })
          .setIfMissing({ dateUpdatedNumber: 0 })
          .set({ dateUpdated })
          .set({ dateUpdatedNumber })
          .set({ isDeleted: true })
          .set({ user: { _type: "userDeleted", _ref: deletedUser._id } })
          .commit()
          .catch((err) =>
            console.error("deleting user's comments failed: ", err.message)
          );
      }
      //delete user
      const identifications = uid!.split(".");
      const providerId = identifications[0];
      const providerAccountId = identifications[1];
      if (providerId !== "credentials") {
        const queryAccount = groq`
				*[_type == "account" && providerId == "${providerId}" && providerAccountId == "${providerAccountId}" ][0]`;
        const accountToDelete = await sanityClient
          .fetch(queryAccount)
          .catch(console.error);
        const result = await sanityClient
          .delete(accountToDelete._id)
          .catch(console.error);
        if (result) {
          // sanityClient.delete(userToUpdate._id).catch(console.error);
        }
      } else {
        sanityClient.delete(userToUpdate._id).catch(console.error);
      }
    }
    if (deletedUser !== null) {
      return NextResponse.json({ deletedUser }, { status: 200 });
    } else {
      return NextResponse.json(
        { data: "Deleting user account failed" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
