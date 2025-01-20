"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FARMER_NEW_FARM } from "@/utils/Apis/api";
import { FARMS } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/app/components/farmer/components/Map"), {
  ssr: false,
});

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");

  const handlesubmitForm = async (coordinates: [number, number][]) => {
    if (!farmName || !cropName) {
      return alert("Fill all the form");
    }
    if (coordinates.length < 3) {
      return alert("Select minimum three coordinate");
    }
    try {
      const res = await fetch(`${BASE_URL}/${FARMER_NEW_FARM}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          farmName,
          cropName,
          coordinates,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (res.status !== 201) {
        alert(data.error);
        return;
      }

      if (res.status === 500 || res.status === 400) {
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      router.push(FARMS);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }
  };

  return (
    <div className="px-3 py-3 min-h-[calc(100vh-56px)]">
      <div className="bg-cardBackground bg-opacity-90 rounded-md shadow-md p-5 space-y-3">
        <div className="text-center font-medium">Enter data of farm</div>
        <div className="space-y-10">
          <div className="flex items-start flex-col">
            <label htmlFor="farmName">
              Name of the farm <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              value={farmName}
              className="input-tag"
              required
              onChange={(e) => setFarmName(e.target.value)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="cropName">
              Name of the crop <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={cropName}
              className="input-tag"
              required
              onChange={(e) => setCropName(e.target.value)}
            />
          </div>

          <Map submitForm={handlesubmitForm} />
        </div>
      </div>
    </div>
  );
}

export default page;
