"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import { CREATE_FARM, FARMS, LOGIN } from "@/utils/Paths/paths";
import { FARMER_FETCH_FARMS_LIST } from "@/utils/Apis/api";
import { FarmList } from "@/utils/Types/interfaces";
import ListFarmTable from "@/app/components/admin/ListFarmTable";
import Message from "@/app/components/common/Message";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [farms, setFarms] = useState<FarmList[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 5;

  const fetchFarms = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${FARMER_FETCH_FARMS_LIST}?page=${currentPage}&limit=${limit}`,
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

      setFarms(data.farmList);
      setTotalPages(data.totalPages);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [currentPage]);

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
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/lychee-fruit.jpg"
          alt="Lychee Fruit"
          fill
          priority
          style={{ objectPosition: "center", objectFit: "cover" }}
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center">
          <div className="">
            <button
              className="!w-[170px] lg:!w-[220px] text-sm lg:text-lg py-[5px] lg:py-[7px] bg-customOrange bg-opacity-90 text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
              onClick={() => router.push(CREATE_FARM)}
            >
              Click here to Add farm
            </button>
          </div>
        </div>
      </div>

      <div className="my-5 !space-y-5 max-w-[80%] m-auto p-2">
        <div className="text-center font-bold text-base md:text-lg lg:text-xl xl:text-2xl text-black">
          Your <span className="text-customGreen">Farms</span>
        </div>
        {farms.length > 0 ? (
          <>
            <ListFarmTable
              farms={farms}
              idxCalc={(currentPage - 1) * limit}
              handleClick={handleSelectedFarm}
            />

            <div className="space-x-5 text-center text-black">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${currentPage == i + 1 && "text-customGreen"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
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
