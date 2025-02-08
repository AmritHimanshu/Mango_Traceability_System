import React from "react";

function Heading({ text }: { text: string }) {
  return (
    <>
      <div className="pb-2 md:pb-4 lg:pb-3 font-bold md:text-[16px] lg:text-[20px]">
        {text}
      </div>
      <hr className="border-[1px] border-gray-200" />
    </>
  );
}

export default Heading;
