"use client";

import React, { useEffect, useState } from "react";
import { pendingRequests } from "@/utils/Types/interfaces";
import UserCard from "@/app/components/admin/components/UserCard";
import "../../../styles/style.css";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [pendingRequests, setPendingRequests] = useState<pendingRequests[]>([]);

  const limit = 15;
  let skip = 0;

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/admin/api/pending-requests?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log(data);
      setPendingRequests(data);
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
      const res = await fetch(`${BASE_URL}/admin/api/authenticate-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isAuthenticated: status }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        alert(data.error);
        console.log(data.error);
      }
      alert(data.message);

      fetchPendingRequests();
    } catch (error) {
      console.log(error);
      alert("Error acceptRequest");
    }
  };

  return (
    <div className="p-3">
      <div className="pb-2 text-lg font-bold">Recent Requests:</div>
      <div className="space-y-7">
        {pendingRequests.map((request, index) => (
          <div key={index} className="space-y-2">
            <UserCard
              index={index}
              request={request}
              authenticateReq={authenticateReq}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
