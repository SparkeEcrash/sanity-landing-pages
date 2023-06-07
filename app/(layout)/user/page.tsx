import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import Image from "next/image";
import Button from "components/button";
import Link from "next/link";

export default async function User() {
  const session = await getServerSession(authOptions);

  console.log(session);

  const UserDashboard = () => (
    <section className="flex justify-center items-center">
      <div className="flex flex-col items-center max-w-7xl p-14">
        <div className="text-3xl text-royal-blue font-serif">
          Hi {session!.user.name}. Are you an artist, an event coordinator, or a potential customer?
        </div>
        <div className="flex justify-evenly w-full mt-10">
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={
                "https://images.unsplash.com/photo-1519233181562-35b0b8bb2b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80"
              }
              alt={"Porcelain Collection"}
              fill
              className="object-cover"
              priority
            />
            <div className="h-full w-full absolute bg-black opacity-50 flex items-center justify-center"></div>
            <div className="absolute">
              <Link href="/artist">
                <Button text="Artist"></Button>
              </Link>
            </div>
          </div>
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              }
              alt={"Porcelain Collection"}
              fill
              className="object-cover"
              priority
            />
            <div className="h-full w-full absolute bg-black opacity-50"></div>
            <div className="absolute">
              <Link href="/coordinator">
                <Button text="Coordinator"></Button>
              </Link>
            </div>
          </div>
          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={
                "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
              }
              alt={"Porcelain Collection"}
              fill
              className="object-cover"
              priority
            />
            <div className="h-full w-full absolute bg-black opacity-50"></div>
            <div className="absolute">
              <Link href="/customer">
                <Button text="Customer"></Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-10">
          <div className="text-3xl text-royal-blue font-serif mt-10">
            Or on your way out?
          </div>
          <div className="mx-auto">
            <Button text="Sign Out"></Button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <main className="mt-[100px] flex justify-center items-center">
      {session ? (
        <UserDashboard />
      ) : (
        <div className="text-center text-3xl font-serif text-royal-blue">
          You are not signed in
        </div>
      )}
    </main>
  );
}
