type ButtonProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export default function Button({
  text,
  bgColor,
  textColor,
  className,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${bgColor ? bgColor : "bg-royal-blue"} ${
        textColor ? textColor : "text-white"
      } p-5 text-2xl font-serif text-center ${className}`}
    >
      {text}
    </button>
  );
}
