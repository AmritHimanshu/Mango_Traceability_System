"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HandleOnClickProps } from "@/utils/Types/interfaces";
import { farmer } from "@/app/components/common/Header/HeaderList/headerList";

function Farmer_Header({ handleOnClick }: HandleOnClickProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3 p-[20px] bg-white h-full">
      {farmer.map((list, index) => (
        <div
          key={index}
          className={`py-3 w-full border-b-[1px] border-black font-bold cursor-pointer hover:text-gray-700 ${
            pathname === list.path ? "text-green-800" : "text-black"
          }`}
          onClick={() => handleOnClick(list.path)}
        >
          {list.name}
        </div>
      ))}
    </div>
  );
}

export default Farmer_Header;
