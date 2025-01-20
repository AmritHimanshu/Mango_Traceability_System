"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import { ADMIN_MANAGER_MANAGEMENT } from "@/utils/Apis/api";
import ListUserCard from "@/app/components/admin/components/ListUserCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [managers, setManagers] = useState<User[]>([]);

  const limit = 7;
  let skip = 0;

  const fetchManagers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_MANAGER_MANAGEMENT}?limit=${limit}&skip=${skip}`,
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
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setManagers((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log(error);
      alert("Error fetchManagers");
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
      fetchManagers();
    }
  };

  useEffect(() => {
    fetchManagers();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className="px-3 py-3 relative">
      <CustomLoadingBar ref={loadingBarRef} />
      
      <div className="py-3 text-lg font-bold sticky top-[56px] z-30 bg-white text-center">
        Managers
      </div>
      {managers.length !== 0 ? (
        <div className="space-y-2">
          {managers.map((manager, index) => (
            <div key={index} className="border-b-[1px] py-3">
              <ListUserCard index={index} user={manager} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No records found!</div>
      )}
    </div>
  );
}

export default page;
