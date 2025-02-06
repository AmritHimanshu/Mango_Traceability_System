import React from "react";

function Message({ text, type }: { text: string; type: string }) {
  return (
    <div
      className={`px-2 py-2 text-[14px] absolute top-0 text-start font-bold w-full text-white ${
        type === "error" ? "bg-red-500" : "bg-green-600"
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
