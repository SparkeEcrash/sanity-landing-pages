"use client";
import { useEffect } from "react";
import Buttons from "@components/buttons";
import { useAppSelector, AppDispatch } from "@redux/store";
import {
  findGalleryTagsAndArtworks,
  fetchGalleryTagsAndArtworks,
  onChangeTagsSelected,
} from "../redux/features/gallerySlice";
import DisplayArtworks from "@sanity-components/displayArtworks/displayArtworks";

export default function ShowCase() {
  const dispatch = AppDispatch();
  const {
    artworksFiltered,
    tags,
    tagsSelected,
    isGettingGalleryTagsAndArtworks,
  } = useAppSelector(findGalleryTagsAndArtworks);

  useEffect(() => {
    // below keeps the artwork data and does not trigger another api request
    // artworks.length === 0 && dispatch(fetchGalleryTagsAndArtworks());
    dispatch(fetchGalleryTagsAndArtworks());
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

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-wrap justify-center py-12">
        <Buttons buttons={buttonTags} />
      </div>
      <div className="flex justify-center">
        <DisplayArtworks artworks={artworksFiltered} loading={isGettingGalleryTagsAndArtworks} />
      </div>
    </div>
  );
}
