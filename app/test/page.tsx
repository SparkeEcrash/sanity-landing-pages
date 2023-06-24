"use client";
import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
  }, []);
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-3xl">404.Test</p>
        <p className="text-lg mt-5 px-5">This page was not found!</p>
      </div>
    </main>
  );
}
