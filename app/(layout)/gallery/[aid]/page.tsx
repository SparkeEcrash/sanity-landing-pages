"use client";
import Link from "next/link";
import Image from "next/image";
import Comment from "components/comment";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spotlight from "@components/spotlight";
import Masonry from "react-masonry-css";
import Button from "components/button";
import Tag from "components/tag";
import { HeartIcon } from "@heroicons/react/20/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import UploadCommentModal from "components/uploadCommentModal";
import PurchaseArtworkModal from "components/purchaseArtworkModal";
import {
  fetchGalleryArtwork,
  findGallery,
  fetchToggleLike,
  setShowCommentModal,
  onChangeComment,
} from "@redux/features/gallerySlice";
import { AppDispatch, useAppSelector } from "@redux/store";
import { addMessage } from "@redux/features/messagesSlice";
import { findUser } from "@redux/features/userSlice";
import { changeDateFormat, getDefaultUserAvatar } from "utils";
import BounceLoader from "react-spinners/BounceLoader";

export default function About({ params }: { params: { aid: string } }) {
  const { artwork, isTogglingLike, showCommentModal, isArtworkNotFound } =
    useAppSelector(findGallery);
  const {
    title,
    images,
    user,
    comment,
    views,
    likes,
    isMaker,
    isForSale,
    price,
    comments,
    dateUploaded,
    tags,
    dateUpdated,
    isVisitorLiked,
  } = artwork;
  const { name, username, image: userImage, email: userEmail } = user;
  const dateToUse = dateUpdated ? dateUpdated : dateUploaded;
  const dateFormatted = changeDateFormat(dateToUse);
  const aid = params.aid;
  const { uid } = useAppSelector(findUser);
  const [index, setIndex] = useState<number>(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const dispatch = AppDispatch();
  const breakPoints = comments.length === 1 ? 1 : 2;
  useEffect(() => {
    //create a function to reset the gallery artwork so that the previous one doesn't show while new one is loading
    dispatch(fetchGalleryArtwork(aid));
  }, [aid]);

  return (
    <>
      {isArtworkNotFound ? (
        <div className="flex-center min-h-screen">
          <div className="border shadow-sm p-14 flex flex-col flex-center">
            <div>
              <QuestionMarkCircleIcon className="h-12 text-royal-blue" />
            </div>
            <h1 className="title-font mt-5">No artwork was found</h1>
            <p className="body-font mt-10 ">
              You can browse the gallery and select an artwork
            </p>
          </div>
        </div>
      ) : title ? (
        <main className="py-[100px]">
          <section>
            <div className="flex flex-col items-center justify-center">
              <Spotlight
                index={index}
                images={images}
                setIndex={setIndex}
                enableDownload={true}
                title={title}
              />
              <div className="text-center w-[1100px] relative">
                <div className="absolute right-0 top-[-30px]">
                  <div className="flex justify-end">
                    <p className="title-font text-sm prevent-select">
                      {dateFormatted &&
                        (dateUpdated
                          ? `Updated on ${dateFormatted}`
                          : `Posted on ${dateFormatted}`)}
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="title-font">{title}</h1>
                </div>
                <div className="mt-10 flex justify-center gap-x-4">
                  {tags.map((tag) => (
                    <div key={tag._id}>
                      <Tag label={tag.label} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-start gap-x-8 mt-10 ">
                  <div className="w-[69px] h-[50px] relative flex-none">
                    <Image
                      src={"/pictures/quotes_left.png"}
                      alt={"left quote"}
                      fill
                      className="relative object-cover prevent-select"
                      priority
                    />
                  </div>
                  <p className="body-font leading-loose mt-[30px] text-left">
                    {comment}
                  </p>
                  <div className="w-[69px] h-[50px] relative flex-none">
                    <Image
                      src={"/pictures/quotes_right.png"}
                      alt={"right quote"}
                      width={150}
                      height={50}
                      className="relative mx-auto object-cover prevent-select"
                      priority
                    />
                  </div>
                </div>
                <div className="mt-10">
                  <h3 className="title-font text-lg">
                    {isMaker ? "Artwork created by" : "Picture posted by"}
                    <span className="ml-2 title-font">{name}</span>
                  </h3>
                  <div className="h-[100px] w-[100px] relative mx-auto mt-10">
                    {isVisitorLiked && (
                      <AnimatePresence>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1, rotate: 360 }}
                          transition={{ duration: 1 }}
                          viewport={{ once: true }}
                        >
                          <HeartIcon className="absolute h-12 w-12 text-[#FF69B4] -rotate-12 left-[-70px]" />
                        </motion.div>
                      </AnimatePresence>
                    )}
                    <Link href={`/gallery/user/${username}`}>
                      <Image
                        src={userImage}
                        alt={`Picture of ${name}`}
                        fill
                        className="relative mx-auto object-cover prevent-select rounded-full border shadow-sm"
                        priority
                      />
                    </Link>
                  </div>
                </div>
                <div className="mt-10 flex gap-x-16 justify-center">
                  <h3 className="title-font text-lg">
                    Likes: {likes ? likes.length : 0}
                  </h3>
                  <h3 className="title-font text-lg">Views: {views}</h3>
                </div>
                <div className="mt-10 flex justify-evenly flex-wrap">
                  <Button
                    disabled={isTogglingLike}
                    text={`${
                      isVisitorLiked ? "Remove your like" : "Send a like"
                    }`}
                    clickFn={() => {
                      dispatch(
                        fetchToggleLike({
                          aid,
                          isVisitorLiked,
                        })
                      );
                      dispatch(
                        addMessage({
                          text: isVisitorLiked
                            ? "Removing your like"
                            : "Sending a like",
                          showLoading: true,
                          key: "toggling a like",
                        })
                      );
                    }}
                  />
                  {/* <Button text="Revoke your Like" /> */}
                  <Button
                    text="Leave a Comment"
                    clickFn={() => {
                      dispatch(setShowCommentModal({ show: true }));
                      dispatch(onChangeComment(""));
                    }}
                  />
                  {isForSale && (
                    <Button
                      clickFn={() => setShowPurchaseModal(true)}
                      text="Purchase artwork"
                    />
                  )}
                </div>
                {comments.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <h2 className="title-font mt-20">Comments</h2>
                    <div className="mt-10">
                      <Masonry
                        breakpointCols={breakPoints}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {comments.map((comment) => {
                          if (comment.isHidden) {
                            if (comment.uid === uid) {
                              return (
                                <div key={comment._id}>
                                  <Comment
                                    _id={comment._id}
                                    comment={comment.comment}
                                    isHidden={comment.isHidden}
                                    name={
                                      comment.user
                                        ? comment.user.name
                                        : "Unknown"
                                    }
                                    username={
                                      comment.user ? comment.user.username : ""
                                    }
                                    userImage={
                                      comment.user
                                        ? comment.user.image
                                        : getDefaultUserAvatar()
                                    }
                                    datePosted={comment.datePosted}
                                    dateUpdated={comment.dateUpdated}
                                    isAuthor={comment.uid === uid}
                                  />
                                </div>
                              );
                            }
                          } else {
                            return (
                              <div key={comment._id}>
                                <Comment
                                  _id={comment._id}
                                  comment={comment.comment}
                                  name={
                                    comment.user ? comment.user.name : "Unknown"
                                  }
                                  username={
                                    comment.user ? comment.user.username : ""
                                  }
                                  userImage={
                                    comment.user
                                      ? comment.user.image
                                      : getDefaultUserAvatar()
                                  }
                                  datePosted={comment.datePosted}
                                  dateUpdated={comment.dateUpdated}
                                  isAuthor={comment.uid === uid}
                                />
                              </div>
                            );
                          }
                        })}
                      </Masonry>
                    </div>
                  </div>
                ) : (
                  <div className="h-[150px]"></div>
                )}
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex-center min-h-screen">
          <BounceLoader color="#153084" size={100} />
        </div>
      )}
      {showCommentModal && (
        <UploadCommentModal
          show={showCommentModal}
          dispatchSetShow={setShowCommentModal}
          title={title}
        />
      )}
      {showPurchaseModal && (
        <PurchaseArtworkModal
          email={userEmail}
          price={price}
          name={name}
          show={showPurchaseModal}
          setShow={setShowPurchaseModal}
          clickOut
        />
      )}
    </>
  );
}
