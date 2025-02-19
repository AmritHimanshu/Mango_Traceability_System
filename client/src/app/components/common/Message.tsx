import React from "react";
import { useAppSelector } from "@/store/store";

function Message({ text, type }: { text: string; type: string }) {
  const userState = useAppSelector((state) => state.user.userState);

  return (
    <>
      {userState ? (
        <div
          className={`px-3 py-3 text-[14px] lg:text-[17px] fixed z-[99999] left-0 top-[56px] sm:top-[72px] text-start font-bold w-full text-white ${
            type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {text}
        </div>
      ) : (
        <div
          className={`px-3 py-3 text-[14px] lg:text-[17px] fixed z-[99999] left-0 top-0 top-[56px sm:top-[72px text-start font-bold w-full text-white ${
            type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {text}
        </div>
      )}
    </>
  );
}

export default Message;
