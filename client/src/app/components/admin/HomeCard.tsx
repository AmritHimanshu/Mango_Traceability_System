"use client";

import React, { useState } from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";
import { useRouter } from "next/navigation";

const allowedColors: Record<string, string> = {
  red: "bg-red-600",
  blue: "bg-blue-700",
  green: "bg-green-600",
  orange: "bg-orange-700",
};

function HomeCard({ title, description, count, bgColor, url }: HomeCardProps) {
  const bgColorClass = allowedColors[bgColor] || "bg-white";

  const router = useRouter();

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden min-w-[300px] text-center shadow-md duration-150 relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`w-full flex items-center justify-center absolute bottom-0 duration-300 bg-neutral-800 bg-opacity-65 ${
          isHover ? "h-full" : "h-0"
        }`}
      >
        {isHover && (
          <button
            className={`!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200 ${bgColorClass}`}
            onClick={() => router.push(url)}
          >
            view
          </button>
        )}
      </div>

      <div
        className={`p-2 xl:!p-5 bg-opacity-90 text-white font-bold text-sm sm:text-base ${bgColorClass}`}
      >
        {title}
      </div>

      <div
        className={`py-3 xl:py-5 font-bold text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${bgColorClass} bg-opacity-10`}
      >
        {count}
      </div>
    </div>
  );
}

export default HomeCard;
