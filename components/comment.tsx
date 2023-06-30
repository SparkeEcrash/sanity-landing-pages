import Image from "next/image";
import { changeDateFormat } from "utils";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
  onChangeComment,
  setShowCommentModal,
} from "@redux/features/gallerySlice";

interface CommentProps {
  _id: string;
  comment: string;
  name: string;
  userImage: string;
  datePosted: string;
  dateUpdated?: string;
  isAuthor?: boolean;
  isHidden?: boolean;
}

export default function Comment({
  _id,
  comment,
  name,
  userImage,
  datePosted,
  dateUpdated,
  isAuthor,
  isHidden,
}: CommentProps) {
  const dateFormatted = dateUpdated
    ? changeDateFormat(dateUpdated)
    : changeDateFormat(datePosted);
  const dispatch = AppDispatch();
  return (
    <div
      className={`${
        isAuthor && "group/comment"
      } border shadow-md p-4 w-[500px] ${isHidden && "opacity-50"} relative`}
    >
      <div className="flex items-start gap-x-4">
        <div className="w-[40px] h-[29px] relative flex-none">
          <Image
            src={"/pictures/quotes_left.png"}
            alt={"Left Quote Picture"}
            width={150}
            height={50}
            className="relative mx-auto object-cover prevent-select"
            priority
          />
        </div>
        <p className="body-font leading-loose mt-[5px] text-left mx-auto">
          {comment}
        </p>
        <div className="w-[40px] h-[29px] relative flex-none">
          <Image
            src={"/pictures/quotes_right.png"}
            alt={"Right Quote Picture"}
            width={150}
            height={50}
            className="relative mx-auto object-cover prevent-select"
            priority
          />
        </div>
      </div>
      <div className="mt-5">
        <h3 className="title-font text-lg text-center">
          from
          <span className="ml-2 title-font text-lg">{name}</span>
        </h3>
        <div className="h-[100px] w-[100px] relative mx-auto mt-5">
          <Image
            src={userImage}
            alt={`Picture of ${name}`}
            fill
            className="relative mx-auto object-cover prevent-select rounded-full border"
            priority
          />
        </div>
        <div className="flex mt-5">
          <div className="flex-1">
            <PencilSquareIcon
              className={`hidden h-6 text-royal-blue cursor-pointer group-hover/comment:block`}
              onClick={() => {
                dispatch(setShowCommentModal({ show: true, edit: true, _id }));
                dispatch(onChangeComment(comment));
              }}
            />
          </div>
          <div className="flex-1 flex justify-center title-font text-sm text-center h-[25px]">
            {isHidden ? (
              "Hidden"
            ) : (
              <>
                {dateUpdated ? "Updated" : "Posted"} on {dateFormatted}
              </>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            <XCircleIcon
              className={`hidden h-6 text-royal-blue cursor-pointer group-hover/comment:block`}
              onClick={() => {
                dispatch(
                  setShowCommentModal({ show: true, delete: true, _id })
                );
                dispatch(onChangeComment(comment));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
