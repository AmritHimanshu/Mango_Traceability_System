"use client";

import React from "react";
import { ListFarmCardProps } from "@/utils/Types/interfaces";

function ListFarmCard({ idx, farm, handleClick }: ListFarmCardProps) {

  return (
    <>
      <div className="flex justify-between">
        <div className="flex space-x-2 w-[65%]">
          <div>{idx + 1} </div>
          <div className="space-y-[2px] w-[90%]">
            <div className="font-medium truncate overflow-hidden whitespace-nowrap">
              {farm.farm}
            </div>
            <div className="text-[14px] truncate overflow-hidden whitespace-nowrap">
              {farm.crop}
            </div>
            <div className="text-[11px] text-gray-600">
              {new Date(farm.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </div>
          </div>
        </div>
        <div className="relative w-[30%] md:w-[25%] xl:w-[15%]">
          <button
            className="btn bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white absolute bottom-0 duration-200"
            onClick={() => handleClick(farm._id)}
          >
            view details
          </button>
        </div>
      </div>
      <hr className="border-neutral-300" />
    </>
  );
}

export default ListFarmCard;
