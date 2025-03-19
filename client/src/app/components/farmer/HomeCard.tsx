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
          <div className="text-xs text-gray-900">{data.uniqueID}</div>
          <div className="text-black">{data.farm}</div>
          <div className="text-xs text-black">{data.crop}</div>
        </div>
        <div>
          <button
            className="outline-btn text-customGreen border-customGreen hover:text-white hover:bg-customGreen"
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
