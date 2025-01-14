"use client";

import React from "react";
import ListFarmCard from "@/app/components/farmer/components/ListFarmCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSelectedFarm = async (id: string) => {};

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)] relative">
      <div className="my-2">
        <button className="btn bg-black text-white">Create new farm</button>
      </div>

      <div className="my-5">
        <div className="py-3 text-lg font-bold sticky top-[56px] bg-white text-center z-30">
          Your farms
        </div>
        <div className="space-y-3 mt-2">
          <ListFarmCard
            key="index1"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
          <ListFarmCard
            key="index2"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
          <ListFarmCard
            key="index3"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
          <ListFarmCard
            key="index4"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
          <ListFarmCard
            key="index5"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
          <ListFarmCard
            key="index6"
            id="1"
            name="Name of farm"
            crop="Crop's name"
            date="01/11/2025 11:30 AM"
            handleClick={handleSelectedFarm}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
