'use client'

type ButtonProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  clickFn?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | (() => void);
};

export default function Button({
  text,
  bgColor,
  textColor,
  className,
  clickFn,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => clickFn && clickFn(e)}
      className={`${bgColor ? bgColor : "bg-royal-blue"} ${
        textColor ? textColor : "text-white"
      } p-5 text-2xl font-serif text-center hover:scale-110 transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  );
}
