"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_FETCH_FARMER_FARM_DATA } from "@/utils/Apis/api";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { FARMER, LOGIN } from "@/utils/Paths/paths";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

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

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        router.push(FARMER);
        const error = new Error(data.error);
        throw error;
      }

      console.log(data);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  return (
    <div className="px-3 py-3 bg-gray-50 min-h-[calc(100vh-56px)] relative">
      <CustomLoadingBar ref={loadingBarRef} />

      <div>This is farm page</div>
    </div>
  );
}

export default page;
