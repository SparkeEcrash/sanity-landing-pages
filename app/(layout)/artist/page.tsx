"use client";
import { authOptions } from "@nextauth/route";
import Image from "next/image";
import Masonry from "react-masonry-css";
import Button from "components/button";
import Link from "next/link";
import UploadArtworkModal from "components/uploadArtworkModal";
import { useState } from "react";
import { trimString } from "utils";

const nameExample = "My super duper awesome emperor jade green porcelain";
const nameExample2 = "Summer Babylonian Pot";

const DataPosted = () => (
  <div className="w-[300px] relative border shadow-md cursor-pointer">
    <div className="w-full h-[300px] relative">
      <Image
        src={
          "https://images.unsplash.com/photo-1590600504282-30e4dc6f8fcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
        }
        alt={"alt tag"}
        className="object-cover prevent-select"
        fill
        priority
      />
    </div>
    <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
      <div>
        <h2 className="w-full title-font text-xl text-center">
          {trimString(75, nameExample)}
        </h2>
      </div>
      <div className="w-full mt-2">
        <div className="flex justify-between">
          <p className="body-font text-sm">Views: 25</p>
          <p className="body-font text-sm">Likes: 255</p>
        </div>
      </div>
    </div>
  </div>
);

const DataSaved = () => (
  <div className="w-[300px] relative border shadow-md cursor-pointer">
    <div className="w-full h-[300px] relative">
      <Image
        src={
          "https://images.unsplash.com/photo-1590600504282-30e4dc6f8fcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
        }
        alt={"alt tag"}
        className="object-cover prevent-select"
        fill
        priority
      />
    </div>
    <div className="flex flex-col min-h-[75px] p-2 relative w-full overflow-hidden justify-center">
      <div>
        <h2 className="w-full title-font text-xl text-center">
          {trimString(75, nameExample2)}
        </h2>
      </div>
    </div>
  </div>
);

export default function Artist() {
  const [show, setShow] = useState<boolean>(false);
  // const data = await getServerSession(authOptions);
  return (
    <>
      <main className="py-[100px]">
        <section className="flex flex-col justify-center items-center">
          <div className="max-w-7xl">
            <div className="mt-10 p-14">
              <p className="text-3xl text-royal-blue font-serif text-center">
                Your artworks posted on the gallery
              </p>
              <div className="flex mt-10 gap-x-12">
                <Masonry
                  breakpointCols={3}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  <DataPosted />
                  <DataPosted />
                  <DataPosted />
                  <DataPosted />
                  <DataPosted />
                  <DataPosted />
                </Masonry>
              </div>
              <div className="mt-2">
                <div className="flex justify-evenly">
                  <Button text="Most Liked" />
                  <Button text="Most Viewed" />
                  <Button text="Most Recent" />
                </div>
              </div>
            </div>
            <div className="p-14">
              <p className="text-3xl text-royal-blue font-serif text-center">
                Your artworks saved on your account
              </p>
              <div className="flex mt-10">
                <Masonry
                  breakpointCols={3}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  <DataSaved />
                  <DataSaved />
                  <DataSaved />
                  <DataSaved />
                  <DataSaved />
                  <DataSaved />
                </Masonry>
              </div>
              <div className="text-center">
                <div className="mt-2">
                  <Button text="Add an artwork" clickFn={() => setShow(true)} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {show && <UploadArtworkModal show={show} setShow={setShow} />}
    </>
  );
}
