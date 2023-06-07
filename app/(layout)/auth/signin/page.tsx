import Button from "components/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import SigninOption from "sanity-components/signinOption/signinOption";

export default async function Signin() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <section className="mt-[100px] bg-transparent flex justify-center items-center">
        <div className="flex max-w-5xl p-14 flex-col text-center">
          <h1
            className="text-3xl text-royal-blue font-serif text-center"
          >
            Choose your option for signing in
          </h1>
          <p className="text-background-black font-sans mt-2">
            You can use your account from another platform to sign in
          </p>
          <div className="flex justify-center flex-wrap gap-x-24 gap-y-10 mt-10">
            <SigninOption
              name="Gmail"
              image="/pictures/gmail_icon.png"
              id="google"
            />
            <SigninOption
              name="Instagram"
              image="/pictures/instagram_icon.png"
              id="instagram"
            />
            <SigninOption
              name="Facebook"
              image="/pictures/facebook_icon.png"
              id="facebook"
            />
            <SigninOption
              name="Twitter"
              image="/pictures/twitter_icon.png"
              id="twitter"
            />
            <SigninOption
              name="Github"
              image="/pictures/github_icon.png"
              id="github"
            />
            <SigninOption
              name="Auth0"
              image="/pictures/auth0_icon.png"
              id="auth0"
            />
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
