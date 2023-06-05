import Image from "next/image";
import Button from "components/button";

export default function Signin() {
  return (
    <main>
      <section className="mt-[100px] bg-transparent flex justify-center items-center">
        <div className="flex max-w-5xl p-14 flex-col text-center">
          <h1 className="text-3xl text-royal-blue font-serif text-center">
            Choose your method for signing in
          </h1>
          <p className="text-background-black font-sans mt-2">
            You can use your account from another platform to sign in
          </p>
          <div className="flex justify-center flex-wrap gap-x-24 gap-y-10 mt-10">
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/gmail_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">Gmail</p>
            </div>
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/instagram_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">
                Instagram
              </p>
            </div>
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/facebook_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">
                Facebook
              </p>
            </div>
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/twitter_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">
                Twitter
              </p>
            </div>
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/github_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">Github</p>
            </div>
            <div>
              <div className="p-4 flex justify-center items-center border-2 w-[200px] h-[200px] relative shadow-md cursor-pointer hover:scale-110 transition-all duration-200">
                <Image
                  src={"/pictures/auth0_icon.png"}
                  alt={"Company Logo"}
                  className="relative mx-auto prevent-select"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <p className="text-3xl text-royal-blue font-serif mt-6">Auth0</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-transparent flex justify-center items-center">
        <div className="flex max-w-5xl p-14 flex-col text-center">
          <h1 className="text-3xl text-royal-blue font-serif text-center">
            Sign in as a Guest
          </h1>
          <p className="text-background-black font-sans mt-2">
            You can use our guest option to continue
          </p>
          {/* <input
            type="text"
            className="border-2 border-background-grey mt-10 font-sans"
          /> */}
          <div>
            <Button
              className="mt-10"
              bgColor="bg-royal-blue"
              text={"Continue"}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
