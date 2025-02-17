"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import { Farm } from "@/utils/Types/interfaces";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/common/Heading";
import { ADMIN_FARM, LOGIN, NOT_FOUND } from "@/utils/Paths/paths";
import { ADMIN_FETCH_FARMER_FARM_DATA } from "@/utils/Apis/api";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleOnCancel = () => {
    router.push(`${ADMIN_FARM}?farm_id=${farm_id}`);
  };

  const fetchFarmData = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_DATA}/${farm_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        router.push(NOT_FOUND);
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

      setFarmData(data);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  return (
    <div className="page-main-div relative">
      <CustomLoadingBar ref={loadingBarRef} />

      {farmData && <Heading text={`${farmData.farm} (Edit)`} />}

      <div className="text-end my-7">
        <button
          onClick={handleOnCancel}
          className="bg-red-600 text-white hover:bg-red-100 hover:text-red-600 duration-200 rounded-sm px-2 py-1 text-[11px] md:text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default page;
