type ButtonProps = {
  text: string;
  className?: string;
};

export default function Button({ text, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`bg-royal-blue p-5 text-2xl text-white font-serif text-center ${className}`}
    >
      {text}
    </button>
  );
}
