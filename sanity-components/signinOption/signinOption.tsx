"use client";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

interface SigninOptionProps {
  name: string;
  image: string;
  id: string;
}

export default function SigninOption({ name, image, id }: SigninOptionProps) {
  return (
    <div className="flex justify-center flex-col items-center w-[150px]">
      <div
        className="flex-center p-4 border-2 w-[100px] h-[100px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200"
        onClick={() => signIn(id, { callbackUrl: "/artworks" })}
      >
        <Image
          src={image}
          alt={`${name} logo`}
          className="relative mx-auto prevent-select"
          width={100}
          height={100}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <p className="text-3xl text-royal-blue font-serif mt-6">{name}</p>
    </div>
  );
}
