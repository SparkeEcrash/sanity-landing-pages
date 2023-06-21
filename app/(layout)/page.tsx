"use client";
import Hero from "sanity-components/hero/hero";
import { incrementByAmount, reset, login } from "@redux/features/sampleSlice";
import { AppDispatch, useAppSelector } from "@redux/store";
import { addMessage, removeMessage } from "@redux/features/messagesSlice";
import Toggle from "@components/toggle";
import { useState } from "react";

export default function Home() {

  return (
    <main>
      <Hero />
    </main>
  );
}
