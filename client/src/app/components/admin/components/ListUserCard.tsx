"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListUserCardProps } from "@/utils/Types/interfaces";
import { FARMER } from "@/utils/Paths/paths";

function ListUserCard({ index, user }: ListUserCardProps) {
  const router = useRouter();

  const handleOnView = async () => {
    router.push(FARMER);
  };

  return (
    <>
      <div className="flex items-center justify-between text-[16px]">
        <div className="flex items-center space-x-3 w-[70%]">
          <div>{index + 1}.</div>
          <div className="truncate overflow-hidden whitespace-nowrap">
            {user.name}
          </div>
        </div>
        <div className="w-[25%]">
          <button
            className="w-full bg-black text-white px- py-[3px] rounded-md"
            onClick={handleOnView}
          >
            view
          </button>
        </div>
      </div>
    </>
  );
}

export default ListUserCard;
