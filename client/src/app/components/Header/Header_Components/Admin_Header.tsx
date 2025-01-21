"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HandleOnClickProps } from "@/utils/Types/interfaces";
import {
  FARMER_MANAGEMENT,
  LOGIN,
  MANAGER_MANAGEMENT,
  OVERVIEW,
  PENDING_REQUESTS,
  PROFILE,
} from "@/utils/Paths/paths";

function Admin_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === OVERVIEW ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(OVERVIEW)}
      >
        Overview
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === MANAGER_MANAGEMENT ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(MANAGER_MANAGEMENT)}
      >
        Manager Management
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === FARMER_MANAGEMENT ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(FARMER_MANAGEMENT)}
      >
        Farmer Management
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === PENDING_REQUESTS ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(PENDING_REQUESTS)}
      >
        Pending requests
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

export default Admin_Header;
