import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { redirect } from "next/navigation";
import UserProfile from "@components/userProfile";

export default async function User() {
  const data = await getServerSession(authOptions);
  if (!data) {
    redirect("/gallery");
  }

  return (
    <main className="pt-[100px] flex items-center justify-center bg-input-grey min-h-screen">
      <section className="p-14 max-w-7xl relative">
        <UserProfile />
      </section>
    </main>
  );
}
