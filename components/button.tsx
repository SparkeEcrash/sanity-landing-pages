"use client";
import { PayloadAction } from "@reduxjs/toolkit";

type ButtonProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
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

export default function Button({
  text,
  bgColor,
  textColor,
  className,
  disabled,
  clickFn,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => clickFn && clickFn(e)}
      className={`${bgColor ? bgColor : "bg-royal-blue"} ${
        textColor ? textColor : "text-white"
      } shadow-md shadow-background-grey prevent-select p-5 text-2xl font-serif text-center hover:scale-110 transition-all duration-200 ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
