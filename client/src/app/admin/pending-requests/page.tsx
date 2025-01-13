"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import { ADMIN_AUTHENTICATE_USER, ADMIN_PENDING_REQUESTS } from "@/utils/Apis/api";
import PendingUserCard from "@/app/components/admin/components/PendingUserCard";
import "../../../styles/style.css";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  const limit = 7;
  let skip = 0;

  const fetchPendingRequests = async () => {
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
      if (res.status !== 201) {
        return router.push(LOGIN);
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

  const authenticateReq = async (id: string, status: boolean) => {
    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_AUTHENTICATE_USER}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isAuthenticated: status }),
      });

      const data = await res.json();
      if (res.status !== 201) {
        return router.push(LOGIN);
      }
      alert(data.message);

      setPendingRequests((prev)=>{
        return prev.filter(request => request._id !== id)
      });
    } catch (error) {
      console.log(error);
      alert("Error acceptRequest");
    }
  };

  return (
    <div className="px-3 py-3 relative">
      <div className="py-3 text-lg font-bold sticky top-[56px] bg-white text-center">
        Recent Requests
      </div>
      {pendingRequests.length !== 0 ? (
        <div className="space-y-7 bg-gray-50">
          {pendingRequests.map((request, index) => (
            <div key={index} className="space-y-2">
              <PendingUserCard
                index={index}
                request={request}
                authenticateReq={authenticateReq}
              />
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
