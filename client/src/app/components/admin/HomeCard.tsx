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
  const bgColorClass = allowedColors[bgColor] || "bg-white";

  return (
    <div className="rounded-lg overflow-hidden min-w-[300px] text-center shadow-md duration-150">
      <div
        className={`p-2 xl:!p-5 bg-opacity-90 text-white font-bold text-sm sm:text-base ${bgColorClass}`}
      >
        {title}
      </div>
      <div className={`py-3 xl:py-5 font-bold text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${bgColorClass} bg-opacity-20`}>
        {count}
      </div>
    </div>
  );
}

export default HomeCard;
