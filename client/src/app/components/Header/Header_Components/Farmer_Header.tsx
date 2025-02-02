"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HandleOnClickProps } from "@/utils/Types/interfaces";
import {
  FARMS,
  LOGIN,
  NOTIFICATIONS,
  FARMER_OVERVIEW,
  PROFILE,
} from "@/utils/Paths/paths";

function Farmer_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === FARMER_OVERVIEW ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(FARMER_OVERVIEW)}
      >
        Overview
      </div>

      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === FARMS ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(FARMS)}
      >
        Farms
      </div>

      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === NOTIFICATIONS ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(NOTIFICATIONS)}
      >
        Notifications
      </div>

      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === PROFILE ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(PROFILE)}
      >
        Profile
      </div>

      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === LOGIN ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(LOGIN)}
      >
        Logout
      </div>
    </div>
  );
}

export default Farmer_Header;
