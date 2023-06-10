"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "components/button";
import Image from "next/image";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { uploadArtwork } from "utils/postData";
import MoonLoader from "react-spinners/MoonLoader";

interface UploadArtworkModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function UploadArtworkModal({
  show,
  setShow,
}: UploadArtworkModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageDetails, setImageDetails] = useState<
    {
      name: string;
      path: string;
      dimensions?: { height: number; width: number };
    }[]
  >([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    images: false,
    name: false,
    comment: false,
    tags: false,
    tag: false,
    tagAlreadyExists: false,
  });
  const errorMessages = {
    images: "Please add a picture",
    name: "Please enter a name",
    comment: "Please enter a comment",
    tags: "Please enter a tag",
    tag: "Please enter your tag",
    tagAlreadyExists: "Please enter a different tag",
  };

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

  const removeTag = (id: number) => {
    setTags((tags) => tags.filter((tag, i) => i !== id));
  };

  const addTag = () => {
    if (tag.length !== 0) {
      const tagInput = tag.trim().toLowerCase();
      const alreadyExists = tags.includes(tagInput);
      if (alreadyExists) {
        setErrors((errors) => ({ ...errors, tagAlreadyExists: true }));
      } else {
        setTags((tags) => [...tags, tag.trim().toLowerCase()]);
        setTag("");
        setErrors((errors) => ({ ...errors, tagAlreadyExists: false }));
      }
      setErrors((errors) => ({ ...errors, tag: false }));
      tagInputRef.current!.focus();
    } else {
      setErrors((errors) => ({ ...errors, tag: true }));
      setErrors((errors) => ({ ...errors, tagAlreadyExists: false }));
    }
  };

  const sendData = (action: string) => {
    //TODO: validation check here
    const posted = action === "Post" ? true : false;
    const data = new FormData();
    const json = JSON.stringify({
      posted,
      imageDetails,
      name,
      comment,
      tags,
    });
    const blob = new Blob([json], { type: "application/json" });
    data.append("blob", blob);
    images.forEach((image) => {
      data.append("image", image);
    });
    setLoading(true);
    uploadArtwork(data).then((result) => {
      if ("success" in result) {
        setLoading(false);
        setShow(false);
      } else {
        setLoading(false);
        setShow(false);
        //TODO:pop up error modal
      }
    });
  };

  return (
    <div
      className="fixed z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => setShow(false)}
    >
      <div
        className="bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col border-b shadow-sm p-14">
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
                      key={`${i}-image`}
                      className="h-[275px] w-[275px] border shadow-md relative flex-center overflow-hidden"
                    >
                      <Image
                        src={imageDetail.path}
                        alt={"image name"}
                        fill
                        className="object-cover peer"
                        key={i}
                        onLoad={({
                          currentTarget,
                        }: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          setImageDetails((imageDetails) => {
                            imageDetails[i]["dimensions"] = {
                              height: currentTarget.naturalHeight,
                              width: currentTarget.naturalWidth,
                            };
                            return imageDetails;
                          });
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
          <p className="body-font mt-10">Name</p>
          <input
            type="text"
            className="input-style"
            onChange={(e) => {
              setName(e.target.value.trim());
            }}
          />
          {errors.name && (
            <div>
              <p className="body-font text-red-500">{errorMessages.name}</p>
            </div>
          )}
          <p className="body-font mt-10">Comment</p>
          <textarea
            className="input-style h-24"
            onChange={(e) => {
              setComment(e.target.value.trim());
            }}
          />
          {errors.comment && (
            <div>
              <p className="body-font text-red-500">{errorMessages.comment}</p>
            </div>
          )}
          <p className="body-font mt-10">Tags</p>
          <div className="flex flex-wrap gap-2 mt-2 text-royal-blue">
            {tags.map((tag, i) => (
              <div
                key={`${i}-tag`}
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
              setTag(e.target.value);
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
        </div>
        <div className="p-14 flex justify-evenly">
          <Button
            text="Close"
            clickFn={() => {
              setShow(false);
            }}
          />
          <Button text="Save" clickFn={() => sendData("Save")} />
          <Button text="Post" clickFn={() => sendData("Post")} />
        </div>
      </div>
      {loading && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bg-black/[.5] h-full w-full top-0 flex-center"
        >
          <MoonLoader
            color="rgba(255,255,255)"
            loading={true}
            size={100}
            aria-label="Loading Spinner"
          />
        </div>
      )}
    </div>
  );
}
