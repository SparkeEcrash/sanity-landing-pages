import Link from "next/link";
import Image from "next/image";
import Button from "@components/button";

export default function Contact() {
  return (
    <main>
      <section className="bg-input-grey min-h-screen flex justify-center items-center">
        <div className="flex mt-[120px] py-[50px]">
          <div className="flex items-center">
            <Image
              src={"/pictures/lunar-jar-collage-two.png"}
              alt={"Collage of ceramic pictures"}
              width={900}
              height={600}
              className="relative object-cover prevent-select"
              priority
            />
          </div>
          <div className="w-[500px] flex flex-col justify-center ml-[50px] bg-white border shadow-md p-12">
            <h1 className="title-font text-center leading-relaxed">
              Contact us
            </h1>
            <p className="title-font text-base mt-2 text-center">
              Let us know your thoughts and questions!
            </p>
            <p className="title-font text-base mt-10">Your Name</p>
            <input type="text" className="input-style" />
            <p className="title-font text-base mt-10">Your Email</p>
            <input type="text" className="input-style" />
            <p className="title-font text-base mt-10">Your Message</p>
            <textarea className="input-style h-48 scrollbar-thin scrollbar-thumb-royal-blue scrollbar-track-border-grey" />
            <div className="mx-auto">
              <Link href="/api/auth/signin">
                <Button text="Send" className="mt-10" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
