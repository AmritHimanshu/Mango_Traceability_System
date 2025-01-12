"use client";

import React from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";

const allowedColors: Record<string, string> = {
    red: "text-red-500",
    blue: "text-blue-700",
    green: "text-green-800",
    orange: "text-orange-700",
  };

function HomeCard({ title, description, textColor }: HomeCardProps) {
    const textColorClass = allowedColors[textColor] || "text-black";

  return (
    <div className={`admin-card ${textColorClass}`}>
      {title}
      <p>{description}</p>
    </div>
  );
}

export default HomeCard;
