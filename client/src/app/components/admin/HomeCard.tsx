"use client";

import React from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";

const allowedColors: Record<string, string> = {
    red: "bg-red-600",
    blue: "bg-blue-700",
    green: "bg-green-600",
    orange: "bg-orange-500",
    violet: "bg-violet-600",
  };

function HomeCard({ title, description, count, bgColor }: HomeCardProps) {
    const bgColorClass = allowedColors[bgColor] || "text-black";

  return (
    <div className={`p-3 md:p-5 space-y-1 lg:space-y-2 text-[13px] md:text-[16px] text-center font-bold bg-gray0 shadow-xl w-[250px] xl:w-[250px] 2xl:w-[300px] h-[250px] xl:h-[250px] 2xl:h-[300px] rounded-full flex flex-col items-center justify-center text-white ${bgColorClass} hoverbg-sky-100 hoverbg-gradient-to-t hoverfrom-sky-100 hoverto-white duration-1000 overflow-hidden`}>
      <p>{title}</p>
      <p className="text-[12px] font-normal">{description}</p>
      <p className="text-[16px] md:text-[20px]">{count}</p>
    </div>
  );
}

export default HomeCard;
