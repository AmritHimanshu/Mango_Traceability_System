"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FARMER_FETCH_FARM_DATA } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import { Farm } from "@/utils/Types/interfaces";
const Map = dynamic(
  () => import("@/app/components/farmer/components/MapCoordinates"),
  {
    ssr: false,
  }
);

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [farm, setFarm] = useState<Farm>();
  console.log(farm);

  const fetchFarmData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${FARMER_FETCH_FARM_DATA}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status !== 201) {
        router.push(LOGIN);
      }

      setFarm(data);
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);


  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)]">
      {farm && (
        <form className="space-y-10 my-5">
          <Map coordinates={farm.geoFenceData}/>

          <div className="flex items-start flex-col">
            <label htmlFor="">Farm Name:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Crop Name:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Ploughing Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Weeding Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Sowing Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Flowering Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Pheromone Trap Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Lure Change Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Irrigation Date:</label>
            <input type="text" className="input-tag"/>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="">Harvest Date:</label>
            <input type="text" className="input-tag"/>
          </div>
        </form>
      )}
    </div>
  );
}

export default page;
