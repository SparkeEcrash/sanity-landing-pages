"use client";
import Link from "next/link";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { trimString } from "utils";
import CircleLoader from "react-spinners/CircleLoader";
import { CameraIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { setDimensionsForWindow, getDefaultUserAvatar } from "utils";

interface DisplayArtworksProps {
  artworks: ArtworkProps[];
  loading: boolean;
  breakPoints?: number;
  defaultCount?: number;
}

const LoadingArtwork = () => (
  <div className="w-[350px] relative border shadow-md">
    <div className="w-full h-[350px] relative bg-input-grey flex-center">
      <CircleLoader color="#153084" size={100} />
    </div>
    <div className="flex flex-col min-h-[103px] p-2 relative w-full overflow-hidden justify-center"></div>
  </div>
);

const PlaceHolderArtwork = () => {
  return (
    <Link href={`/gallery`}>
      <div className="w-[350px] relative border shadow-md cursor-pointer">
        <div className="w-full h-[350px] relative bg-input-grey flex-center">
          <CameraIcon className="text-border-grey h-24 w-24" />
        </div>
        <div className="flex flex-col min-h-[103px] p-2 relative w-full overflow-hidden justify-center"></div>
      </div>
    </Link>
  );
};

export const Artwork = ({
  title,
  images,
  posted,
  views,
  likes,
  _id,
  user,
  isMaker,
}: ArtworkProps) => {
  const { width, height } = images[0];
  const { width: shrunkWidth, height: shrunkHeight } = setDimensionsForWindow(
    width,
    height,
    350,
    350
  );
  let userImage;
  let name;
  if (user) {
    userImage = user.image;
    name = user.name;
  } else {
    userImage = getDefaultUserAvatar();
    name = "Unknown";
  }
  return (
    <Link href={`/gallery/${_id}`}>
      <div className="w-[350px] relative border shadow-md cursor-pointer">
        <div className="w-full h-[350px] relative overflow-hidden flex-center">
          <Image
            src={images[0].imageUrl}
            alt={title}
            className="h-[350px] object-cover absolute prevent-select override-max-w peer"
            width={shrunkWidth}
            height={shrunkHeight}
            priority
          />
          <div className="absolute w-full h-full bg-gradient-to-b from-black/[.5] opacity-0 flex-center peer-hover:opacity-100 hover:opacity-100 transition-all duration-100">
            <div className="absolute top-5 left-5 flex items-center">
              <Image
                src={userImage}
                alt={title}
                className="h-[50px] object-cover prevent-select override-max-w peer rounded-full"
                width={50}
                height={50}
                priority
              />
              <div className="ml-3 body-font text-white text-base">
                <div className="text-xs">
                  {isMaker ? "Artwork created by" : "Picture posted by"}
                </div>
                <div className="text-base">{name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
          <h2 className="w-full title-font text-xl text-center">
            {trimString(75, title)}
          </h2>
        </div>
        {posted && (
          <div className="w-full bg-white">
            <div className="flex justify-between pr-2 pb-2 pl-2">
              <p className="body-font text-sm">
                Likes: {likes ? likes.length : 0}
              </p>
              <p className="body-font text-sm">Views: {views}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function DisplayArtworks({
  artworks,
  loading,
  breakPoints = 3,
  defaultCount = 6,
}: DisplayArtworksProps) {
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
        breakpointCols={breakPoints}
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
          <PlaceHolderArtwork />
        </div>
      );
    }
    return (
      <Masonry
        breakpointCols={breakPoints}
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
            <PlaceHolderArtwork />
          </div>
        );
      }
    }
    return (
      <Masonry
        breakpointCols={breakPoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {artworks.map(
          ({
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
          }) => (
            <div key={_id}>
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
          )
        )}
        {placeHolders}
      </Masonry>
    );
  }
}
