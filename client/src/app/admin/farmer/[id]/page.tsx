"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FarmList } from "@/utils/Types/interfaces";
import { LoadingBarRef } from "react-top-loading-bar";
import { FARMER, LOGIN } from "@/utils/Paths/paths";
import { ADMIN_FETCH_FARMER_FARM_LIST } from "@/utils/Apis/api";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/admin/Heading";
import ListFarmCard from "@/app/components/farmer/ListFarmCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();

  const user_id = pathname.split("/").pop();

  const [farms, setFarms] = useState<FarmList[]>([]);
  const [farmerName, setFarmerName] = useState("");

  const limit = 10;
  let skip = 0;

  const fetchFarms = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_LIST}/${user_id}?limit=${limit}&skip=${skip}`,
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

      setFarmerName(data[0].userId.name);

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

  const handleSelectedFarm = async (id: string) => {
    router.push(`${FARMER}/farm?farm_id=${id}`);
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

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto relative">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text={farmerName} />

      <div className="my-3">
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
