import Post from "../../../sanity-components/post/post";
import Citations from "../../../sanity-components/citations/citations";
import Image from "next/image";

export default function About() {
  return (
    <main>
      <section className="bg-input-grey min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-10 justify-center mx-auto max-w-7xl p-14 mt-[100px]">
          <div className="p-14 w-full bg-white flex border shadow-md">
            <div className="mr-10 min-w-[200px] flex items-center">
              <Image
                src={"/pictures/profile_picture.png"}
                alt={"Picture of James Park"}
                width={200}
                height={200}
                className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                priority
              />
            </div>
            <div className="pl-10 border-l-2 border-royal-blue flex flex-col justify-between">
              <p className="body-font text-royal-blue">
                Lunar Jar is a passion project I created in order to give a
                platform for ceramic hobbyists and experts to share their works
                on the internet. It is my hope that Lunar Jar becomes a place
                where ceramic enthusiasts can find inspiration from one another
                and to share their excitement and passion. Throughout my years,
                I've met many talented individuals who have created artworks
                they're proud of but do not know any ways of sharing their works
                with their friends and family without getting involved in social
                media, which to them seems complicated and burdensome to use.
                Lunar Jar is a very straightforward and simple platform to use
                with the sole purpose of alleviating that anxiety for non tech
                savvy people who would like to enjoy interacting with the wider
                audience available on the internet but would also like to avoid
                the complication and security concerns that comes with keeping a
                social media account. This website was designed for my own
                mother to use and it is my wish that other parents who would
                like to show off their works to their family and friends find
                the same level of enjoyment from using this platform.
              </p>

              <div className="mt-10">
                <p className="text-background-black font-serif font-bold">
                  James Park
                </p>
                <p className="text-background-black font-serif">
                  Creator and Founder of Lunar Jar{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="p-14 w-full bg-white flex border shadow-md flex-col">
            <p className="body-font text-royal-blue">
              Lunar Jar is a privately maintained platform created from the
              following technologies. All data is stored in a remote server from
              Sanity.io.
            </p>
            <div className="flex gap-x-5 justify-center mt-10">
              <div>
                <Image
                  src={"/pictures/nextjs_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Next.js
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/react_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  React.js
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/redux_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Redux.js
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/nodejs_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Node.js
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/sanityio_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Sanity.io
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/typescript_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Typescript
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/tailwind_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  Tailwind
                </div>
              </div>
              <div>
                <Image
                  src={"/pictures/aws_icon.jpg"}
                  alt={"Porcelain Collection"}
                  width={100}
                  height={100}
                  className="relative aspect-square object-cover rounded-full prevent-select border shadow-sm"
                  priority
                />
                <div className="body-font text-royal-blue text-center mt-2">
                  AWS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Post />
      <Citations /> */}
    </main>
  );
}
