"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/common/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN, MANAGER } from "@/utils/Paths/paths";
import { ADMIN_MANAGER_MANAGEMENT } from "@/utils/Apis/api";
import Message from "@/app/components/common/Message";
import Table_List from "@/app/components/admin/Table_List";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [managers, setManagers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });

  const limit = 5;

  const fetchManagers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_MANAGER_MANAGEMENT}?page=${currentPage}&limit=${limit}`,
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

      setManagers(data.managers);
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
    fetchManagers();
  }, [currentPage]);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/manager_image.jpeg"
          alt="Manager"
          fill
          priority
          style={{ objectPosition: "center", objectFit: "cover" }}
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center">
          <div className="w-[80%] m-auto">
            <div className="text-[30px] md:text-[50px] font-bold text-white">
              Manager Management
            </div>
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="max-w-[90%] m-auto space-y-5">
          <div className="text-center font-bold text-black text-heading-size">
            Managers
          </div>
          {managers.length > 0 ? (
            <>
              <Table_List
                users={managers}
                idxCalc={(currentPage - 1) * limit}
                url={MANAGER}
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
            <div className="text-center text-gray-500">No records found!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
