"use client";
import { useState, useEffect, useRef } from "react";
import Button from "components/button";
import Comment from "components/comment";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch, useAppSelector } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import Toggle from "@components/toggle";
import { v4 as uuidv4 } from "uuid";
import {
  onChangeArtwork,
  fetchAddUserArtwork,
  fetchEditUserArtwork,
  getArtworks,
  ArtworkFormData as ArtworkFormDataInterface,
} from "@redux/features/artworksSlice";
import { addMessage } from "@redux/features/messagesSlice";

interface UploadArtworkModalProps {
  show: boolean;
  setShow?: (show: boolean) => void;
  dispatchSetShow?: ActionCreatorWithPayload<
    {
      show: boolean;
      edit?: boolean | undefined;
      delete?: boolean | undefined;
      _id?: string | undefined;
    },
    "artworks/setShowArtworkModal"
  >;
  clickOut?: boolean;
}

export default function UploadArtworkModal({
  show,
  setShow,
  dispatchSetShow,
  clickOut,
}: UploadArtworkModalProps) {
  const dispatch = AppDispatch();
  const artworks = useAppSelector(getArtworks);
  const { artworkFormData, isTogglingHideComment } = artworks;
  const [images, setImages] = useState<(File | string)[]>([
    ...artworkFormData.imagesFromRedux!,
  ]);
  const [imageDetails, setImageDetails] = useState<
    {
      name: string;
      path: string;
      dimensions?: { height: number; width: number };
    }[]
  >([...artworkFormData.imageDetailsFromRedux]);
  const {
    title,
    comment,
    tag,
    tags,
    isMaker,
    isForSale,
    price,
    errors,
    aid,
    uid,
    comments,
  } = artworkFormData;
  const errorMessages = {
    images: "Please add a picture",
    title: "Please enter a title",
    comment: "Please enter a comment",
    tags: "Please enter a tag",
    tag: "Please enter your tag",
    tagAlreadyExists: "Please enter a different tag",
  };
  const setModalShow = (boolean: boolean) =>
    setShow ? setShow(boolean) : dispatch(dispatchSetShow!({ show: boolean }));
  const ImagePlaceHolder = () => (
    <div
      className="h-[275px] w-[275px] border shadow-md relative flex-center bg-input-grey cursor-pointer"
      onClick={() => imageFileRef.current!.click()}
    >
      <CameraIcon className="text-border-grey h-24 w-24" />
    </div>
  );

  const imageFileRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const addPictures = (e: React.ChangeEvent<HTMLInputElement>) => {
    //TODO: do add image validation here

    // if (
    //   type === "image/png" ||
    //   type === "image/svg" ||
    //   type === "image/jpeg" ||
    //   type === "image/gif" ||
    //   type === "image/tiff"
    // ) {
    if (e.target.files && e.target.files.length !== 0) {
      const myFileList: File[] = Array.from(e.target.files);
      const myFilePaths = myFileList.map((file) => ({
        name: file.name,
        path: URL.createObjectURL(file),
      }));
      setImages((images) => [...images, ...myFileList]);
      setImageDetails((imageDetails) => [...imageDetails, ...myFilePaths]);
    }
  };

  const removePicture = (id: number) => {
    setImages((images) => images.filter((picture, i) => i !== id));
    setImageDetails((imageDetails) =>
      imageDetails.filter((detail, i) => i !== id)
    );
  };

  const removeTag = (index: number) => {
    onChange([
      {
        value: tags.filter((tag: string, i: number) => i !== index),
        field: "tags",
      },
    ]);
  };

  const addTag = () => {
    if (tag.length !== 0) {
      const tagInput = tag.trim().toLowerCase();
      const alreadyExists = tags.includes(tagInput);
      if (alreadyExists) {
        onChange([
          { value: { ...errors, tagAlreadyExists: true }, field: "errors" },
          { value: { ...errors, tag: false }, field: "errors" },
        ]);
      } else {
        onChange([
          { value: [...tags, tag.trim().toLowerCase()], field: "tags" },
          { value: "", field: "tag" },
          { value: { ...errors, tag: false }, field: "errors" },
        ]);
      }
      tagInputRef.current!.focus();
    } else {
      onChange([{ value: { ...errors, tag: true }, field: "errors" }]);
      onChange([
        { value: { ...errors, tagAlreadyExists: false }, field: "errors" },
      ]);
    }
  };

  const toggleHideComment = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index] = {
      ...updatedComments[index],
      isHidden: !updatedComments[index].isHidden,
      hiddenBy: uid,
    };
    onChange([{ value: updatedComments, field: "comments" }]);
  };
  const sendData = (action: string) => {
    //TODO: validation check here. check if price is 0 and error out and check for cent two digits
    const posted = action === "Post" ? true : false;
    const data = new FormData();
    const json = artworks.editArtworkModal
      ? JSON.stringify({
          posted,
          imageDetails,
          title: title.trim(),
          comment: comment.trim(),
          tags,
          isMaker,
          isForSale,
          price,
          aid,
          comments,
        })
      : JSON.stringify({
          posted,
          imageDetails,
          title: title.trim(),
          comment: comment.trim(),
          tags,
          isMaker,
          isForSale,
          price,
        });
    const blob = new Blob([json], { type: "application/json" });
    data.append("blob", blob);
    images.forEach((image) => {
      data.append("image", image);
    });
    artworks.editArtworkModal
      ? dispatch(fetchEditUserArtwork(data))
      : dispatch(fetchAddUserArtwork(data));
  };

  const onChange = (inputs: { value: any; field: string }[]) => {
    const validKeys = [
      "title",
      "comment",
      "tag",
      "tags",
      "isMaker",
      "isForSale",
      "price",
      "errors",
      "comments",
    ];
    let artworkForm = { ...artworkFormData };
    inputs.forEach(({ value, field }) => {
      if (validKeys.includes(field)) {
        artworkForm[field as keyof ArtworkFormDataInterface] = value;
      }
    });
    dispatch(onChangeArtwork(artworkForm));
  };

  return (
    <div
      className="fixed z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setModalShow(false)}
    >
      <div
        className="bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col border-b shadow-sm p-14">
          <div>
            <XMarkIcon
              className="text-royal-blue absolute h-8 top-5 left-5 prevent-select cursor-pointer"
              onClick={() => setModalShow(false)}
            />
          </div>
          <div className="text-center">
            <h1 className="title-font">Upload your artwork</h1>
          </div>
          <p className="body-font mt-5 mb-5">
            You can upload multiple pictures of your artwork taken from
            different angles or settings
          </p>
          <input
            type="file"
            hidden
            ref={imageFileRef}
            onChange={(e) => {
              addPictures(e);
            }}
            multiple
          />
          {images.length === 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ImagePlaceHolder />
                <ImagePlaceHolder />
                <ImagePlaceHolder />
              </div>
              {errors.images && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.images}
                </p>
              )}
              <Button
                clickFn={() => imageFileRef.current!.click()}
                text="Add pictures"
                className="mx-auto mt-10"
              ></Button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imageDetails.map((imageDetail, i) => {
                  return (
                    <div
                      key={`image-${uuidv4()}`}
                      className="h-[275px] w-[275px] border shadow-md relative flex-center overflow-hidden"
                    >
                      <Image
                        src={imageDetail.path}
                        alt={imageDetail.name}
                        fill
                        className="object-cover peer"
                        onLoad={({
                          currentTarget,
                        }: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          if (!imageDetails[i]["dimensions"]) {
                            setImageDetails((imageDetails) => {
                              imageDetails[i]["dimensions"] = {
                                height: currentTarget.naturalHeight,
                                width: currentTarget.naturalWidth,
                              };
                              return imageDetails;
                            });
                          }
                        }}
                      />
                      <div className="absolute w-full h-full bg-black/[.5] translate-x-[275px] flex-center peer-hover:translate-x-0 hover:translate-x-0 transition-all duration-100">
                        <Button
                          className="absolute transition-all duration-200"
                          text="Remove"
                          clickFn={() => removePicture(i)}
                        />
                      </div>
                    </div>
                  );
                })}
                {images.length === 1 && (
                  <>
                    <ImagePlaceHolder />
                    <ImagePlaceHolder />
                  </>
                )}
                {images.length === 2 && <ImagePlaceHolder />}
              </div>
              <Button
                clickFn={() => imageFileRef.current!.click()}
                text="Add Pictures"
                className="mx-auto mt-10"
              />
            </div>
          )}
          <p className="title-font text-base mt-10">Title</p>
          <input
            type="text"
            className="input-style"
            value={title}
            onChange={(e) => {
              onChange([{ value: e.target.value, field: "title" }]);
            }}
          />
          {errors.title && (
            <div>
              <p className="body-font text-red-500">{errorMessages.title}</p>
            </div>
          )}
          <p className="title-font text-base mt-10">Comment</p>
          <textarea
            className="input-style h-24"
            value={comment}
            onChange={(e) => {
              onChange([{ value: e.target.value, field: "comment" }]);
            }}
          />
          {errors.comment && (
            <div>
              <p className="body-font text-red-500">{errorMessages.comment}</p>
            </div>
          )}
          <p className="title-font text-base mt-10">Tags</p>
          <div className="flex flex-wrap gap-2 mt-2 text-royal-blue">
            {tags.map((tag, i) => (
              <div
                key={`tag-${uuidv4()}`}
                className="relative flex overflow-hidden prevent-select"
              >
                <div className="p-5 text-2xl font-serif border shadow-sm cursor-pointer peer">
                  {tag}
                </div>
                <div
                  className="absolute w-full h-full bg-black/[.5] translate-x-[100vw] flex-center peer-hover:translate-x-0 hover:translate-x-0 transition-all duration-100 cursor-pointer"
                  onClick={() => removeTag(i)}
                >
                  <XMarkIcon className="text-white h-12 w-12" />
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            className="input-style"
            value={tag}
            onChange={(e) => {
              onChange([{ value: e.target.value.trim(), field: "tag" }]);
              // setTag(e.target.value);
            }}
            ref={tagInputRef}
          />
          {errors.tags && (
            <div>
              <p className="body-font text-red-500">{errorMessages.tags}</p>
            </div>
          )}
          {errors.tag && (
            <div>
              <p className="body-font text-red-500">{errorMessages.tag}</p>
            </div>
          )}
          {errors.tagAlreadyExists && (
            <div>
              <p className="body-font text-red-500">
                {errorMessages.tagAlreadyExists}
              </p>
            </div>
          )}
          <div className="mx-auto mt-10">
            <Button text="Add tag" clickFn={() => addTag()} />
          </div>
          {comments.length > 0 && (
            <div className={`mt-10`}>
              <p className="title-font text-base">Comments</p>
              <div className={`flex justify-center mt-2`}>
                <Masonry
                  breakpointCols={1}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {comments.map((comment, i) => (
                    <div className="flex" key={comment._id}>
                      <div>
                        <Comment
                          _id={comment._id}
                          isHidden={comment.isHidden}
                          comment={comment.comment}
                          name={comment.name}
                          userImage={comment.userImage}
                          datePosted={comment.datePosted}
                          dateUpdated={comment.dateUpdated}
                        />
                      </div>
                      <Button
                        text={`${comment.isHidden ? "Show" : "Hide"}`}
                        className={"w-[105px]"}
                        clickFn={() => {
                          toggleHideComment(i);
                        }}
                        noHover
                      />
                    </div>
                  ))}
                </Masonry>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <div className="flex mt-10 items-center">
              <p className="body-font">Did you make the artwork?</p>
              <Toggle
                yesno={true}
                toggle={isMaker}
                clickFn={() => {
                  onChange([{ value: !isMaker, field: "isMaker" }]);
                  // setIsMaker((isMaker) => !isMaker);
                }}
                className="ml-5"
              />
            </div>
            <div className="flex mt-10 items-center">
              <p className="body-font">
                Is the artwork available for purchase?
              </p>
              <Toggle
                yesno={true}
                toggle={isForSale}
                clickFn={() => {
                  onChange([{ value: !isForSale, field: "isForSale" }]);
                  // setIsForSale((isForSale) => !isForSale);
                }}
                className="ml-5"
              />
            </div>
          </div>
          {isForSale && (
            <>
              <div className="text-center">
                <p className="body-font mt-10">Your Suggested Price in USD</p>
                <i className="body-font mr-5">$</i>
                <input
                  type="number"
                  value={price}
                  className="input-style"
                  onChange={(e) => {
                    onChange([{ value: e.target.value, field: "price" }]);
                    // setPrice(e.target.value);
                  }}
                ></input>
              </div>
              <p className="body-font text-center mt-10">
                Your email address will be shared with other users interested in
                purchasing.
              </p>
            </>
          )}
        </div>
        <div className="p-14 flex justify-evenly">
          <Button text="Clear" />
          <Button text="Save" clickFn={() => sendData("Save")} />
          <Button text="Post" clickFn={() => sendData("Post")} />
        </div>
      </div>
    </div>
  );
}
