"use client";

import React, { useEffect, useRef, useState } from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";
import Groups3Icon from "@mui/icons-material/Groups3";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";

const allowedColors: Record<string, string> = {
  red: "text-red-600",
  blue: "text-blue-700",
  green: "text-green-600",
  orange: "text-orange-400",
};

function HomeCard({
  title,
  description,
  count,
  textColor,
  url,
}: HomeCardProps) {
  const textColorClass = allowedColors[textColor] || "text-black";


  return (
    <div className="w-[100%] flex items-center justify-between border-[1px] border-gray-600 rounded-md p-2">
      <div className="w-[30%] text-black text-center space-y-2">
        <div>
          {description === "pending_requests" && (
            <Groups3Icon style={{ fontSize: "50px", color: `${textColor}` }} />
          )}
          {description === "verified_managers" && (
            <GroupsIcon style={{ fontSize: "50px", color: `${textColor}` }} />
          )}
          {description === "verified_farmers" && (
            <GroupsIcon style={{ fontSize: "50px", color: `${textColor}` }} />
          )}
          {description === "rejected_requests" && (
            <GroupRemoveIcon
              style={{ fontSize: "50px", color: `${textColor}` }}
            />
          )}
        </div>
        <div
          className={`md:text-lg lg:text-[25px] xl:text-[30px] font-bold ${textColorClass}`}
        >
          {count}
        </div>
      </div>

      <div className="w-[70%] md:text-lg lg:text-xl xl:text-2xl text-black font-bold text-start">
        {title}
      </div>
    </div>
  );
}

export default HomeCard;
