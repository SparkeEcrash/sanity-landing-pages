import Link from "next/link";
import Button from "./../../components/buttton";
import Image from "next/image";

export default function Citations() {
  return (
    <section className="w-full bg-white">
      <div className="flex flex-col gap-10 justify-center mx-auto max-w-7xl p-14">
        <div className="p-12 w-full bg-border-grey flex">
          <div className="mr-10 min-w-[200px] flex items-center">
            <Image
              src={
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              }
              alt={"Porcelain Collection"}
              width={200}
              height={200}
              className="relative aspect-square object-cover rounded-full prevent-select"
              priority
            />
          </div>
          <div className="pl-10 border-l-2 border-royal-blue flex flex-col justify-between">
            <p className="text-royal-blue font-sans">
              Nulla vel lacinia massa, in dictum eros. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos. Ut vel pellentesque odio, ac dapibus justo. Duis dictum
              magna accumsan, bibendum ante ut, sagittis massa.Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Sed euismod libero a risus
              maximus elementum.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed euismod libero a risus maximus elementum.
              Donec non rhoncus justo.
            </p>
            <div className="mt-10">
              <p className="text-background-black font-serif font-bold">Jane Doe</p>
              <p className="text-background-black font-serif">Owner of Moon Jar </p>
            </div>
          </div>
        </div>
        <div className="p-12 w-full bg-border-grey flex">
          <div className="mr-10 min-w-[200px] flex items-center">
            <Image
              src={
                "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80"
              }
              alt={"Porcelain Collection"}
              width={200}
              height={200}
              className="relative aspect-square object-cover rounded-full prevent-select"
              priority
            />
          </div>
          <div className="pl-10 border-l-2 border-royal-blue flex flex-col justify-between">
            <p className="text-royal-blue font-sans">
              Nulla vel lacinia massa, in dictum eros. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos. Ut vel pellentesque odio, ac dapibus justo. Duis dictum
              magna accumsan, bibendum ante ut, sagittis massa.Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Sed euismod libero a risus
              maximus elementum.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed euismod libero a risus maximus elementum.
              Donec non rhoncus justo.
            </p>
            <div className="mt-10">
              <p className="text-background-black font-serif font-bold">Jane Doe</p>
              <p className="text-background-black font-serif">Customer from NYC </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
