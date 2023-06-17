"use client";
import { useEffect } from "react";
import Button from "components/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AppDispatch } from "@redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

interface AreYouSureModalProps {
  show: boolean;
  setShow?: (show: boolean) => void;
  dispatchSetShow?: ActionCreatorWithPayload<boolean, string>;
  clickOut?: boolean;
  children: React.ReactNode;
  dispatchYesAction: ActionCreatorWithPayload<any, string>;
  _id: string;
}

export default function AreYouSureModal({
  show,
  setShow,
  dispatchSetShow,
  clickOut,
  children,
  dispatchYesAction,
  _id,
}: AreYouSureModalProps) {
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
      className="fixed z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
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
          <div className="text-center">{children}</div>
        </div>
        <div className="p-14 flex justify-evenly">
          <Button text="No" clickFn={() => setModalShow(false)} />
          <Button text="Yes" clickFn={() => dispatch(dispatchYesAction(_id))} />
        </div>
      </div>
    </div>
  );
}
