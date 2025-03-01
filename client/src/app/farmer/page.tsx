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
import Message from "../components/common/Message";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" });
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

      setFarmList(data);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

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
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[100vh] relative">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/bg_video.mp4" type="video/mp4" />
        </video>

        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-10 lg:space-y-0 w-full lg:w-[60%]">
            <div className="w-full lg:w-[50%]">
              <div className="w-full text-[30px] md:text-[50px] xl:text-[60px] 2xl:text-[80px] font-bold">Pure Organic Products</div>
            </div>

            <div className="w-full lg:w-[45%] text-base md:text-lg lg:text-base 2xl:text-xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Cupiditate soluta asperiores ipsam at quaerat modi quia ex id
              inventore? Vero.
            </div>
          </div>
        </div>
      </div>

      <div>
      {farmList.length > 0 && (
        <div className="my-5 !space-y-5 p-2">
          <div className="text-center font-bold text-base md:text-lg lg:text-xl xl:text-2xl text-black">Recent <span className="text-customGreen">Farms</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-fit mx-auto justify-center">
            {farmList.map((farm, index) => (
              <HomeCard key={index} data={farm} />
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default page;
