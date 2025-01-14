"use client";

import React from "react";
import { ListFarmCardProps } from "@/utils/Types/interfaces";

function ListFarmCard({ id, name, crop, date, handleClick }: ListFarmCardProps) {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex space-x-2 w-[65%]">
          <div>1. </div>
          <div className="space-y-[2px] w-[90%]">
            <div className="font-medium truncate overflow-hidden whitespace-nowrap">
              {name}
            </div>
            <div className="text-[14px] truncate overflow-hidden whitespace-nowrap">
              {crop}
            </div>
            <div className="text-[11px] text-gray-600">{date}</div>
          </div>
        </div>
        <div className="relative w-[30%]">
          <button className="btn bg-black text-white text-[10px] absolute bottom-0" onClick={()=>handleClick(id)}>
            view details
          </button>
        </div>
      </div>
      <hr className="border-neutral-300" />
    </>
  );
}

export default ListFarmCard;
