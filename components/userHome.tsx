"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "@components/button";
import { useState, useEffect } from "react";
import DisplayArtworks from "@sanity-components/displayArtworks/displayArtworks";
import {
  fetchGalleryUserArtworks,
  findGallery,
} from "@redux/features/gallerySlice";
import { findUser } from "@redux/features/userSlice";
import { AppDispatch, useAppSelector } from "@redux/store";

interface UserHomeProps {
  username: string;
}

export default function UserHome({ username }: UserHomeProps) {
  const dispatch = AppDispatch();
  const { userArtworks, isGettingUserArtworks } = useAppSelector(findGallery);
  const { user } = userArtworks;
  const { artworks } = userArtworks;
  const { signedIn, username: visitorUsername } = useAppSelector(findUser);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchGalleryUserArtworks(username));
  }, [username]);

  useEffect(() => {
    signedIn && visitorUsername === username && setIsOwner(true);
  }, [signedIn]);

  return (
    <div className="grid grid-cols-3 py-14">
      <div className="col-span-2">
        <div className="flex">
          <DisplayArtworks
            artworks={artworks}
            loading={isGettingUserArtworks}
            breakPoints={2}
            defaultCount={4}
          />
        </div>
      </div>
      <div className="grid-cols-1 w-full h-full">
        {!isGettingUserArtworks && (
          <div className="sticky top-12 flex justify-center flex-col items-center">
            <h1 className="title-font text-base">Artworks from</h1>
            <Image
              src={user.userImage}
              alt={"User image"}
              width={100}
              height={100}
              className="rounded-full h-[100px] object-cover relative prevent-select border mt-10"
              priority
            />
            <h2 className="title-font text-center mt-10">{user.name}</h2>
            {isOwner && artworks.length === 0 && (
              <div className="flex flex-col items-center">
                <p className="body-font mt-10">Hi {user.name}!</p>
                <p className="body-font mt-2 text-left w-full">
                  {" "}
                  This is your page that will showcase your artworks. You can add artworks to your page by clicking below.
                </p>
                <div className="mt-10">
                  <Link href="/artworks">
                    <Button
                      text={"Artworks"}
                      textColor={"text-royal-blue"}
                      bgColor={"white"}
                    />
                  </Link>
                </div>
                <p className="body-font mt-10">
                  Make sure to post instead of save your artworks in order to
                  make them viewable to the public.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
