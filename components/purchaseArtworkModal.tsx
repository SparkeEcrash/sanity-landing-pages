"use client";
import { useEffect } from "react";
import Button from "components/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

interface PurchaseArtworkModalProps {
  email: string;
  price: string;
  name: string;
  show: boolean;
  setShow?: (show: boolean) => void;
  dispatchSetShow?: ActionCreatorWithPayload<boolean, string>;
  clickOut?: boolean;
}

export default function PurchaseArtworkModal({
  name,
  email,
  price,
  show,
  setShow,
  dispatchSetShow,
  clickOut,
}: PurchaseArtworkModalProps) {
  const dispatch = AppDispatch();
  const setModalShow = (boolean: boolean) =>
    setShow ? setShow(boolean) : dispatch(dispatchSetShow!(boolean));

  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  return (
    <div
      className="fixed top-0 left-0 z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setModalShow(false)}
    >
      <div
        className="w-[800px] bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
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
            <h1 className="title-font mt-10">The artwork is up for sale</h1>
            <p className="body-font mt-10 text-center leading-loose">
              {name} has suggested a price of{" "}
              <span className="title-font text-lg">${price}</span>.
            </p>
            <p className="body-font mt-2">
              You are welcome to use the seller's email listed
              below and make an offer.
            </p>
            <h1 className="title-font mt-10">{email}</h1>
          </div>
        </div>
        <div className="p-14 flex justify-evenly">
          <Button text="Close" clickFn={() => setModalShow(false)} />
        </div>
      </div>
    </div>
  );
}
