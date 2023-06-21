"use client";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

interface SigninOptionProps {
  name: string;
  image: string;
  email: string;
}

export default function SigninOption({ name, image, email }: SigninOptionProps) {
  return (
    <div>
      <div
        className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200"
        onClick={() => signIn("email", { email, callbackUrl: "/user" })}
      >
        <Image
          src={image}
          alt={`${name} logo`}
          className="relative mx-auto prevent-select"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <p className="text-3xl text-royal-blue font-serif mt-6">{name}</p>
    </div>
  );
}
