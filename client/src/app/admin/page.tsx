"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import {
  LOGIN,
  USER_MANAGEMENT,
  PENDING_REQUESTS,
} from "@/utils/Paths/paths";
import {
  ADMIN_FETCH_NO_OF_USERS,
} from "@/utils/Apis/api";
import { useAppSelector } from "@/store/store";
import Message from "../components/common/Message";
import HomeCard from "../components/admin/HomeCard";
import HomeAboutUs from "../components/common/HomeAboutUs";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" });
  const [showWelcome, setShowWelcome] = useState(false);
  const [noOfVerifiedManagers, setNoOfVerifiedManagers] = useState(0);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(0);
  const [noOfPendingRequests, setNoOfPendingRequests] = useState(0);
  const [noOfRejectedRequests, sestNoOfRejectedRequests] = useState(0);

  const fetchNoOfUsers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_FETCH_NO_OF_USERS}`, {
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

      setNoOfVerifiedManagers(data.noOfVerifiedManagers);
      setNoOfVerifiedFarmers(data.noOfVerifiedFarmers);
      setNoOfPendingRequests(data.noOfPendingRequests);
      sestNoOfRejectedRequests(data.noOfRejectedRequests);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchNoOfUsers();

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
              <div className="w-full text-[30px] md:text-[50px] xl:text-[60px] 2xl:text-[80px] font-bold">
                Pure <span className="text-customGreen">Organic</span> Products
              </div>
            </div>

            <div className="w-full lg:w-[45%] text-base md:text-lg lg:text-base 2xl:text-xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Cupiditate soluta asperiores ipsam at quaerat modi quia ex id
              inventore? Vero.
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 p-3 md:p-5">
        <HomeAboutUs />
      </div>

      <div className="my-5 bg-customGreen bg-opacity-5 p-5">
        <div className="max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] m-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <HomeCard
            title="Total number of pending requests"
            description="pending_requests"
            count={noOfPendingRequests}
            textColor="orange"
            url={PENDING_REQUESTS}
          />
          <HomeCard
            title="Total number of verified managers"
            description="verified_managers"
            count={noOfVerifiedManagers}
            textColor="green"
            url={USER_MANAGEMENT}
          />
          <HomeCard
            title="Total number of verified farmers"
            description="verified_farmers"
            count={noOfVerifiedFarmers}
            textColor="green"
            url="{FARMER_MANAGEMENT}"
          />
          <HomeCard
            title="Total number of rejected requests"
            description="rejected_requests"
            count={noOfRejectedRequests}
            textColor="red"
            url=""
          />
        </div>
      </div>
    </div>
  );
}

export default page;
