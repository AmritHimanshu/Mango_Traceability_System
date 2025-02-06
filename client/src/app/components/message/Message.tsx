import React from "react";

function Message({ text, type }: { text: string; type: string }) {
  return (
    <div
      className={`px-2 py-1 text-[13px] absolute top-0 text-start w-full text-white ${
        type === "error" ? "bg-red-400" : "bg-green-600"
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
