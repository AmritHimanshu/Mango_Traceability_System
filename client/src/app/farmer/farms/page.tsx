"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import { CREATE_FARM, FARMS, LOGIN } from "@/utils/Paths/paths";
import { FARMER_FETCH_FARMS_LIST } from "@/utils/Apis/api";
import { FarmList } from "@/utils/Types/interfaces";
import ListFarmCard from "@/app/components/farmer/ListFarmCard";
import Heading from "@/app/components/admin/Heading";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [farms, setFarms] = useState<FarmList[]>([]);

  const limit = 10;
  let skip = 0;

  const fetchFarms = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${FARMER_FETCH_FARMS_LIST}?limit=${limit}&skip=${skip}`,
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
        const error = new Error(data.error);
        throw error;
      }

      setFarms((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      skip = skip + limit;
      fetchFarms();
    }
  };

  useEffect(() => {
    fetchFarms();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleSelectedFarm = async (id: string) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    router.push(`${FARMS}/${id}`);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto relative">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text="Farms" />

      <div className="my-2">
        <button
          className="btn bg-black text-white hover:bg-opacity-85 duration-200"
          onClick={() => router.push(CREATE_FARM)}
        >
          Click here to Add farm
        </button>
      </div>

      <div className="my-5">
        {farms.length !== 0 ? (
          <div className="space-y-3 mt-2">
            {farms.map((farm, index) => (
              <ListFarmCard
                key={index}
                idx={index}
                farm={farm}
                handleClick={handleSelectedFarm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 my-2">
            No records found!
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
