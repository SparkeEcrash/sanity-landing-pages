import { v4 as uuidv4 } from "uuid";
interface ToggleProps {
  toggle?: boolean;
  options?: string[];
  value?: number;
  yesno: boolean;
  clickFn: () => void;
  className?: string;
}

export default function Toggle({
  toggle,
  options,
  value,
  yesno,
  clickFn,
  className,
}: ToggleProps) {
  return (
    <div
      className={`prevent-select h-[42px] bg-input-grey relative flex items-center cursor-pointer border shadow-sm gap-1 px-[5px] ${className}`}
      onClick={() => clickFn()}
    >
      {yesno ? (
        <>
          <div
            className={` h-[32px] bg-white border flex-center transition-all duration-200 ${
              toggle ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="body-font text-royal-blue text-sm px-2">
              {options ? options![0] : "No"}
            </span>
          </div>
          <div
            //[w-32px]
            className={` h-[32px] bg-royal-blue flex-center transition-all duration-200 ${
              !toggle ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="body-font text-white text-sm px-2">
              {options ? options![1] : "Yes"}
            </span>
          </div>
        </>
      ) : (
        <>
          {options!.map((option, i) => (
            <div
              key={`toggle-${uuidv4()}`}
              className={`h-[32px]  odd:text-royal-blue odd:bg-white even:text-white even:bg-royal-blue px-2 body-font border flex-center transition-all duration-200 text-sm ${
                value === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {option}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
