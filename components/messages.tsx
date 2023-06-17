"use client";
import { useAppSelector } from "@redux/store";
import SyncLoader from "react-spinners/SyncLoader";
import { motion, AnimatePresence } from "framer-motion";

export default function Messages() {
  const messages = useAppSelector((state) => state.messages.messages);
  return (
    <div className="fixed flex flex-col gap-y-4 z-30 top-[120px] left-[1em]">
      <AnimatePresence mode={"popLayout"}>
        {messages.map(({ key, text, showLoading, dark }) => (
          <motion.div
            layout
            initial={{ x: "-200%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-200%", opacity: 0 }}
            key={key}
            className={`p-8 flex border title-font ${
              dark ? "bg-royal-blue text-white" : "bg-white"
            } shadaow-md min-w-[250px] justify-center`}
          >
            {text}
            {showLoading && (
              <SyncLoader
                color={`${dark ? "#FFFFFF" : "#153084"}`}
                size={5}
                className="ml-2 mt-4"
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
