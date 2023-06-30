import Link from "next/link";
import Button from "../../components/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-royal-blue">
      <div className="flex justify-center items-center">
        <div className="flex gap-24 max-w-7xl p-14">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl text-white font-serif">
              Find the Perfect Porcelain
            </h1>
            <p className="text-white font-sans mt-10 indent-10">
              Lunar Jar exhibits a gallery of masterfully crafted porcelain and
              if given the availability makes them available for purchase to
              interested individuals. Vivamus eget neque non lectus interdum
              imperdiet eget non tellus. Mauris elementum pellentesque pharetra.
              Vivamus volutpat orci vel arcu imperdiet finibus. Maecenas aliquet
              quis mi sit amet consequat. Proin eget porta massa. Integer
              efficitur sed libero at tincidunt. In convallis nunc at elit
              tempus lobortis. Donec a ex imperdiet, tincidunt dui id, ornare
              enim. Nunc quis congue urna, a commodo lectus. Praesent a
              ullamcorper risus. Curabitur non diam placerat risus posuere
              tincidunt et in nisl. Etiam lacinia lobortis scelerisque. Etiam
              vulputate dignissim urna, non mollis sapien rutrum ac. Nulla
              eleifend, libero at rhoncus vestibulum, urna arcu vehicula odio,
              eu finibus enim est tempor ante. Cras velit mi, vehicula vitae
              felis at, pharetra pharetra nibh. Cras aliquam lorem erat, ac
              semper elit scelerisque eu. Phasellus dapibus ligula nec varius
              congue. In hac habitasse platea dictumst. Vivamus volutpat lorem
              at lacus euismod aliquam. Nam maximus luctus nulla ac congue.
            </p>
            <div className="mt-10">
              <Link href="/gallery">
                <Button
                  text={"Browse"}
                  bgColor="bg-white"
                  textColor="text-royal-blue"
                />
              </Link>
            </div>
          </div>
          <Image
            src={
              "https://images.unsplash.com/photo-1607384070812-0965d8827f6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1642&q=80"
            }
            alt={"Porcelain Collection"}
            width={600}
            height={400}
            className="relative mx-auto object-cover prevent-select"
            priority
          />
        </div>
      </div>
    </section>
  );
}
