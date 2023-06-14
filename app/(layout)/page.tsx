"use client";
import Hero from "sanity-components/hero/hero";
import { incrementByAmount, reset, login } from "@redux/features/sampleSlice";
import { AppDispatch, useAppSelector } from "@redux/store";
import { addMessage, removeMessage } from "@redux/features/messagesSlice";
import Toggle from "@components/toggle";
import { useState } from "react";

export default function Home() {
  const dispatch = AppDispatch();
  const username = useAppSelector((state) => state.sample.auth.username);
  const number = useAppSelector((state) => state.sample.value);
  const [toggle, setToggle] = useState<boolean>(false);

  const clickMe = () => {
    dispatch(login({ string: "james", number: 7 }));
  };

  // dispatch(login({ string: "james", number: 7 }));

  return (
    <main>
      <div className="h-[500px] w-full border flex-center">
        <div onClick={() => setToggle(!toggle)}>
          {/* <Toggle toggle={toggle} /> */}
        </div>
      </div>
      {/* <div
        onClick={() =>
          dispatch(
            addMessage({
              text: "My Ear Candy!",
              showLoading: true,
              key: "candy",
            })
          )
        }
        className={`mt-[200px] text-right`}
      >
        Click to add Candy Message
      </div>
      <div
        onClick={() =>
          dispatch(
            addMessage({
              text: "It's 2PM!",
              showLoading: true,
              key: "2PM",
            })
          )
        }
        className={`mt-[200px] text-right`}
      >
        Click to add 2PM Message
      </div>
      <div
        onClick={() => dispatch(removeMessage("candy"))}
        className={`mt-[200px] text-right`}
      >
        Click to remove Candy Message
      </div>
      <div
        onClick={() => dispatch(removeMessage("2PM"))}
        className={`mt-[200px] text-right`}
      >
        Click to remove 2PM Message
      </div> */}
      <Hero />
    </main>
  );
}
