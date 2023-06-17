"use client";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { trimString } from "utils";
import CircleLoader from "react-spinners/CircleLoader";
import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { AppDispatch } from "@redux/store";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

interface UserArtWorkProps {
  artworks: ArtworkProps[];
  loading: boolean;
  dispatchClickFn: ActionCreatorWithPayload<boolean, string>;
}

const LoadingArtwork = () => (
  <div className="w-[300px] relative border shadow-md">
    <div className="w-full h-[300px] relative bg-input-grey flex-center">
      <CircleLoader color="#153084" size={100} />
    </div>
    <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center"></div>
  </div>
);

const PlaceHolderArtwork = ({
  dispatchClickFn,
}: {
  dispatchClickFn: ActionCreatorWithPayload<boolean, string>;
}) => {
  const dispatch = AppDispatch();
  return (
    <div
      className="w-[300px] relative border shadow-md"
      onClick={() => dispatch(dispatchClickFn(true))}
    >
      <div className="w-full h-[300px] relative bg-input-grey flex-center">
        <CameraIcon className="text-border-grey h-24 w-24" />
      </div>
      <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center"></div>
    </div>
  );
};

const Artwork = ({ title, images, posted, views, likes }: ArtworkProps) => (
  <div className="w-[300px] relative border shadow-md cursor-pointer">
    <div className="w-full h-[300px] relative">
      <Image
        src={images[0].imageUrl}
        alt={title}
        className="object-cover prevent-select"
        fill
        priority
      />
    </div>
    <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
      <div>
        <h2 className="w-full title-font text-xl text-center">
          {trimString(75, title)}
        </h2>
      </div>
      {posted && (
        <div className="w-full mt-2">
          <div className="flex justify-between">
            <p className="body-font text-sm">Likes: {likes.length}</p>
            <p className="body-font text-sm">Views: {views}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function UserArtworks({
  artworks,
  loading,
  dispatchClickFn,
}: UserArtWorkProps) {
  const defaultCount = 6;

  if (loading && artworks.length === 0) {
    const placeHolders = [];
    for (let index = 0; index < defaultCount; index++) {
      placeHolders.push(
        <div key={`placeholder-${uuidv4()}`}>
          <LoadingArtwork />
        </div>
      );
    }
    return (
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {placeHolders}
      </Masonry>
    );
  } else if (!loading && artworks.length === 0) {
    const placeHolders = [];
    for (let index = 0; index < defaultCount; index++) {
      placeHolders.push(
        <div key={`placeholder-${uuidv4()}`}>
          <PlaceHolderArtwork dispatchClickFn={dispatchClickFn} />
        </div>
      );
    }
    return (
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {placeHolders}
      </Masonry>
    );
  } else {
    let placeHolders = [];
    if (artworks.length < defaultCount) {
      let count = defaultCount - artworks.length;
      for (let index = 0; index < count; index++) {
        placeHolders.push(
          <div key={`placeholder-${uuidv4()}`}>
            <PlaceHolderArtwork dispatchClickFn={dispatchClickFn} />
          </div>
        );
      }
    }
    return (
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {artworks.map(
          (
            {
              _id,
              title,
              images,
              comment,
              posted,
              tags,
              views,
              likes,
              isMaker,
              isForSale,
              price,
              uid,
              name,
              userImage,
              userEmail,
              username,
              comments,
              dateUploaded,
              dateUploadedNumber,
              dateModified,
              aid,
            },
            i
          ) => (
            <div key={_id}>
              <Link href={`/gallery/${aid}`}>
                <Artwork
                  _id={_id}
                  title={title}
                  images={images}
                  comment={comment}
                  posted={posted}
                  views={views}
                  likes={likes}
                  tags={tags}
                  isMaker={isMaker}
                  isForSale={isForSale}
                  price={price}
                  uid={uid}
                  name={name}
                  userImage={userImage}
                  userEmail={userEmail}
                  username={username}
                  comments={comments}
                  dateUploaded={dateUploaded}
                  dateUploadedNumber={dateUploadedNumber}
                  dateModified={dateModified}
                  aid={aid}
                />
              </Link>
            </div>
          )
        )}
        {placeHolders}
      </Masonry>
    );
  }
}
