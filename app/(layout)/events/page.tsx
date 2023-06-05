"use client";
import Carousel from "../../../components/carousel";
import { useState, useEffect } from "react";

export default function About() {
  const [index, setIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const cards = [
    {
      image:
        "https://images.unsplash.com/photo-1682687982134-2ac563b2228b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1685648041963-c5645bd04b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1683804835928-d15dbc86e29d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1685703206054-4b9511b78b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1685438436929-108c5050855d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
  ];

  const positionHidden = "opacity-0";
  const positionExit = "origin-bottom-right rotate-[35deg] z-[1] opacity-0";
  const positionFirst = "z-[4] scale-125";
  const positionSecond = "translate-x-48 translate-y-24 rotate-[20deg] z-[3]";
  const positionThird = "-translate-x-48 translate-y-24 rotate-[-20deg] z-[2]";
  console.log(index);

  const calc = (index: number, count: number) => {
    return (
      Math.floor((index - 2) / 4 + 1) * 4 -
      count * (Math.floor((index - 4) / count) + 1)
    );
  };

  const calcFront = (index: number, count: number) => {
    return Math.floor((index - 2) / 4 + 1) * 4;
  };

  const calcBack = (index: number, count: number) => {
    return count * (Math.floor((index - 4) / count) + 1);
  };

  const ii = 10;

  console.log("hello", calc(ii, 7));
  console.log("front", calcFront(ii, 7));
  console.log("back", calcBack(ii, 7));

  const image =
    "rounded-xl overflow-hidden absolute transition-all duration-200 w-[600px] h-[400px] shadow-2xl shadow-black";

  useEffect(() => {
    setCount(cards.length);
  }, []);

  const determineFirstSrc = () => {
    if ((Math.floor((index - 2) / 4) + 1) * 4 > count) {
      return index % count;
    } else if (index >= 2) {
      return (Math.floor((index - 2) / 4) + 1) * 4;
    } else {
      return 0;
    }
  };

  return (
    <main className="bg-black w-full h-[1200px] mt-[100px] flex justify-center items-center">
      <button
        className=" text-white p-12 bg-orange-500 mr-10"
        onClick={() => {
          if (index + 3 === count) {
            setIndex(index + 1);
          } else {
            setIndex(index + 1);
          }
        }}
      >
        Click Here
      </button>
      <div className="text-white">{index}</div>
      <div className="bg-white w-[1100px] h-[1100px] flex justify-center items-center">
        {cards.map((card, i) => {
          if (i === 0) {
            return (
              <div
                className={`${image} ${
                  index % 4 === i % 4
                    ? positionFirst
                    : (index % 4) - 1 == i
                    ? positionExit
                    : (index % 4) - 2 == i
                    ? positionThird
                    : (index % 4) - 3 == i
                    ? positionSecond
                    : ""
                }`}
              >
                {" "}
                <img
                  // src={
                  //   cards[index >= 2 ? Math.floor((index - 2) / 4 + 1) * 4 : 0]
                  //     .image
                  // }
                  src={cards[determineFirstSrc()].image}
                  className="object-fill h-[400px]"
                  alt=""
                />
              </div>
            );
          } else if (i === 1) {
            return (
              <div
                className={`${image} ${
                  (index % 4) + 1 === i
                    ? positionSecond
                    : index % 4 == i
                    ? positionFirst
                    : (index % 4) - 1 == i
                    ? positionExit
                    : (index % 4) - 2 == i
                    ? positionThird
                    : ""
                }`}
              >
                {" "}
                <img
                  src={cards[index >= 3 ? 5 : 1].image}
                  className="object-fill h-[400px]"
                  alt=""
                />
              </div>
            );
          } else if (i === 2) {
            return (
              <div
                className={`${image} ${
                  (index % 4) + 2 === i
                    ? positionThird
                    : (index % 4) + 1 == i
                    ? positionSecond
                    : index % 4 == i
                    ? positionFirst
                    : (index % 4) - 1 == i
                    ? positionHidden
                    : ""
                }`}
              >
                {" "}
                <img
                  src={cards[index >= 4 ? 6 : 2].image}
                  className="object-fill h-[400px]"
                  alt=""
                />
              </div>
            );
          } else if (i === 3) {
            return (
              <div
                className={`${image} ${
                  (index % 4) + 3 === i
                    ? positionHidden
                    : (index % 4) + 2 == i
                    ? positionThird
                    : (index % 4) + 1 == i
                    ? positionSecond
                    : index % 4 == i
                    ? positionFirst
                    : ""
                }`}
              >
                {" "}
                <img
                  src={cards[index >= 5 ? 3 : 3].image}
                  className="object-fill h-[400px]"
                  alt=""
                />
              </div>
            );
          }
        })}
        {/* <div
          className={`${image} ${
            index % 3 === 0 ? positionFirst : positionExit
          }`}
        >
          {" "}
          <img src={cards[0].image} className="object-fill h-[400px]" alt="" />
        </div>
        <div
          className={`${image} ${index === 0 ? positionSecond : positionFirst}`}
        >
          <img src={cards[1].image} alt="" />
        </div>
        <div
          className={`${image} ${index === 0 ? positionThird : positionSecond}`}
        >
          {" "}
          <img src={cards[2].image} alt="" />
        </div>
        <div
          className={`${image} ${index === 0 ? positionHidden : positionThird}`}
        >
          <img src={cards[0].image} alt="" />
        </div>
        <div className={positionHidden}>
          {" "}
          <img src={cards[1].image} className="object-fill h-[400px]" alt="" />
        </div>
        <div className={positionHidden}>
          <img src={cards[2].image} alt="" />
        </div> */}
      </div>
    </main>
  );
}
