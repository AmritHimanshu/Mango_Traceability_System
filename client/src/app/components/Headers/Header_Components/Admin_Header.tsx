"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface HandleOnClickProps {
    handleOnClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function Admin_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Overview
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/manager-management" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Manager Management
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/farmer-management" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Farmer Management
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/pending-requests" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Pending requests
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/logout" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Logout
      </div>
    </div>
  );
}

export default Admin_Header;
