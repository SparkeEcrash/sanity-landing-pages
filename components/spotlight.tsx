"use client";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import Image from "next/image";
import {
  StopIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import BounceLoader from "react-spinners/BounceLoader";
import { setMaxDimensions } from "utils";

interface Image {
  height: number;
  width: number;
  imageUrl: string;
}

interface SpotlightProps {
  index: number;
  images: Image[];
  setIndex: Dispatch<SetStateAction<number>>;
  maxWidth: number;
  maxHeight: number;
}

export default function Spotlight({
  index,
  images,
  setIndex,
  maxWidth,
  maxHeight,
}: SpotlightProps) {
  const [imagesDisplayed, setImagesDisplayed] = useState<Image[]>([]);
  const [imagesHidden, setImagesHidden] = useState<Image[]>([]);
  const positionHidden = "opacity-0";
  const positionExit = "hidden";
  // const positionFirst = "z-[4] scale-110";
  const positionFirst = "z-[4]";
  const positionSecond = "translate-x-12 translate-y-12 rotate-[20deg] z-[3]";
  const positionThird = "-translate-x-12 -translate-y-12 rotate-[-20deg] z-[2]";
  const positionFourth = "-translate-x-24 -translate-y-24";
  const image =
    "prevent-select overflow-hidden absolute transition-all duration-1000 shadow-2xl shadow-background-black";

  useEffect(() => {
    setImagesDisplayed([
      { ...images[0] },
      { ...images[1] },
      { ...images[2] },
      { ...images[3] },
    ]);
    setImagesHidden(images.slice(4));
  }, [images]);

  useEffect(() => {
    moveToNext();
  }, [index]);

  const moveToNext = () => {
    if (images.length >= 5) {
      if (index % 4 === 1) {
        const cardToAdd = { ...imagesDisplayed[0] };
        setImagesDisplayed([
          { ...imagesHidden[0] },
          { ...imagesDisplayed[1] },
          { ...imagesDisplayed[2] },
          { ...imagesDisplayed[3] },
        ]);
        setImagesHidden([...imagesHidden, cardToAdd].slice(1));
      }
      if (index % 4 === 2) {
        const cardToAdd = { ...imagesDisplayed[1] };
        setImagesDisplayed([
          { ...imagesDisplayed[0] },
          { ...imagesHidden[0] },
          { ...imagesDisplayed[2] },
          { ...imagesDisplayed[3] },
        ]);
        setImagesHidden([...imagesHidden, cardToAdd].slice(1));
      }
      if (index % 4 === 3) {
        const cardToAdd = { ...imagesDisplayed[2] };
        setImagesDisplayed([
          { ...imagesDisplayed[0] },
          { ...imagesDisplayed[1] },
          { ...imagesHidden[0] },
          { ...imagesDisplayed[3] },
        ]);
        setImagesHidden([...imagesHidden, cardToAdd].slice(1));
      }
      if (index % 4 === 0 && index !== 0) {
        const cardToAdd = { ...imagesDisplayed[3] };
        setImagesDisplayed([
          { ...imagesDisplayed[0] },
          { ...imagesDisplayed[1] },
          { ...imagesDisplayed[2] },
          { ...imagesHidden[0] },
        ]);
        setImagesHidden([...imagesHidden, cardToAdd].slice(1));
      }
    }
  };

  const setIncrement = () => {
    if (images.length > 1) {
      setIndex((index) => index + 1);
    }
    if (images.length) {
      return;
    }
  };

  const ChangeMode = () => (
    <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
      <StopIcon className="prevent-click bottom-[40px] left-0 absolute h-6 text-royal-blue" />
      <Square2StackIcon className="prevent-click bottom-[64px] left-0 absolute h-6 text-royal-blue" />
      <Square3Stack3DIcon className="prevent-click bottom-[88px] left-0 absolute h-6 text-royal-blue" />
    </div>
  );

  if (images.length === 0) {
    return (
      <div className="relative w-[1100px] h-[1100px] flex-center">
        <BounceLoader color="#153084" size={100} />
      </div>
    );
  } else {
    const dimensions = imagesDisplayed.map((image) => {
      const { width, height } = setMaxDimensions(
        image.width,
        image.height,
        maxWidth,
        maxHeight
      );
      return {
        width,
        height,
      };
    });

    return (
      <div
        className="flex justify-center items-center relative w-[1100px] h-[1100px] cursor-pointer"
        onClick={() => setIncrement()}
      >
        {images.length === 1 && (
          <>
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <Image
                src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                className={`${image} ${positionFirst}`}
                alt="alt"
                width={dimensions[0].width}
                height={dimensions[0].height}
              />
            )}
          </>
        )}
        {images.length === 2 && (
          <>
            <ChangeMode />
            <ArrowUturnLeftIcon className="prevent-click top-12 right-0 absolute h-6 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <Image
                src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                className={`${image} ${
                  index % 2 === 0 ? positionFirst : positionFourth
                }`}
                alt="alt"
                width={dimensions[0].width}
                height={dimensions[0].height}
              />
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <Image
                src={imagesDisplayed[1] ? imagesDisplayed[1].imageUrl : ""}
                className={`${image} ${
                  index % 2 === 0 ? positionFourth : positionFirst
                }`}
                alt="alt"
                width={dimensions[1].width}
                height={dimensions[1].height}
              />
            )}
          </>
        )}
        {images.length === 3 && (
          <>
            <ChangeMode />
            <ArrowUturnLeftIcon className="prevent-click top-12 right-0 absolute h-6 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <Image
                src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                className={`${image} ${
                  index % 3 === 0
                    ? positionFirst
                    : index % 3 === 1
                    ? positionThird
                    : index % 3 === 2
                    ? positionSecond
                    : ""
                }`}
                alt="alt"
                width={dimensions[0].width}
                height={dimensions[0].height}
              />
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <Image
                src={imagesDisplayed[1] ? imagesDisplayed[1].imageUrl : ""}
                className={`${image} ${
                  index % 3 === 0
                    ? positionSecond
                    : index % 3 === 1
                    ? positionFirst
                    : index % 3 === 2
                    ? positionThird
                    : ""
                }`}
                alt="alt"
                width={dimensions[1].width}
                height={dimensions[1].height}
              />
            )}
            {imagesDisplayed[2] && imagesDisplayed[2].imageUrl && (
              <Image
                src={imagesDisplayed[2] ? imagesDisplayed[2].imageUrl : ""}
                className={`${image} ${
                  index % 3 === 0
                    ? positionThird
                    : index % 3 === 1
                    ? positionSecond
                    : index % 3 === 2
                    ? positionFirst
                    : ""
                }`}
                alt="alt"
                width={dimensions[2].width}
                height={dimensions[2].height}
              />
            )}
          </>
        )}
        {images.length > 3 && (
          <>
            <ChangeMode />
            <ArrowUturnLeftIcon className="prevent-click top-12 right-0 absolute h-6 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <Image
                src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                className={`${image} ${
                  index % 4 === 0 % 4
                    ? positionFirst
                    : (index % 4) - 1 == 0
                    ? positionExit
                    : (index % 4) - 2 == 0
                    ? positionThird
                    : (index % 4) - 3 == 0
                    ? positionSecond
                    : ""
                }`}
                alt="alt"
                width={dimensions[0].width}
                height={dimensions[0].height}
              />
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <Image
                src={imagesDisplayed[1] ? imagesDisplayed[1].imageUrl : ""}
                className={`${image} ${
                  (index % 4) + 1 === 1
                    ? positionSecond
                    : index % 4 == 1
                    ? positionFirst
                    : (index % 4) - 1 == 1
                    ? positionExit
                    : (index % 4) - 2 == 1
                    ? positionThird
                    : ""
                }`}
                alt="alt"
                width={dimensions[1].width}
                height={dimensions[1].height}
              />
            )}
            {imagesDisplayed[2] && imagesDisplayed[2].imageUrl && (
              <Image
                src={imagesDisplayed[2] ? imagesDisplayed[2].imageUrl : ""}
                className={`${image} ${
                  (index % 4) + 2 === 2
                    ? positionThird
                    : (index % 4) + 1 == 2
                    ? positionSecond
                    : index % 4 == 2
                    ? positionFirst
                    : (index % 4) - 1 == 2
                    ? positionExit
                    : ""
                }`}
                alt="alt"
                width={dimensions[2].width}
                height={dimensions[2].height}
              />
            )}
            {imagesDisplayed[3] && imagesDisplayed[3].imageUrl && (
              <Image
                src={imagesDisplayed[3] ? imagesDisplayed[3].imageUrl : ""}
                className={`${image} ${
                  (index % 4) + 3 === 3
                    ? positionExit
                    : (index % 4) + 2 == 3
                    ? positionThird
                    : (index % 4) + 1 == 3
                    ? positionSecond
                    : index % 4 == 3
                    ? positionFirst
                    : ""
                }`}
                alt="alt"
                width={dimensions[3].width}
                height={dimensions[3].height}
              />
            )}
          </>
        )}
      </div>
    );
  }
}
