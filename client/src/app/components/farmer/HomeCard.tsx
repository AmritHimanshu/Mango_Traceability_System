"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MapCoordinates from "./MapCoordinates";
import { farmerHomeCardProps } from "@/utils/Types/interfaces";
import { FARMS } from "@/utils/Paths/paths";

function HomeCard({ data }: farmerHomeCardProps) {
  const router = useRouter();

  return (
    <div className="w-full rounded-md overflow-hidden space-y-2">
      <MapCoordinates coordinates={data.geoFenceData} height="200px" />

      <div className="flex justify-between">
        <div>
          <div className="font-bold">{data.farm}</div>
          <div className="text-[13px]">{data.crop}</div>
        </div>
        <button
          className="px-3 text-center bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white duration-200"
          onClick={() => router.push(`${FARMS}/${data.uniqueID}`)}
        >
          view
        </button>
      </div>
    </div>
  );
}

export default HomeCard;
