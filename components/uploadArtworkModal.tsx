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
  fetchDeleteUserArtwork,
  getArtworks,
  ArtworkFormData as ArtworkFormDataInterface,
  resetArtwork,
} from "@redux/features/artworksSlice";
import { getDefaultUserAvatar, imageResize } from "@utils/index";
import { acceptedImageTypes } from "statics";

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
  const { artworkFormData } = artworks;
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [textDelete, setTextDelete] = useState<string>("");
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
  type Errors = {
    value: {
      [key: string]: any;
      images?: boolean;
      title?: boolean;
      comment?: boolean;
      tags?: boolean;
      tag?: boolean;
      tagAlreadyExists?: boolean;
      delete?: boolean;
    };
    field: string;
  };
  let errorChecks: Errors[] = [];
  const errorMessages = {
    image: "Image file type is not supported",
    images: "Please add a picture",
    title: "Please enter a title",
    comment: "Please enter a comment",
    tags: "Please add a tag",
    tag: "Please enter your tag",
    tagAlreadyExists: "The tag already exists",
    delete: "The text you entered did not match the title of the artwork",
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

  const addPictures = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      const fileList: File[] = Array.from(e.target.files);
      const myFileList = fileList.filter((file) =>
        acceptedImageTypes.includes(file.type)
      );
      if (fileList.length !== myFileList.length) {
        onChange([{ value: { ...errors, image: true }, field: "errors" }]);
      } else {
        onChange([{ value: { ...errors, image: false }, field: "errors" }]);
      }
      let myFileListResized: File[] = [];
      for (let i = 0; i < myFileList.length; i++) {
        const imageResized = await imageResize(
          myFileList[i],
          1000,
          1000,
          false
        );
        myFileListResized.push(imageResized as File);
      }
      const myFilePaths = myFileListResized.map((file) => ({
        name: file.name,
        path: URL.createObjectURL(file),
      }));
      setImages((images) => [...images, ...myFileListResized]);
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
          {
            value: { ...errors, tagAlreadyExists: true, tag: false },
            field: "errors",
          },
        ]);
      } else {
        onChange([
          { value: [...tags, tag.trim().toLowerCase()], field: "tags" },
          { value: "", field: "tag" },
          {
            value: { ...errors, tagAlreadyExists: false, tag: false },
            field: "errors",
          },
        ]);
      }
      tagInputRef.current!.focus();
    } else {
      onChange([
        {
          value: { ...errors, tag: true, tagAlreadyExists: false },
          field: "errors",
        },
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

  const confirmDelete = () => {
    const trimmedLowerCaseTextDelete = textDelete.trim().toLowerCase();
    const trimmedLowerCaseTitle = title.trim().toLowerCase();
    if (trimmedLowerCaseTextDelete === trimmedLowerCaseTitle) {
      dispatch(fetchDeleteUserArtwork({ aid }));
      onChange([{ value: { ...errors, delete: false }, field: "errors" }]);
    } else {
      onChange([{ value: { ...errors, delete: true }, field: "errors" }]);
    }
  };

  const sendData = (action: string) => {
    const titleTrimmed = title.trim();
    const commentTrimmed = comment.trim();
    errorChecks.push({
      value: {
        ...errors,
        images: images.length === 0,
        title: titleTrimmed.length === 0,
        comment: commentTrimmed.length === 0,
        tags: tags.length === 0,
      },
      field: "errors",
    });
    onChange(errorChecks);
    const errorValues = errorChecks[0].value;
    const hasError = Object.keys(errorValues).some((key) => errorValues[key]);

    if (!hasError) {
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
            title: titleTrimmed,
            comment: commentTrimmed,
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
    }
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
      className="fixed top-0 left-0 z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
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
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
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
              {errors.image && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.image}
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
                        className="object-cover prevent-select peer"
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
              {errors.images && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.images}
                </p>
              )}
              {errors.image && (
                <p className="body-font text-red-500 mt-1">
                  {errorMessages.image}
                </p>
              )}
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
                          name={comment.user ? comment.user.name : "Unknown"}
                          userImage={
                            comment.user
                              ? comment.user.image
                              : getDefaultUserAvatar()
                          }
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
              <p className="title-font text-base">Did you make the artwork?</p>
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
              <p className="title-font text-base">
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
                <p className="title-font text-base mt-10">
                  Your Suggested Price in USD
                </p>
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
              <p className="title-font text-base text-center mt-10">
                Your email address will be shared with other users interested in
                purchasing.
              </p>
            </>
          )}
        </div>
        {showDelete && (
          <div className="pt-14 pr-14 pl-14 flex flex-col">
            <p className="title-font text-base">
              Please enter the title of the artwork to confirm deleting the
              artwork
            </p>
            <input
              type="text"
              className="input-style"
              value={textDelete}
              onChange={(e) => {
                setTextDelete(e.target.value);
              }}
            />
            {errors.delete && (
              <p className="body-font text-red-500 mt-1">
                {errorMessages.delete}
              </p>
            )}
          </div>
        )}
        <div className="p-14 flex justify-evenly">
          {artworks.editArtworkModal ? (
            showDelete ? (
              <Button
                text="Confirm"
                disabled={artworks.isSendingArtwork}
                clickFn={() => confirmDelete()}
                // clickFn={() => dispatch(fetchDeleteUserArtwork({ aid }))}
              />
            ) : (
              <Button
                text="Delete"
                disabled={artworks.isSendingArtwork}
                clickFn={() => setShowDelete(true)}
                // clickFn={() => dispatch(fetchDeleteUserArtwork({ aid }))}
              />
            )
          ) : (
            <Button text="Clear" clickFn={() => dispatch(resetArtwork())} />
          )}
          <Button
            text="Save"
            disabled={artworks.isSendingArtwork}
            clickFn={() => sendData("Save")}
          />
          <Button
            text="Post"
            disabled={artworks.isSendingArtwork}
            clickFn={() => sendData("Post")}
          />
        </div>
      </div>
    </div>
  );
}
