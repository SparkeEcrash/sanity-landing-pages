"use client";
import { PayloadAction } from "@reduxjs/toolkit";

type ButtonMiniProps = {
  text: string;
  dark?: boolean;
  className?: string;
  disabled?: boolean;
  clickFn?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    | void
    | (() => void)
    | { payload: any; type: string }
    | Promise<
        PayloadAction<
          any,
          string,
          {
            arg: string;
            requestId: string;
            requestStatus: "fulfilled" | "rejected";
          },
          never
        >
      >;
};

export default function ButtonMini({
  text,
  dark,
  disabled,
  clickFn,
}: ButtonMiniProps) {
  return (
    <button
      className={` h-[32px] prevent-select ${
        dark ? "bg-royal-blue " : "bg-white"
      } border flex-center cursor-pointer flex px-2`}
      disabled={disabled}
      onClick={(e) => clickFn && clickFn(e)}
    >
      <span
        className={`body-font ${
          dark ? "text-white" : "text-royal-blue"
        } text-sm`}
      >
        {text}
      </span>
    </button>
  );
}
