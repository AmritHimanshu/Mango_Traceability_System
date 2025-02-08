import React from "react";

function Message({ text, type }: { text: string; type: string }) {
  return (
    <div
      className={`px-3 py-3 text-[14px] lg:text-[17px] absolute left-0 top-0 text-start font-bold w-full text-white ${
        type === "error" ? "bg-red-500" : "bg-green-600"
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
