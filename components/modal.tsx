"use client";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  clickOut?: boolean;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  show,
  setShow,
  clickOut,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    show && (document.body.style.overflow = "hidden");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);
  return (
    <div
      className="fixed top-0 left-0 z-20 min-h-screen w-full bg-black/[.5] flex items-center justify-center"
      onClick={() => clickOut && setShow(false)}
    >
      <div
        className=" bg-white border shadow-2xl max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey max-w-5xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col border-b shadow-sm p-14">
          <div>
            <XMarkIcon
              className="text-royal-blue absolute h-8 top-5 left-5 prevent-select cursor-pointer"
              onClick={() => setShow(false)}
            />
          </div>
          {title && (
            <div className="text-center">
              <h1 className="title-font">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
