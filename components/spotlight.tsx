"use client";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import Image from "next/image";
import {
  StopIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
  ArrowUturnLeftIcon,
  FolderArrowDownIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
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
  enableDownload?: boolean;
  title?: string;
}

export default function Spotlight({
  index,
  images,
  setIndex,
  enableDownload,
  title,
}: SpotlightProps) {
  const [imagesDisplayed, setImagesDisplayed] = useState<Image[]>([]);
  const [imagesHidden, setImagesHidden] = useState<Image[]>([]);
  const [view, setView] = useState<"" | "single" | "double" | "triple">("");
  const [dimensionSize, setDimensionSize] = useState<"small" | "big">("small");
  let maxWidth = 500;
  let maxHeight = 500;
  let windowSize = "w-[750px] h-[750px]";
  let offset = 12;
  let offsetTwo = 6;
  if (dimensionSize === "big") {
    maxWidth = 750;
    maxHeight = 750;
    windowSize = "w-[1100px] h-[1100px]";
  } else if (dimensionSize === "small") {
    maxWidth = 500;
    maxHeight = 500;
    windowSize = "w-[750px] h-[750px]";
  }
  let positionExit = "hidden";
  const positionFirst = "z-[4]";
  let positionSecond = "";
  let positionThird = "";

  if (view === "single") {
    if (dimensionSize === "big") {
      positionSecond = `-translate-x-24 -translate-y-24 opacity-0`;
      positionThird = `translate-x-24 -translate-y-24 opacity-0`;
    } else {
      positionSecond = `-translate-x-12 -translate-y-12 opacity-0`;
      positionThird = `translate-x-12 -translate-y-12 opacity-0`;
    }
  }
  if (view === "double") {
    if (dimensionSize === "big") {
      positionSecond = `-translate-x-24 -translate-y-24`;
      positionThird = `translate-x-24 -translate-y-24 opacity-0`;
    } else {
      positionSecond = `-translate-x-12 -translate-y-12`;
      positionThird = `translate-x-12 -translate-y-12 opacity-0`;
    }
  }
  if (view === "triple") {
    if (dimensionSize === "big") {
      positionSecond = `translate-x-12 translate-y-12 rotate-[20deg] z-[3]`;
      positionThird = `-translate-x-12 -translate-y-12 rotate-[-20deg] z-[2]`;
    } else {
      positionSecond = `translate-x-6 translate-y-6 rotate-[20deg] z-[3]`;
      positionThird = `-translate-x-6 -translate-y-6 rotate-[-20deg] z-[2]`;
    }
  }

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
    if (images.length === 1) {
      setView("single");
    }
    if (images.length === 2) {
      setView("double");
    }
    if (images.length >= 3) {
      setView("triple");
    }
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

  const ChangeSize = () =>
    dimensionSize === "small" ? (
      <ArrowsPointingOutIcon
        className="prevent-click bg-white border shadow-md rounded-full p-2 prevent-click top-12 left-0 absolute h-10 text-royal-blue"
        onClick={(e) => {
          e.stopPropagation();
          setDimensionSize("big");
        }}
      />
    ) : (
      <ArrowsPointingInIcon
        className="prevent-click bg-white border shadow-md rounded-full p-2 prevent-click top-12 left-0 absolute h-10 text-royal-blue"
        onClick={(e) => {
          e.stopPropagation();
          setDimensionSize("small");
        }}
      />
    );

  const ChangeMode = () => {
    if (images.length === 1) {
      return;
    }
    if (images.length === 2) {
      return (
        <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
          <StopIcon
            onClick={() => setView("single")}
            className="prevent-click bottom-[40px] left-0 absolute h-6 text-royal-blue"
          />
          <Square2StackIcon
            onClick={() => setView("double")}
            className="prevent-click bottom-[64px] left-0 absolute h-6 text-royal-blue"
          />
        </div>
      );
    }
    if (images.length >= 3) {
      return (
        <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
          <StopIcon
            onClick={() => setView("single")}
            className="prevent-click bottom-[40px] left-0 absolute h-6 text-royal-blue"
          />
          <Square2StackIcon
            onClick={() => setView("double")}
            className="prevent-click bottom-[64px] left-0 absolute h-6 text-royal-blue"
          />
          <Square3Stack3DIcon
            onClick={() => setView("triple")}
            className="prevent-click bottom-[88px] left-0 absolute h-6 text-royal-blue"
          />
        </div>
      );
    }
  };

  const SpotlightImage = ({
    index,
    width,
    height,
  }: {
    index: number;
    width: number;
    height: number;
  }) => (
    <>
      <Image
        src={imagesDisplayed[index] ? imagesDisplayed[index].imageUrl : ""}
        className="peer"
        alt="alt"
        width={width}
        height={height}
      />
      {enableDownload && (
        <a
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-all duration-200"
          href={`${imagesDisplayed[index].imageUrl}?dl=${
            title
              ? title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
              : "lunar_jar_picture"
          }.jpg`}
          download
        >
          <FolderArrowDownIcon
            className={`m-2 rounded-full bg-black bg-opacity-40 h-10 w-10 p-2 absolute text-white bottom-0 right-0`}
          />
        </a>
      )}
    </>
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
        className={`flex justify-center items-center relative ${windowSize} cursor-pointer`}
        onClick={() => setIncrement()}
      >
        {images.length === 1 && (
          <>
            <ChangeSize />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <div className={`${image} ${positionFirst}`}>
                <SpotlightImage
                  index={0}
                  width={dimensions[0].width}
                  height={dimensions[0].height}
                />
              </div>
            )}
          </>
        )}
        {images.length === 2 && (
          <>
            <ChangeMode />
            <ChangeSize />
            <ArrowUturnLeftIcon className="bg-white border shadow-md rounded-full p-2 prevent-click top-12 right-0 absolute h-10 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <div
                className={`${image} ${
                  index % 2 === 0 ? positionFirst : positionSecond
                }`}
              >
                <SpotlightImage
                  index={0}
                  width={dimensions[0].width}
                  height={dimensions[0].height}
                />
              </div>
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <div
                className={`${image} ${
                  index % 2 === 0 ? positionSecond : positionFirst
                }`}
              >
                <SpotlightImage
                  index={1}
                  width={dimensions[1].width}
                  height={dimensions[1].height}
                />
              </div>
            )}
          </>
        )}
        {images.length === 3 && (
          <>
            <ChangeMode />
            <ChangeSize />
            <ArrowUturnLeftIcon className="bg-white border shadow-md rounded-full p-2 prevent-click top-12 right-0 absolute h-10 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <div
                className={`${image} ${
                  index % 3 === 0
                    ? positionFirst
                    : index % 3 === 1
                    ? positionThird
                    : index % 3 === 2
                    ? positionSecond
                    : ""
                }`}
              >
                <SpotlightImage
                  index={0}
                  width={dimensions[0].width}
                  height={dimensions[0].height}
                />
              </div>
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <div
                className={`${image} ${
                  index % 3 === 0
                    ? positionSecond
                    : index % 3 === 1
                    ? positionFirst
                    : index % 3 === 2
                    ? positionThird
                    : ""
                }`}
              >
                <SpotlightImage
                  index={1}
                  width={dimensions[1].width}
                  height={dimensions[1].height}
                />
              </div>
            )}
            {imagesDisplayed[2] && imagesDisplayed[2].imageUrl && (
              <div
                className={`${image} ${
                  index % 3 === 0
                    ? positionThird
                    : index % 3 === 1
                    ? positionSecond
                    : index % 3 === 2
                    ? positionFirst
                    : ""
                }`}
              >
                <SpotlightImage
                  index={2}
                  width={dimensions[2].width}
                  height={dimensions[2].height}
                />
              </div>
            )}
          </>
        )}
        {images.length > 3 && (
          <>
            <ChangeMode />
            <ChangeSize />
            <ArrowUturnLeftIcon className="bg-white border shadow-md rounded-full p-2 prevent-click top-12 right-0 absolute h-10 text-royal-blue" />
            {imagesDisplayed[0] && imagesDisplayed[0].imageUrl && (
              <div
                className={`${image} ${
                  index % 4 === 0
                    ? positionFirst
                    : (index % 4) - 1 == 0
                    ? positionExit
                    : (index % 4) - 2 == 0
                    ? positionThird
                    : (index % 4) - 3 == 0
                    ? positionSecond
                    : ""
                }`}
              >
                <SpotlightImage
                  index={0}
                  width={dimensions[0].width}
                  height={dimensions[0].height}
                />
              </div>
            )}
            {imagesDisplayed[1] && imagesDisplayed[1].imageUrl && (
              <div
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
              >
                <SpotlightImage
                  index={1}
                  width={dimensions[1].width}
                  height={dimensions[1].height}
                />
              </div>
            )}
            {imagesDisplayed[2] && imagesDisplayed[2].imageUrl && (
              <div
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
              >
                <SpotlightImage
                  index={2}
                  width={dimensions[2].width}
                  height={dimensions[2].height}
                />
              </div>
            )}
            {imagesDisplayed[3] && imagesDisplayed[3].imageUrl && (
              <div
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
              >
                <SpotlightImage
                  index={3}
                  width={dimensions[3].width}
                  height={dimensions[3].height}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}
