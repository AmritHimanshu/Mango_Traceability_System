"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MapCoordinates from "./MapCoordinates";
import { farmerHomeCardProps } from "@/utils/Types/interfaces";
import { FARMS } from "@/utils/Paths/paths";

function HomeCard({ data }: farmerHomeCardProps) {
  const router = useRouter();

  return (
    <div className="w-[350px] bg-white p-3 shadow-lg rounded-md space-y-3">
      <MapCoordinates coordinates={data.geoFenceData} height="200px" />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-500">{data.uniqueID}</div>
          <div className="font-bold">{data.farm}</div>
          <div className="text-base">{data.crop}</div>
        </div>
        <div>
          <button
            className="!w-[130px] text-base lg:text-lg py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
            onClick={() => router.push(`${FARMS}/${data.uniqueID}`)}
          >
            view
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
