"use client";

import React, { useState } from "react";
import { NEW_FARM } from "@/utils/Apis/api";
import Map from "@/app/components/farmer/components/Map";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");

  const handlesubmitForm = async (coordinates: [number, number][]) => {
    console.log(farmName);
    console.log(cropName);
    console.log(coordinates);
    if (!farmName || !cropName) {
      return alert("Fill all the form");
    }
    if (coordinates.length < 3) {
      return alert("Select minimum three coordinate");
    }
    try {
      const res = await fetch(`${BASE_URL}/${NEW_FARM}`, {
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
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  return (
    <div className="px-3 py-3 min-h-[calc(100vh-56px)] relative">
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
