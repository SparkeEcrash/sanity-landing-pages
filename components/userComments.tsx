"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppDispatch, useAppSelector } from "@redux/store";
import { findUser } from "@redux/features/userSlice";
import { fetchUserCommentedArtworks } from "@redux/features/userSlice";
import DisplayArtworks from "@sanity-components/displayArtworks/displayArtworks";

export default function UserComments() {
  const router = useRouter();
  const {
    signedIn,
    uid,
    userLoading,
    accessToken,
    artworksCommented,
    artworksCommentedLoading,
  } = useAppSelector(findUser);
  const dispatch = AppDispatch();
  useEffect(() => {
    if (!userLoading && !signedIn) {
      router.push("/gallery");
    }
  }, [userLoading]);
  useEffect(() => {
    signedIn && dispatch(fetchUserCommentedArtworks({ uid, accessToken }));
  }, [signedIn]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-14 flex relative">
        <h1 className="text-3xl text-royal-blue font-serif text-center">
          Artworks with your comments on the Gallery
        </h1>
      </div>
      <DisplayArtworks
        artworks={artworksCommented}
        loading={artworksCommentedLoading}
      />
    </div>
  );
}
