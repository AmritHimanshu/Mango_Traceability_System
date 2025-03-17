"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FarmList } from "@/utils/Types/interfaces";
import { LoadingBarRef } from "react-top-loading-bar";
import { ADMIN_FARM, LOGIN } from "@/utils/Paths/paths";
import { ADMIN_FETCH_FARMER_FARM_LIST } from "@/utils/Apis/api";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Message from "@/app/components/common/Message";
import ListFarmTable from "@/app/components/admin/ListFarmTable";
import Banner from "@/app/components/common/Banner";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();

  const user_id = pathname.split("/").pop();

  const [farms, setFarms] = useState<FarmList[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [farmerName, setFarmerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 5;

  const fetchFarms = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_LIST}/${user_id}?page=${currentPage}&limit=${limit}`,
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

  const handleSelectedFarm = async (id: string) => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    router.push(`${ADMIN_FARM}?farm_id=${id}`);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [currentPage]);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <Banner
        img_src="/assets/farmers_image.jpg"
        img_alt="Farmer"
        heading="Farmer"
        description={farmerName}
      />

      <div className="my-5">
        <div className="max-w-[90%] m-auto space-y-5">
          <div className="text-center font-bold text-black text-heading-size">
            List of <span className="text-customGreen">Farms</span>
          </div>
          {farms.length > 0 ? (
            <>
              <ListFarmTable farms={farms} idxCalc={(currentPage - 1) * limit} handleClick={handleSelectedFarm} />

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
    </div>
  );
}

export default page;
