interface Tag {
  label: string;
}

export default function Tag({ label }: Tag) {
  return <div className="title-font text-sm bg-white text-royal-blue border p-2 shadow-sm">{label}</div>;
}
