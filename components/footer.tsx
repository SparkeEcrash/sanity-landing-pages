"use client";
import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import Modal from "@components/modal";

export default function Footer() {
  const [show, setShow] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [children, setChildren] = useState<React.ReactNode>();

  const Facebook = () => (
    <p className="title-font text-base mt-5">Facebook will be coming soon</p>
  );

  const Instagram = () => (
    <p className="title-font text-base mt-5">Instagram will be coming soon</p>
  );

  const Twitter = () => (
    <p className="title-font text-base mt-5">Twitter will be coming soon</p>
  );

  const TermsAndConditions = () => (
    <div className="min-w-[800px]">
      <p className="title-font text-base mt-5">
        These are the terms and conditions
      </p>
    </div>
  );

  const PrivacyPolicy = () => (
    <div className="min-w-[800px]">
      <p className="title-font text-base mt-5">
        These are the privacy policies
      </p>
    </div>
  );

  const Security = () => (
    <div className="min-w-[800px]">
      <p className="title-font text-base mt-5">
        These are the security policies
      </p>
    </div>
  );
  return (
    <div className="p-10 bg-background-black max-w-full">
      <div className="xl:w-3/4 2xl:w-2/3 3xl:w-1/2 mx-auto">
        <div className="border-b-2 border-border-grey pb-8 flex flex-col xl:flex-row">
          <div>
            <Link href="/about">
              <h2 className="text-border-grey hover:opacity-80 transition-all duration-200 font-serif text-4xl cursor-pointer">
                About
              </h2>
            </Link>
          </div>
          <div className="ml-[100px]">
            <Link href="/contact">
              <h2 className="text-border-grey hover:opacity-80 transition-all duration-200 font-serif text-4xl cursor-pointer">
                Contact
              </h2>
            </Link>
          </div>
        </div>
        <div className="flex justify-between mt-8 flex-col xl:flex-row">
          <div className="flex flex-col mr-5">
            <div className="flex items-center">
              <p className="font-sans text-white">
                All Rights Reserved ©2023 Lunar Jar
              </p>
            </div>
            <ul className="flex gap-y-3 gap-x-10 xl:justify-around font-sans text-border-grey mt-5 flex-wrap">
              <li
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setShow(true);
                  setTitle("Terms and Conditions");
                  setChildren(TermsAndConditions);
                }}
              >
                Terms and Conditions
              </li>
              <li
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setShow(true);
                  setTitle("Privacy Policy");
                  setChildren(PrivacyPolicy);
                }}
              >
                Privacy Policy
              </li>
              <li
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setShow(true);
                  setTitle("Security");
                  setChildren(Security);
                }}
              >
                Security
              </li>
            </ul>
          </div>
          <div className="flex  flex-wrap items-center gap-10 mt-5 xl:mt-0">
            <div
              onClick={() => {
                setShow(true);
                setTitle("");
                setChildren(Facebook);
              }}
            >
              <SocialIcon
                network="facebook"
                bgColor={"#D3D3D3"}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              />
            </div>
            <div
              onClick={() => {
                setShow(true);
                setTitle("");
                setChildren(Instagram);
              }}
            >
              <SocialIcon
                network="instagram"
                bgColor={"#D3D3D3"}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              />
            </div>
            <div
              onClick={() => {
                setShow(true);
                setTitle("");
                setChildren(Twitter);
              }}
            >
              <SocialIcon
                network="twitter"
                bgColor={"#D3D3D3"}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              />
            </div>
          </div>
        </div>
      </div>
      {show && (
        <Modal show={show} setShow={setShow} title={title} clickOut>
          {children}
        </Modal>
      )}
    </div>
  );
}
