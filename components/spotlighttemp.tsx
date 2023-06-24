"use client";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface Image {
  height: number;
  width: number;
  imageUrl: string;
}

interface SpotlightProps {
  index: number;
  images: Image[];
  setIndex: Dispatch<SetStateAction<number>>;
}

export default function Spotlight({ index, images, setIndex }: SpotlightProps) {
  const maxWidth = 800;
  const maxHeight = 800;
  const [imagesDisplayed, setImagesDisplayed] = useState<Image[]>([]);
  const [imagesHidden, setImagesHidden] = useState<Image[]>([]);
  const positionHidden = "opacity-0";
  // const positionExit = "origin-bottom-right rotate-[35deg] z-[1] opacity-0";
  const positionExit = "opacity-0";
  // const positionFirst = "z-[4] scale-110";
  const positionFirst = "z-[4]";
  const positionSecond = "translate-x-12 translate-y-12 rotate-[20deg] z-[3]";
  const positionThird = "-translate-x-12 -translate-y-12 rotate-[-20deg] z-[2]";
  const image =
    "prevent-select rounded-xl overflow-hidden absolute transition-all duration-1000 shadow-2xl shadow-background-black";

  useEffect(() => {
    if (index === 0) {
      setImagesDisplayed([
        { ...images[0] },
        { ...images[1] },
        { ...images[2] },
        { ...images[3] },
      ]);
      setImagesHidden(images.slice(4));
    }
    moveToNext();
    console.log(imagesDisplayed);
    console.log(imagesHidden);
  }, [index, images]);

  const moveToNext = () => {
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
  };

  const setMaxDimensions = (width: number, height: number) => {
    const isLandscape = width >= height;
    if (isLandscape) {
      const isTooWide = width > maxWidth;
      if (isTooWide) {
        const shrinkPercentage = maxWidth / width;
        return {
          width: maxWidth,
          height: height * shrinkPercentage,
        };
      } else {
        return {
          width,
          height,
        };
      }
    } else {
      const isTooTall = height > width;
      if (isTooTall) {
        const shrinkPercentage = maxHeight / height;
        return {
          width: width * shrinkPercentage,
          height: maxHeight,
        };
      } else {
        return {
          width,
          height,
        };
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

  if (images.length === 0) {
    return <div className="relative w-[1100px] h-[1100px]"></div>;
  } else {
    let widthOne;
    let heightOne;
    let widthTwo;
    let heightTwo;
    let widthThree;
    let heightThree;
    let widthFour;
    let heightFour;

    if (images.length < 2 && imagesDisplayed[0].imageUrl) {
      const { width: setWidthOne, height: setHeightOne } = setMaxDimensions(
        imagesDisplayed[0].width,
        imagesDisplayed[0].height
      );
      widthOne = setWidthOne;
      heightOne = setHeightOne;
    }

    if (images.length < 3 && imagesDisplayed[1].imageUrl) {
      const { width: setWidthTwo, height: setHeightTwo } = setMaxDimensions(
        imagesDisplayed[1].width,
        imagesDisplayed[1].height
      );
      widthTwo = setWidthTwo;
      heightTwo = setHeightTwo;
    }

    if (images.length < 4 && imagesDisplayed[2].imageUrl) {
      const { width: setWidthThree, height: setHeightThree } = setMaxDimensions(
        imagesDisplayed[2].width,
        imagesDisplayed[2].height
      );
      widthThree = setWidthThree;
      heightThree = setHeightThree;
    }

    if (images.length < 5 && imagesDisplayed[3].imageUrl) {
      const { width: setWidthFour, height: setHeightFour } = setMaxDimensions(
        imagesDisplayed[3].width,
        imagesDisplayed[3].height
      );
      widthFour = setWidthFour;
      heightFour = setHeightFour;
    }

    return (
      <div
        className="flex justify-center items-center relative w-[1100px] h-[1100px] cursor-pointer"
        onClick={() => setIncrement()}
      >
        {images.length === 1 && (
          <>
            {imagesDisplayed[0].imageUrl && (
              <Image
                // src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                src={"/pictures/portrait_pic.jpg"}
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
                width={widthOne}
                height={heightOne}
              />
            )}
          </>
        )}
        {images.length === 2 && (
          <>
            {imagesDisplayed[0].imageUrl && (
              <Image
                // src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                src={"/pictures/portrait_pic.jpg"}
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
                width={widthOne}
                height={heightOne}
              />
            )}
            {imagesDisplayed[1].imageUrl && (
              <Image
                // src={imagesDisplayed[0] ? imagesDisplayed[0].imageUrl : ""}
                src={"/pictures/portrait_pic.jpg"}
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
                width={widthTwo}
                height={heightTwo}
              />
            )}
          </>
        )}
        {images.length === 3 && <div>3 pic</div>}
        {images.length === 4 && <div>4 pic</div>}
        {images.length > 4 && (
          <>
            <ArrowPathIcon className="prevent-click top-12 right-0 absolute h-6 text-royal-blue" />
            {imagesDisplayed[0].imageUrl && (
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
                width={widthOne}
                height={heightOne}
              />
            )}
            {imagesDisplayed[1].imageUrl && (
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
                width={widthTwo}
                height={heightTwo}
              />
            )}
            {imagesDisplayed[2].imageUrl && (
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
                    ? positionHidden
                    : ""
                }`}
                alt="alt"
                width={widthThree}
                height={heightThree}
              />
            )}
            {imagesDisplayed[3].imageUrl && (
              <Image
                src={imagesDisplayed[3] ? imagesDisplayed[3].imageUrl : ""}
                className={`${image} ${
                  (index % 4) + 3 === 3
                    ? positionHidden
                    : (index % 4) + 2 == 3
                    ? positionThird
                    : (index % 4) + 1 == 3
                    ? positionSecond
                    : index % 4 == 3
                    ? positionFirst
                    : ""
                }`}
                alt="alt"
                width={widthFour}
                height={heightFour}
              />
            )}
          </>
        )}
      </div>
    );
  }
}
