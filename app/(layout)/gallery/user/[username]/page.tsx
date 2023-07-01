import UserHome from "@components/userHome";

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  return (
    <main className="pt-[100px] flex items-center justify-center bg-white min-h-screen">
      <section className="max-w-7xl relative w-full">
        <UserHome username={username} />
      </section>
    </main>
  );
}
