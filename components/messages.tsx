"use client";
import { useAppSelector } from "@redux/store";
import SyncLoader from "react-spinners/SyncLoader";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

export default function Messages() {
  const messages = useAppSelector((state) => state.messages.messages);
  return (
    <div className="fixed flex flex-col gap-y-4 z-30 top-[120px] left-[1em]">
      <AnimatePresence mode={"popLayout"}>
        {messages.map((message) => (
          <motion.div
            layout
            initial={{ x: "-200%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-200%", opacity: 0 }}
            transition={{ delay: -0.2 }}
            key={message.key}
            className={`p-8 flex border bg-white title-font shadaow-md min-w-[250px] justify-center`}
          >
            {message.text}
            {message.showLoading && (
              <SyncLoader color="#153084" size={5} className="ml-2 mt-4" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
