import Button from "components/button";
import { signOut } from "next-auth/react";

export default function Signout() {
  signOut();
  return (
    <section className="bg-transparent flex justify-center items-center">
      <div className="flex max-w-5xl p-14 flex-col text-center">
        <h1 className="text-3xl text-royal-blue font-serif text-center">
          Sign out
        </h1>
        <p className="text-background-black font-sans mt-2">
          Click the below button to sign out
        </p>
        <div>
          <Button className="mt-10" bgColor="bg-royal-blue" text={"Continue"} />
        </div>
      </div>
    </section>
  );
}
