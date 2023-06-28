"use client";
import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { trimString } from "utils";
import CircleLoader from "react-spinners/CircleLoader";
import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { AppDispatch } from "@redux/store";
import {
  loadSavedArtwork,
  setShowArtworkModal,
} from "@redux/features/artworksSlice";
import { v4 as uuidv4 } from "uuid";
import {
  StopIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { setDimensionsForWindow } from "utils";

interface UserArtWorkProps {
  artworks: ArtworkProps[];
  loading: boolean;
  dispatchClickFn: ActionCreatorWithPayload<
    {
      show: boolean;
      edit?: boolean | undefined;
      delete?: boolean | undefined;
      _id?: string | undefined;
    },
    "artworks/setShowArtworkModal"
  >;
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
  dispatchClickFn: ActionCreatorWithPayload<
    {
      show: boolean;
      edit?: boolean | undefined;
      delete?: boolean | undefined;
      _id?: string | undefined;
    },
    "artworks/setShowArtworkModal"
  >;
}) => {
  const dispatch = AppDispatch();
  return (
    <div
      className="w-[300px] relative border shadow-md cursor-pointer"
      onClick={() => dispatch(dispatchClickFn({ show: true }))}
    >
      <div className="w-full h-[300px] relative bg-input-grey flex-center">
        <CameraIcon className="text-border-grey h-24 w-24" />
      </div>
      <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center"></div>
    </div>
  );
};

export const Artwork = ({
  title,
  images,
  posted,
  views,
  likes,
  _id,
}: ArtworkProps) => {
  const { width, height } = images[0];
  const { width: shrunkWidth, height: shrunkHeight } = setDimensionsForWindow(
    width,
    height,
    300,
    300
  );
  return (
    <div className="w-[300px] relative border shadow-md cursor-pointer">
      <div className="w-full h-[300px] relative overflow-hidden flex-center">
        <Image
          src={images[0].imageUrl}
          alt={title}
          className="absolute prevent-select override-max-w"
          width={shrunkWidth}
          height={shrunkHeight} //change this so that image has width and height
          priority
        />
      </div>
      <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
        <h2 className="w-full title-font text-xl text-center">
          {trimString(75, title)}
        </h2>
      </div>
      {posted && (
        <div className="w-full">
          <div className="flex justify-between pr-2 pb-2 pl-2">
            <p className="body-font text-sm">Likes: {likes.length}</p>
            <p className="body-font text-sm">Views: {views}</p>
          </div>
        </div>
      )}
      {posted && (
        <div
          className="absolute h-10 w-10 rounded-full bg-white right-2 top-2 border shadow-sm flex-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/gallery/${_id}`}>
            {images.length === 1 && (
              <StopIcon className={`h-6 text-royal-blue`} />
            )}
            {images.length === 2 && (
              <Square2StackIcon className={`h-6 text-royal-blue`} />
            )}
            {images.length >= 3 && (
              <Square3Stack3DIcon className={`h-6 text-royal-blue`} />
            )}
          </Link>
        </div>
      )}
    </div>
  );
};

export default function UserArtworks({
  artworks,
  loading,
  dispatchClickFn,
}: UserArtWorkProps) {
  const defaultCount = 6;
  const dispatch = AppDispatch();
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
              _updatedAt,
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
              user,
              comments,
              dateUploaded,
              dateUploadedNumber,
              dateUpdated,
              aid,
            },
          ) => (
            <div key={_id}>
              <div
                onClick={() => {
                  dispatch(
                    setShowArtworkModal({ show: true, edit: true, _id })
                  );
                  dispatch(
                    loadSavedArtwork({
                      images,
                      title,
                      comment,
                      tags,
                      isMaker,
                      isForSale,
                      price,
                      _id,
                      _updatedAt,
                      posted,
                      uid,
                      user,
                      views,
                      likes,
                      comments,
                      dateUploaded,
                      dateUploadedNumber,
                      aid,
                    })
                  );
                }}
              >
                <Artwork
                  _id={_id}
                  _updatedAt={_updatedAt}
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
                  user={user}
                  comments={comments}
                  dateUploaded={dateUploaded}
                  dateUploadedNumber={dateUploadedNumber}
                  dateUpdated={dateUpdated}
                  aid={aid}
                />
              </div>
            </div>
          )
        )}
        {placeHolders}
      </Masonry>
    );
  }
}
