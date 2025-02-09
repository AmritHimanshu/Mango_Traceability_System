"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { FARMER_NEW_FARM } from "@/utils/Apis/api";
import { FARMS, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/store";
import Heading from "@/app/components/common/Heading";
import Message from "@/app/components/common/Message";
const Map = dynamic(() => import("@/app/components/farmer/Map"), {
  ssr: false,
});
import { polygon, area } from "@turf/turf";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  useEffect(() => {
    if (userState === null) router.push(NOT_FOUND);
  }, []);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" });
  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");

  const calculateAreaOfLand = (coordinates: [number, number][]) => {
    if (coordinates.length < 3) {
      setMessage({ text: "Select minimum three coordinates", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return null;
    }

    const poly = polygon([coordinates]);

    const areaInSquareMeters = area(poly);

    return areaInSquareMeters;
  };

  const handlesubmitForm = async (coordinates: [number, number][]) => {
    if (!farmName || !cropName) {
      setMessage({ text: "Fill all the form", type: "error" });
    }
    if (coordinates.length < 3) {
      setMessage({ text: "Select minimum three coordinates", type: "error" });
    }

    const area = calculateAreaOfLand(coordinates);

    if (!area) {
      setMessage({ text: "Select minimum three coordinates", type: "error" });
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
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
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      if (res.status !== 201 && res.status !== 500) {
        setMessage({ text: data.error, type: "error" });
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      router.push(FARMS);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

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
