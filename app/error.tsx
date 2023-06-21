"use client";

export default async function Error() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-3xl">500.</p>
        <p className="text-lg mt-5 px-5">Something went wrong!</p>
      </div>
    </main>
  );
}
