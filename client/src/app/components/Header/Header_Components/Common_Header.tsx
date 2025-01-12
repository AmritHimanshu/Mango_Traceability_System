"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HandleOnClickProps } from "@/utils/Types/interfaces";
import { LOGIN, REGISTER } from "@/utils/Paths/paths";

function Common_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === LOGIN ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(LOGIN)}
      >
        Login
      </div>
      <div
        className={`py-3 w-full border-b-[1px] border-black font-bold ${
          pathname === REGISTER ? "text-green-800" : "text-black"
        }`}
        onClick={() => handleOnClick(REGISTER)}
      >
        Register
      </div>
    </div>
  );
}

export default Common_Header;
