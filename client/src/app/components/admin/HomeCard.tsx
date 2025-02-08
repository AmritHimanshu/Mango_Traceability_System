"use client";

import React from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";

const allowedColors: Record<string, string> = {
    red: "text-red-500",
    blue: "text-blue-700",
    green: "text-green-800",
    orange: "text-orange-700",
    violet: "text-violet-700",
  };

function HomeCard({ title, description, count, textColor }: HomeCardProps) {
    const textColorClass = allowedColors[textColor] || "text-black";

  return (
    <div className={`p-3 md:p-5 text-[13px] md:text-[16px] text-center font-bold bg-cardBackground rounded-md shadow-md ${textColorClass}`}>
      <p>{title}</p>
      <p className="text-[12px] font-normal">{description}</p>
      <p className="text-[16px] md:text-[20px]">{count}</p>
    </div>
  );
}

export default HomeCard;
