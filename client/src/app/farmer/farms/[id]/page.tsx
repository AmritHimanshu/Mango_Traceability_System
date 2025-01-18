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

  const [farm, setFarm] = useState({
    farm: "",
    crop: "",
    geoFenceData: [{ lat: 0, lng: 0 }],
    ploughingDate: "",
    weedingDate: "",
    sowingDate: "",
    floweringDate: "",
    pheromoneTrapDate: "",
    lureChangeDate: "",
    irrigationDates: {
      artificial: "",
      natural: "",
    },
    harvest: "",
  });

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

      setFarm({
        farm: data.farm || "",
        crop: data.crop.name || "",
        geoFenceData: data.geoFenceData || [{ lat: 0, lng: 0 }],
        ploughingDate: data.crop.ploughingDate || "",
        weedingDate: data.crop.weedingDate || "",
        sowingDate: data.crop.sowingDate || "",
        floweringDate: data.crop.floweringDate || "",
        pheromoneTrapDate: data.crop.pheromoneTrapDate || "",
        lureChangeDate: data.crop.lureChangeDate || "",
        irrigationDates: {
          artificial: data.crop.irrigationDates?.artificial || "",
          natural: data.crop.irrigationDates?.natural || "",
        },
        harvest: data.crop.harvest || "",
      });
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFarm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)]">
      {farm && (
        <div className="space-y-10 my-5">
          <Map coordinates={farm.geoFenceData} />

          <div className="flex items-start flex-col">
            <label htmlFor="farm">Farm Name:</label>
            <input
              type="text"
              id="farm"
              name="farm"
              value={farm.farm}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="crop">Crop Name:</label>
            <input
              type="text"
              id="crop"
              name="crop"
              value={farm.crop}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="ploughingDate">Ploughing Date:</label>
            <input
              type="text"
              id="ploughingDate"
              name="ploughingDate"
              value={farm.ploughingDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="weedingDate">Weeding Date:</label>
            <input
              type="text"
              id="weedingDate"
              name="weedingDate"
              value={farm.weedingDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="sowingDate">Sowing Date:</label>
            <input
              type="text"
              id="sowingDate"
              name="sowingDate"
              value={farm.sowingDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="floweringDate">Flowering Date:</label>
            <input
              type="text"
              id="floweringDate"
              name="floweringDate"
              value={farm.floweringDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="pheromoneTrapDate">Pheromone Trap Date:</label>
            <input
              type="text"
              id="pheromoneTrapDate"
              name="pheromoneTrapDate"
              value={farm.pheromoneTrapDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="lureChangeDate">Lure Change Date:</label>
            <input
              type="text"
              id="lureChangeDate"
              name="lureChangeDate"
              value={farm.lureChangeDate}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="irrigationDates">Irrigation Dates:</label>
            <input
              type="text"
              id="irrigationDates"
              name="irrigationDates"
              value=""
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="harvest">Harvest Date:</label>
            <input
              type="text"
              id="harvest"
              name="harvest"
              value={farm.harvest}
              className="input-tag"
              onChange={(e) => handleOnChange(e)}
            />
          </div>
          <button onClick={()=>console.log(farm)}>Click here</button>
        </div>

      )}
    </div>
  );
}

export default page;
