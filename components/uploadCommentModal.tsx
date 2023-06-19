"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "components/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch, useAppSelector } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import {
  onChangeComment,
  findGallery,
  fetchAddComment,
  fetchUpdateComment,
  fetchDeleteComment,
} from "@redux/features/gallerySlice";
import { setMaxDimensions } from "utils";

interface UploadCommentModalProps {
  show: boolean;
  setShow?: (show: boolean) => void;
  title?: string;
  dispatchSetShow?: ActionCreatorWithPayload<any, string>;
  clickOut?: boolean;
}

export default function UploadCommentModal({
  show,
  setShow,
  title,
  dispatchSetShow,
  clickOut,
}: UploadCommentModalProps) {
  const dispatch = AppDispatch();
  const {
    comment,
    artwork,
    isSendingComment,
    editCommentModal,
    deleteCommentModal,
    toUpdateCommentId,
  } = useAppSelector(findGallery);
  const { aid } = artwork;
  const [errors, setErrors] = useState({
    comment: false,
  });
  const errorMessages = {
    comment: "Please enter a comment",
  };
  const setModalShow = (boolean: boolean) =>
    setShow ? setShow(boolean) : dispatch(dispatchSetShow!(boolean));

  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const sendComment = () => {
    if (comment.trim().length === 0) {
      return;
    }
    if (editCommentModal) {
      dispatch(fetchUpdateComment({ comment, comment_id: toUpdateCommentId }));
    } else if (deleteCommentModal) {
      dispatch(fetchDeleteComment({ comment_id: toUpdateCommentId, aid }));
    } else {
      dispatch(fetchAddComment({ comment, aid }));
    }
  };

  const commentImage = artwork.images[0];

  const { width, height } = setMaxDimensions(
    commentImage.width,
    commentImage.height,
    400,
    400
  );

  return (
    <div
      className="fixed z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setModalShow(false)}
    >
      <div
        className="min-w-[800px] bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
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
            <h1 className="title-font">
              {title ? title : "Please Enter Your Comment"}
            </h1>
            <div className={`mt-10 relative`}>
              <Image
                width={width}
                className={"mx-auto shadow-md"}
                height={height}
                src={commentImage.imageUrl}
                alt={title!}
              />
            </div>
          </div>
          <p className="title-font text-base mt-10">Comment</p>
          <textarea
            className="input-style h-48 scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey"
            value={comment}
            disabled={isSendingComment || deleteCommentModal}
            onChange={(e) => {
              dispatch(onChangeComment(e.target.value));
            }}
          />
          {errors.comment && (
            <div>
              <p className="body-font text-red-500">{errorMessages.comment}</p>
            </div>
          )}
        </div>
        <div className="p-14 flex justify-evenly">
          {!deleteCommentModal ? (
            <>
              {" "}
              <Button
                text="Clear"
                disabled={isSendingComment}
                clickFn={() => {
                  dispatch(onChangeComment(""));
                }}
              />
              <Button
                text={`${editCommentModal ? "Update" : "Post"}`}
                disabled={isSendingComment}
                clickFn={() => sendComment()}
              />
            </>
          ) : (
            <Button
              text="Delete"
              disabled={isSendingComment}
              clickFn={() => {
                sendComment();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
