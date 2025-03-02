"use client";

import React, { useEffect, useState } from "react";
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

  const [countNum, setCountNum] = useState(0);
  const duration = 2000;

  useEffect(() => {
    let startValue = 0;
    const interval = Math.floor(duration / (count - 0));

    const counter = setInterval(() => {
      startValue += 1;
      setCountNum(startValue);
      if (startValue >= count) {
        clearInterval(counter);
      }
    }, interval);

    return () => {
      clearInterval(counter);
    };
  }, [count]);

  return (
    <div className="w-[100%] flex items-center justify-between">
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
          {countNum}
        </div>
      </div>

      <div className="w-[70%] md:text-lg lg:text-xl xl:text-2xl text-black font-bold text-start">
        {title}
      </div>
    </div>
  );
}

export default HomeCard;
