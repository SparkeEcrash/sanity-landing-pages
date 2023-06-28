import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { redirect } from "next/navigation";
import UserComments from "@components/userComments";

export default async function Likes() {
  const data = await getServerSession(authOptions);
  if (!data) {
    redirect("/gallery");
  }

  return (
    <main className="py-[100px] min-h-screen">
      <section className="flex flex-col justify-center items-center">
        <UserComments />
      </section>
    </main>
  );
}
