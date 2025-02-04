"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/store";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import { FARMER_FETCH_FEW_FARMS_LIST } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import { FewFarmList } from "@/utils/Types/interfaces";
import HomeCard from "../components/farmer/HomeCard";
import Heading from "../components/admin/Heading";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState(false);
  const [farmList, setFarmList] = useState<FewFarmList[]>([]);

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

    const welcomeShown = localStorage.getItem("welcomeShown");

    if (!welcomeShown) {
      setShowWelcome(true);
      localStorage.setItem("welcomeShown", "true");

      const timerId = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, []);

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto">
      <CustomLoadingBar ref={loadingBarRef} />

      {userState && showWelcome && (
        <div className="text-center p-2 bg-yellow-300 text-black font-bold shadow-md mb-5">
          Welcome {userState.name}!
        </div>
      )}

      <Heading text="OVERVIEW" />

      <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
        {farmList.map((farm, index) => (
          <div key={index} className="p-3 bg-gray-50 shadow-md">
            <HomeCard data={farm} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
