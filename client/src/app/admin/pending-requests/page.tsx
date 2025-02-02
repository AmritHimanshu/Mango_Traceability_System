"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../../components/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import PendingUserCard from "@/app/components/admin/PendingUserCard";
import "../../../styles/style.css";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  const limit = 7;
  let skip = 0;

  const fetchPendingRequests = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_PENDING_REQUESTS}?limit=${limit}&skip=${skip}`,
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

      setPendingRequests((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log(error);
      alert("Error fetchPendingRequests");
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
      fetchPendingRequests();
    }
  };

  useEffect(() => {
    fetchPendingRequests();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const authenticateReq = async (id: string, role: string, status: boolean) => {
    if (!role && status === true) {
      alert("Please assign role to the user!");
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_AUTHENTICATE_USER}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: role, isAuthenticated: status }),
      });

      const data = await res.json();
      if (res.status === 400) {
        alert(data.error);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

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

      alert(data.message);

      setPendingRequests((prev) => {
        return prev.filter((request) => request._id !== id);
      });
    } catch (error) {
      console.log(error);
      alert("Error acceptRequest");
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto relative">
      <CustomLoadingBar ref={loadingBarRef} />

      <div className="pb-2 md:pb-4 lg:pb-3 font-bold md:text-[16px] lg:text-[20px] xl:text-[25px]">
        Pending Requests
      </div>
      <hr className="border-[1px] border-gray-200" />

      <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5">
        {pendingRequests.length !== 0 ? (
          <>
            {pendingRequests.map((request, index) => (
              <div key={index} className="space-y-2 p-3 bg-gray-50 shadow-md">
                <PendingUserCard
                  index={index}
                  request={request}
                  authenticateReq={authenticateReq}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500">No records found!</div>
        )}
      </div>
    </div>
  );
}

export default page;
