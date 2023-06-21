import { PayloadAction } from "@reduxjs/toolkit";
interface ButtonsProps {
  buttons: ButtonProps[];
  className?: string;
}

interface ButtonProps {
  text: string;
  id: string;
  count?: number;
  dark?: boolean;
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
}

export default function Buttons({ buttons, className }: ButtonsProps) {
  return (
    <div
      className={`relative flex flex-wrap items-center gap-1 px-[5px] ${
        className ? className : ""
      }`}
    >
      {buttons.map(({ id, text, count, dark, clickFn }) => {
        return (
          <button
            key={id}
            className={` h-[32px] ${
              dark ? "bg-royal-blue " : "bg-white"
            } border flex-center cursor-pointer flex px-2`}
            onClick={(e) => clickFn && clickFn(e)}
          >
            <span
              className={`body-font ${
                dark ? "text-white" : "text-royal-blue"
              } text-sm`}
            >
              {text}
            </span>
            <div
              className={`body-font text-xs ${dark && "border-royal-blue"} ${
                dark ? "text-white" : "text-royal-blue"
              } ml-2 border rounded-full h-6 w-6 flex-center shadow-sm ${
                dark ? "bg-royal-blue" : "bg-white"
              }`}
            >
              {count}
            </div>
          </button>
        );
      })}
    </div>
  );
}
