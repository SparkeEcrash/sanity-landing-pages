"use client";
import Carousel from "../../../components/carousel";
import { useState, useEffect } from "react";

export default function About() {
  const [index, setIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [cardsDisplayed, setCardsDisplayed] = useState<any>([]);
  const [cardsHidden, setCardsHidden] = useState<any>([]);
  const cards = [
    {
      name: "1",
      image:
        "https://images.unsplash.com/photo-1682687982134-2ac563b2228b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "2",
      image:
        "https://images.unsplash.com/photo-1685648041963-c5645bd04b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80",
    },
    {
      name: "3",
      image:
        "https://plus.unsplash.com/premium_photo-1683804835928-d15dbc86e29d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    },
    {
      name: "4",
      image:
        "https://images.unsplash.com/photo-1685703206054-4b9511b78b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "5",
      image:
        "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "6",
      image:
        "https://images.unsplash.com/photo-1685438436929-108c5050855d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "7",
      image:
        "https://images.unsplash.com/photo-1682687221175-fd40bbafe6ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
  ];

  const positionHidden = "opacity-0";
  const positionExit = "origin-bottom-right rotate-[35deg] z-[1] opacity-0";
  const positionFirst = "z-[4] scale-125";
  const positionSecond = "translate-x-48 translate-y-24 rotate-[20deg] z-[3]";
  const positionThird = "-translate-x-48 translate-y-24 rotate-[-20deg] z-[2]";

  const image =
    "rounded-xl overflow-hidden absolute transition-all duration-200 w-[600px] h-[400px] shadow-2xl shadow-black";

  useEffect(() => {
    console.log("1", cardsDisplayed);
    console.log("2", cardsHidden);
    setCount(cards.length);
    if (index === 0) {
      setCardsDisplayed([
        { ...cards[0] },
        { ...cards[1] },
        { ...cards[2] },
        { ...cards[3] },
      ]);
      setCardsHidden(cards.slice(4));
    }
    replaceArrays();
  }, [index]);

  const setIncrement = () => {
    setIndex(index + 1);
  };
  const replaceArrays = () => {
    console.log("hello");
    console.log("index", index);
    console.log(((index - 2) / 4) % 4 === 0);
    if (index % 4 === 1) {
      console.log("this fired");
      const cardToAdd = { ...cardsDisplayed[0] };
      // cardsHidden.push(cardsDisplayed[0]);
      setCardsDisplayed([
        { ...cardsHidden[0] },
        { ...cardsDisplayed[1] },
        { ...cardsDisplayed[2] },
        { ...cardsDisplayed[3] },
      ]);
      // cardsDisplayed.splice(0, 1, cardsHidden[0]);
      // setCardsHidden([...cardsHidden].slice(0));
      setCardsHidden([...cardsHidden, cardToAdd].slice(1));
      // cardsHidden.shift();
    }
    if (index % 4 === 2) {
      console.log("2 this fired");
      const cardToAdd = { ...cardsDisplayed[1] };
      // cardsHidden.push(cardsDisplayed[1]);
      setCardsDisplayed([
        { ...cardsDisplayed[0] },
        { ...cardsHidden[0] },
        { ...cardsDisplayed[2] },
        { ...cardsDisplayed[3] },
      ]);
      // cardsDisplayed.splice(1, 2, cardsHidden[0]);
      // cardsHidden.shift();
      setCardsHidden([...cardsHidden, cardToAdd].slice(1));
    }
    if (index % 4 === 3) {
      console.log("3 this fired");
      const cardToAdd = { ...cardsDisplayed[2] };
      setCardsDisplayed([
        { ...cardsDisplayed[0] },
        { ...cardsDisplayed[1] },
        { ...cardsHidden[0] },
        { ...cardsDisplayed[3] },
      ]);
      setCardsHidden([...cardsHidden, cardToAdd].slice(1));
    }
    if (index % 4 === 0 && index !== 0) {
      console.log("4 this fired");
      const cardToAdd = { ...cardsDisplayed[3] };
      setCardsDisplayed([
        { ...cardsDisplayed[0] },
        { ...cardsDisplayed[1] },
        { ...cardsDisplayed[2] },
        { ...cardsHidden[0] },
      ]);
      setCardsHidden([...cardsHidden, cardToAdd].slice(1));
    }
  };

  return (
    <main className="bg-black w-full h-[1200px] mt-[100px] flex justify-center items-center">
      <button
        className=" text-white p-12 bg-orange-500 mr-10"
        onClick={() => {
          setIncrement();
        }}
      >
        Click Here
      </button>
      <div className="text-white">{index}</div>
      <div className="bg-black w-[1100px] h-[1100px] flex justify-center items-center">
        <div
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
        >
          {" "}
          <img
            // src={
            //   cards[index >= 2 ? Math.floor((index - 2) / 4 + 1) * 4 : 0]
            //     .image
            // }
            src={cardsDisplayed[0] ? cardsDisplayed[0].image : ""}
            className="object-fill h-[400px]"
            alt=""
          />
        </div>
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
          {" "}
          <img
            src={cardsDisplayed[1] ? cardsDisplayed[1].image : ""}
            className="object-fill h-[400px]"
            alt=""
          />
        </div>
        <div
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
        >
          {" "}
          <img
            src={cardsDisplayed[2] ? cardsDisplayed[2].image : ""}
            className="object-fill h-[400px]"
            alt=""
          />
        </div>
        <div
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
        >
          {" "}
          <img
            src={cardsDisplayed[3] ? cardsDisplayed[3].image : ""}
            className="object-fill h-[400px]"
            alt=""
          />
        </div>
      </div>
    </main>
  );
}
