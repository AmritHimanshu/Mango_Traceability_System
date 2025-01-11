"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface HandleOnClickProps {
  handleOnClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function Common_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/login" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Login
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === "/register" ? "text-green-800" : "text-black"
        }`}
        onClick={(e) => handleOnClick(e)}
      >
        Register
      </div>
    </div>
  );
}

export default Common_Header;
