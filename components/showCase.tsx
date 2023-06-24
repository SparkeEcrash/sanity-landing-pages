"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Buttons from "@components/buttons";
import Masonry from "react-masonry-css";
import { useAppSelector, AppDispatch } from "@redux/store";
import {
  findGalleryTagsAndArtworks,
  fetchGalleryTagsAndArtworks,
  onChangeTagsSelected,
} from "../redux/features/gallerySlice";
import { setDimensionsForWindow, trimString } from "utils";

export default function ShowCase() {
  const dispatch = AppDispatch();
  const { artworks, artworksFiltered, tags, tagsSelected } = useAppSelector(
    findGalleryTagsAndArtworks
  );

  useEffect(() => {
    if (artworks.length === 0) {
      dispatch(fetchGalleryTagsAndArtworks());
    }
  }, []);

  const buttonTags = tags.map((tag) => {
    return {
      text: tag.label,
      count: tag.count,
      id: tag._id,
      clickFn: () => onTagSelect({ label: tag.label, _id: tag._id }),
      dark: tagsSelected.some((tagDoc: TagProps) => tagDoc.label === tag.label),
    };
  });

  const onTagSelect = (tag: { label: string; _id: string }) => {
    const selectedTags = [...tagsSelected];
    const existingTag = selectedTags.find(
      (tagDoc: TagProps) => tagDoc.label === tag.label
    );
    if (existingTag) {
      dispatch(
        onChangeTagsSelected(
          selectedTags.filter((tagDoc: TagProps) => tagDoc.label !== tag.label)
        )
      );
    } else {
      dispatch(onChangeTagsSelected([...tagsSelected, tag]));
    }
  };

  const breakPoints = artworksFiltered.length > 2 ? 3 : artworksFiltered.length;

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-wrap justify-center py-12">
        <Buttons buttons={buttonTags} />
      </div>
      <div className="flex justify-center">
        <Masonry
          breakpointCols={breakPoints}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {artworksFiltered.map(
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
              name,
              userImage,
              userEmail,
              username,
              comments,
              dateUploaded,
              dateUploadedNumber,
              dateUpdated,
              aid,
            }) => (
              <div key={_id}>
                <div>
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
                    name={name}
                    userImage={userImage}
                    userEmail={userEmail}
                    username={username}
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
        </Masonry>
      </div>
    </div>
  );
}

const Artwork = ({
  title,
  images,
  posted,
  views,
  likes,
  _id,
  name,
  userImage,
  isMaker,
}: ArtworkProps) => {
  const { width, height } = images[0];
  const { width: shrunkWidth, height: shrunkHeight } = setDimensionsForWindow(
    width,
    height,
    350,
    350
  );
  return (
    <Link href={`/gallery/${_id}`}>
      <div className="w-[350px] relative border shadow-md cursor-pointer">
        <div className="w-full h-[350px] relative overflow-hidden flex-center">
          <Image
            src={images[0].imageUrl}
            alt={title}
            className="absolute prevent-select override-max-w peer"
            width={shrunkWidth}
            height={shrunkHeight} //change this so that image has width and height
            priority
          />
          <div className="absolute w-full h-full bg-gradient-to-b from-black/[.5] opacity-0 flex-center peer-hover:opacity-100 hover:opacity-100 transition-all duration-100">
            <div className="absolute top-5 left-5 flex items-center">
              <Image
                src={userImage}
                alt={title}
                className="prevent-select override-max-w peer rounded-full"
                width={50}
                height={50} //change this so that image has width and height
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
              <p className="body-font text-sm">Likes: {likes.length}</p>
              <p className="body-font text-sm">Views: {views}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
