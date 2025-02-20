"use client";

import React, { useState } from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";

const allowedColors: Record<string, string> = {
  red: "bg-red-600",
  blue: "bg-blue-700",
  green: "bg-green-600",
  orange: "bg-orange-500",
  violet: "bg-violet-600",
};

function HomeCard({ title, description, count, bgColor }: HomeCardProps) {
  const bgColorClass = allowedColors[bgColor] || "bg-white";

  const [isMouseEnter, setIsMouseEnter] = useState(false);

  return (
    <div
      className={`p-3 md:p-5 space-y-1 lg:space-y-2 text-[13px] md:text-[16px] text-center font-bold bg-gray0 shadow-xl w-[250px] xl:w-[250px] 2xl:w-[300px] h-[250px] xl:h-[250px] 2xl:h-[300px] rounded-full flex flex-col items-center justify-center text-white ${bgColorClass} hoverbg-sky-100 hoverbg-gradient-to-t hoverfrom-sky-100 hoverto-white duration-1000 overflow-hidden relative`}
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
    >
      {/* <div className={`absolute ${isMouseEnter ? "h-full w-full opacity-70" : "h-0 w-0"} duration-300 rounded-full bg-gradient-to-t from-black to-neutral-400`}></div> */}
      <p>{title}</p>
      <p className="text-[12px] font-normal">{description}</p>
      <p className="text-[16px] md:text-[20px]">{count}</p>
    </div>
  );
}

export default HomeCard;
