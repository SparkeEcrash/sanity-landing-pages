import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <div className="p-10 bg-background-black max-w-full">
      <div className="xl:w-3/4 2xl:w-2/3 3xl:w-1/2 mx-auto">
        <div className="border-b-2 border-border-grey pb-8 flex flex-col xl:flex-row">
          <div>
            <h2 className="text-border-grey hover:opacity-80 transition-all duration-200 font-serif text-4xl cursor-pointer">
              About
            </h2>
          </div>
          <div>
            <h2 className="text-border-grey hover:opacity-80 transition-all duration-200 font-serif text-4xl ml-[100px] cursor-pointer">
              Contact
            </h2>
          </div>
        </div>
        <div className="flex justify-between mt-8 flex-col xl:flex-row">
          <div className="flex flex-col mr-5">
            <div className="flex items-center">
              <p className="font-sans text-white">
                All Rights Reserved ©2023 Moon Jar
              </p>
            </div>
            <ul className="flex gap-y-3 gap-x-10 xl:justify-around font-sans text-border-grey mt-5 flex-wrap">
              <li className="cursor-pointer hover:underline">
                Terms and Conditions
              </li>
              <li className="cursor-pointer hover:underline">Privacy Policy</li>
              <li className="cursor-pointer hover:underline">Security</li>
            </ul>
          </div>
          <div className="flex  flex-wrap items-center gap-10 mt-5 xl:mt-0">
            <SocialIcon
              network="facebook"
              bgColor={"#D3D3D3"}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
            <SocialIcon
              network="instagram"
              bgColor={"#D3D3D3"}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
            <SocialIcon
              network="twitter"
              bgColor={"#D3D3D3"}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
