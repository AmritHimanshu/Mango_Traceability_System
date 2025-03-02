"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FarmList } from "@/utils/Types/interfaces";
import { LoadingBarRef } from "react-top-loading-bar";
import { ADMIN_FARM, LOGIN } from "@/utils/Paths/paths";
import { ADMIN_FETCH_FARMER_FARM_LIST } from "@/utils/Apis/api";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Message from "@/app/components/common/Message";
import ListFarmTable from "@/app/components/admin/ListFarmTable";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();

  const user_id = pathname.split("/").pop();

  const [farms, setFarms] = useState<FarmList[]>([]);
  console.log(farms);
  const [farmerName, setFarmerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 20;
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

      setFarmerName(data.user[0].name);

      setFarms((prev) => {
        if (prev.length === 0) return data.farmList;
        else {
          return [...prev, ...data.farmList];
        }
      });
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleSelectedFarm = async (id: string) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    router.push(`${ADMIN_FARM}?farm_id=${id}`);

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

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/farmers_image.jpg"
          alt="Farmer"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center">
          <div className="w-[80%] m-auto">
            <div className="text-[30px] md:text-[50px] font-bold text-white">
              Farmer
            </div>
            <div className="text-customOrange text-[20px] md:text-[30px]">
              {farmerName}
            </div>
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="max-w-[80%] m-auto space-y-5">
          <div className="text-center font-bold text-base md:text-lg lg:text-xl xl:text-2xl text-black">
            List of <span className="text-customGreen">Farms</span>
          </div>
          {farms.length > 0 ? (
            <ListFarmTable farms={farms} handleClick={handleSelectedFarm} />
          ) : (
            <div className="text-center text-gray-500 my-2">
              No records found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
