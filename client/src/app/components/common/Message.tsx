import React from "react";
import { useAppSelector } from "@/store/store";

function Message({ text, type }: { text: string; type: string }) {
  const userState = useAppSelector((state) => state.user.userState);

  return (
    <>
      {userState ? (
        <div
          className={`px-3 py-3 text-[14px] lg:text-[17px] fixed left-0 md:left-[250px] lg:left-[300px] xl:left-[350px] top-[56px] sm:top-[72px] text-start font-bold w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] text-white ${
            type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {text}
        </div>
      ) : (
        <div
          className={`px-3 py-3 text-[14px] lg:text-[17px] fixed left-0 top-[56px] sm:top-[72px] text-start font-bold w-full text-white ${
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
