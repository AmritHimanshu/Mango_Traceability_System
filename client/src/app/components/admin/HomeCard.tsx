"use client";

import React, { useState } from "react";
import { HomeCardProps } from "@/utils/Types/interfaces";
import { useRouter } from "next/navigation";
import InfoIcon from "@mui/icons-material/Info";
import Groups3Icon from "@mui/icons-material/Groups3";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';

const allowedColors: Record<string, string> = {
  red: "text-red-600",
  blue: "text-blue-700",
  green: "text-green-600",
  orange: "text-orange-400",
};

function HomeCard({ title, description, count, textColor, url }: HomeCardProps) {
  const textColorClass = allowedColors[textColor] || "text-black";

  const router = useRouter();

  const [isHover, setIsHover] = useState(false);

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
            <GroupRemoveIcon style={{ fontSize: "50px", color: `${textColor}` }} />
          )}
        </div>
        <div className={`md:text-lg lg:text-[25px] xl:text-[30px] font-bold ${textColorClass}`}>
          {count}
        </div>
      </div>

      <div className="w-[70%] md:text-lg lg:text-xl xl:text-2xl text-black font-bold text-start">
        {title}
      </div>
    </div>

    // <div
    //   className="rounded-lg overflow-hidden min-w-[300px] text-center shadow-md duration-150 relative"
    //   onMouseEnter={() => setIsHover(true)}
    //   onMouseLeave={() => setIsHover(false)}
    // >
    //   <div
    //     className={`w-full flex items-center justify-center absolute bottom-0 duration-300 bg-neutral-800 bg-opacity-65 ${
    //       isHover ? "h-full" : "h-0"
    //     }`}
    //   >
    //     {isHover && (
    //       <InfoIcon
    //       style={{
    //         color: `${bgColor}`,
    //         cursor: "pointer",
    //         fontSize: "30px",
    //       }}
    //       onClick={() => router.push(url)}
    //     />
    //     )}
    //   </div>

    //   <div
    //     className={`p-2 xl:!p-5 bg-opacity-90 text-white font-bold text-sm sm:text-base ${bgColorClass}`}
    //   >
    //     {title}
    //   </div>

    //   <div
    //     className={`py-3 xl:py-5 font-bold text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${bgColorClass} bg-opacity-10`}
    //   >
    //     {count}
    //   </div>
    // </div>
  );
}

export default HomeCard;
