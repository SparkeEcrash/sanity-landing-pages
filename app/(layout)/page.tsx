import Link from "next/link";
import Image from "next/image";
import Button from "@components/button";

export default function Home() {
  return (
    <main>
      <section className="bg-input-grey min-h-screen flex justify-center items-center">
        <div className="flex mt-[120px] py-[50px]">
          <div className="flex items-center">
            <Image
              src={"/pictures/lunar-jar-collage.png"}
              alt={"Collage of ceramic pictures"}
              width={900}
              height={600}
              className="relative object-cover prevent-select"
              priority
            />
          </div>
          <div className="w-[500px] flex flex-col justify-center items-center ml-[50px]">
            <Image
              src={"/pictures/lunar-jar-logo.png"}
              alt={"Company Logo"}
              width={300}
              height={300}
              className="relative mx-auto object-cover prevent-select"
              priority
            />
            <h1 className="title-font mt-10 text-center leading-relaxed">
              Share your creations with your friends, family, and the world
            </h1>
            <Link href="/api/auth/signin">
              <Button text="Sign up" className="mt-10" />
            </Link>
            <p className="title-font text-base mt-10">
              Then the LORD God formed a man from the dust of the ground and
              breathed into his nostrils the breath of life, and the man became
              a living being.
            </p>
            <p className="title-font text-base mt-2">Genesis 2:7</p>
          </div>
        </div>
      </section>
    </main>
  );
}
