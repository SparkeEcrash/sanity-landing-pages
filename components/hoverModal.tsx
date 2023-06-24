"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AppDispatch } from "@redux/store";
import { addMessage } from "@redux/features/messagesSlice";

interface HoverModalProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  link?: string;
  children: React.ReactNode;
}

interface ModalProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  link?: string;
  hover: boolean;
}

const Modal = ({ text, bgColor, textColor, className, hover }: ModalProps) => {
  return (
    <div
      className={`${bgColor ? bgColor : "bg-royal-blue"} ${
        textColor ? textColor : "text-white absolute"
      } p-5 text-2xl font-serif text-center transition-all duration-200 absolute cursor-pointer ${
        hover ? "translate-x-0 opacity-100" : "-translate-x-1/4 opacity-0"
      } ${className}`}
    >
      <div onClick={() => signOut()}>{text}</div>
    </div>
  );
};

const UserModal = ({ hover }: { hover: boolean }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const activeLinkStyle = "font-serif text-royal-blue text-3xl opacity-100";
  const inactiveLinkStyleDesktop =
    "font-serif text-royal-blue text-3xl opacity-70 hover:opacity-100 transition-all duration-200";
  const path = usePathname();
  const dispatch = AppDispatch();
  return (
    <div
      className={`bg-white transition-all duration-200 absolute border shadow-sm flex flex-col items-start ${
        hover ? "translate-x-0 opacity-100" : "-translate-x-1/4 opacity-0"
      }`}
    >
      <Link
        href={"artworks"}
        className={`px-5 mx-5 cursor-pointer flex justify-center items-center h-16 ${
          path === "/artworks" ? activeLinkStyle : inactiveLinkStyleDesktop
        }`}
      >
        Artworks
      </Link>
      <Link
        href={"likes"}
        className={`px-5 mx-5 cursor-pointer flex justify-center items-center h-16 ${
          path === "/likes" ? activeLinkStyle : inactiveLinkStyleDesktop
        }`}
      >
        Likes
      </Link>
      <Link
        href={"comments"}
        className={`px-5 mx-5 cursor-pointer flex justify-center items-center h-16 ${
          path === "/comments" ? activeLinkStyle : inactiveLinkStyleDesktop
        }`}
      >
        Comments
      </Link>
      <div
        className={`px-5 mx-5 cursor-pointer flex justify-center items-center h-16 ${
          path === "/signout" ? activeLinkStyle : inactiveLinkStyleDesktop
        }`}
        onClick={() => {
          if (!isSigningOut) {
            dispatch(
              addMessage({
                text: "Signing out",
                showLoading: true,
                key: "signing out",
              })
            );
            signOut();
            setIsSigningOut(true);
          }
        }}
      >
        Sign out
      </div>
    </div>
  );
};

//TODO: Make HoverModal accessible for other hover modals
export default function HoverModal({
  text,
  bgColor,
  textColor,
  className,
  children,
}: HoverModalProps) {
  const [hover, setHover] = useState<boolean>(false);
  const mouseOver = () => setHover(true);
  const mouseLeave = () => setHover(false);
  return (
    <div
      className={`relative ${hover ? "overflow-visible" : "overflow-hidden"}`}
      onMouseOver={() => mouseOver()}
      onMouseLeave={() => mouseLeave()}
    >
      <div>{children}</div>
      {/* <Modal text="Sign Out" hover={hover} /> */}
      <UserModal hover={hover} />
    </div>
  );
}
