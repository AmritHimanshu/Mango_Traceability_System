"use client";

import React, { useState } from "react";
import { ListUserCardProps } from "@/utils/Types/interfaces";

function ListUserCard({ index, user }: ListUserCardProps) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between text-[16px]">
        <div className="flex items-center space-x-2">
          <div>{index + 1}.</div>
          <div>{user.name}</div>
        </div>
        <div>
          <button className="bg-black text-white px-2 py-[2px] rounded-md">view</button>
        </div>
      </div>
    </>
  );
}

export default ListUserCard;
