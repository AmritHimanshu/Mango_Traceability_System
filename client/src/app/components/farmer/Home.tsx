"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../loadingBar/CustomLoadingBar";
import { FARMER_FETCH_FEW_FARMS_LIST } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import { FewFarmList } from "@/utils/Types/interfaces";
import HomeCard from "./components/HomeCard";
import MapCoordinates from "./components/MapCoordinates";

function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [farmList, setFarmList] = useState<FewFarmList[]>([]);
  console.log(farmList);

  const fetchFewFarm = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${FARMER_FETCH_FEW_FARMS_LIST}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

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

      setFarmList(data);
    } catch (error) {
      console.log(error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFewFarm();
  }, []);

  return (
    <div className="py-5">
      <CustomLoadingBar ref={loadingBarRef} />

      <div className="space-y-5">
        {farmList.map((farm, index) => (
          <div key={index} className="px-5 h-[200px] overflow-scroll">
            <div className="w-full h-[200px]">
              <MapCoordinates coordinates={farm.geoFenceData} height="200px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
