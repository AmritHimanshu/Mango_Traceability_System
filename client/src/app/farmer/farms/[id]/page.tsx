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

      // console.log(data);
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
    <div className="px-3 py-3 min-h-[calc(100vh-56px)]">
      {farm && (
        <>
          <Map coordinates={farm.geoFenceData}/>
        </>
      )}
    </div>
  );
}

export default page;
