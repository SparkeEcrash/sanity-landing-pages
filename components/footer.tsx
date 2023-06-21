import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <div className="p-10 bg-background-black max-w-full">
      <div className="xl:w-3/4 2xl:w-2/3 3xl:w-1/2 mx-auto">
        <div className="border-b-2 border-border-grey pb-8 flex flex-col xl:flex-row justify-between">
          <div>
            <h2 className="text-white font-serif font-bold text-4xl">Visit</h2>
          </div>
          <div className="font-serif mt-5 xl:mt-0 text-border-grey">
            <p>123 Example Drive</p>
            <p>Example City, EX 90909</p>
            <p>###-###-####</p>
          </div>
          <div className="font-serif text-border-grey mt-5 xl:mt-0">
            <p>Monday to Friday: 10AM to 5PM</p>
            <p>Saturday and Sunday: 11AM to 4PM</p>
            <p>Free tickets available at the door</p>
          </div>
        </div>
        <div className="flex justify-between mt-8 flex-col xl:flex-row">
          <div className="flex flex-col mr-5">
            <div className="flex items-center">
              <p className="font-sans font-bold text-white">
                All Rights Reserved ©2023 Moon Jar
              </p>
            </div>
            <ul className="flex gap-y-3 gap-x-10 xl:justify-around font-sans text-border-grey mt-5 flex-wrap">
              <li className="cursor-pointer hover:underline">
                Terms and Conditions
              </li>
              <li className="cursor-pointer hover:underline">Privacy Policy</li>
              <li className="cursor-pointer hover:underline">ADA Policy</li>
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
              network="youtube"
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
