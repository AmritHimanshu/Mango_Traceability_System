"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { FARMER_NEW_FARM } from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/store";
import Heading from "@/app/components/admin/Heading";
const Map = dynamic(() => import("@/app/components/farmer/Map"), {
  ssr: false,
});
import { polygon, area } from '@turf/turf';

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  useEffect(() => {
    if (userState === null) router.push(NOT_FOUND);
  }, []);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");

  const calculateAreaOfLand = (coordinates: [number, number][]) => {
    if (coordinates.length < 3) {
      alert("Select atlead three coordinates");
      return null;
    }

    const poly = polygon([coordinates]);

    const areaInSquareMeters = area(poly);

    return areaInSquareMeters;
  };

  const handlesubmitForm = async (coordinates: [number, number][]) => {
    if (!farmName || !cropName) {
      return alert("Fill all the form");
    }
    if (coordinates.length < 3) {
      return alert("Select minimum three coordinate");
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    const area = calculateAreaOfLand(coordinates);

    if (!area) {
      alert("Select atlead three coordinates");
      return;
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
          area,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        alert(data.error);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      router.push(FARMS);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto relative">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text="Create New Farm" />

      <div className="p-5 space-y-3">
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

          <div className="flex items-start justify-between">
            <label htmlFor="cropName">
              Name of the crop <span className="text-red-600">*</span>
            </label>
            <select
              name="cropName"
              id="cropName"
              value={cropName}
              className="border-2 border-black px-2 py-1 outline-0"
              onChange={(e) => setCropName(e.target.value)}
            >
              <option value="">Select crop</option>
              <option value="Mango">Mango</option>
              <option value="Lichi">Lichi</option>
            </select>
          </div>

          <Map submitForm={handlesubmitForm} />
        </div>
      </div>
    </div>
  );
}

export default page;
