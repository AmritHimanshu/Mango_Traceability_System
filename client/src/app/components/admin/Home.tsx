"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_FETCH_NO_OF_USERS,
  ADMIN_FEW_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import Mango_tree from "../../../../public/assets/Mango_tree.png";
import HomeCard from "./components/HomeCard";
import PendingUserCard from "./components/PendingUserCard";

function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const [noOfVerifiedManagers, setNoOfVerifiedManagers] = useState(0);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(0);
  const [noOfPendingRequests, setNoOfPendingRequests] = useState(0);
  const [noOfRejectedRequests, sestNoOfRejectedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  const fetchNoOfUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_FETCH_NO_OF_USERS}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setNoOfVerifiedManagers(data.noOfVerifiedManagers);
      setNoOfVerifiedFarmers(data.noOfVerifiedFarmers);
      setNoOfPendingRequests(data.noOfPendingRequests);
      sestNoOfRejectedRequests(data.noOfRejectedRequests);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${ADMIN_FEW_PENDING_REQUESTS}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        return;
      }

      if(res.status === 500){
        const error = new Error(data.error);
        throw error;
      }

      setPendingRequests(data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    fetchNoOfUsers();
    fetchPendingRequests();
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
      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        return;
      }

      if(res.status === 500){
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);

      fetchNoOfUsers();
      fetchPendingRequests();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="py-5">
      <Image
        src={Mango_tree}
        alt="Mango Tree"
        height={300}
        width={300}
        priority={true}
        className="m-auto"
      />

      <div className="space-y-5 px-3">
        <HomeCard
          title="Total number of verified managers"
          description=""
          count={noOfVerifiedManagers}
          textColor="orange"
        />
        <HomeCard
          title="Total number of verified farmers"
          description=""
          count={noOfVerifiedFarmers}
          textColor="green"
        />
        <HomeCard
          title="Total number of pending requests"
          description=""
          count={noOfPendingRequests}
          textColor="violet"
        />
        <HomeCard
          title="Total number of rejected requests"
          description=""
          count={noOfRejectedRequests}
          textColor="red"
        />
      </div>

      {pendingRequests && (
        <div className="bg-gray-50 p-3 mt-10">
          <div className="pb-2 text-lg font-bold text-center underline">
            Recent Requests
          </div>
          <div className="space-y-7">
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

          <div
            className="mt-5 underline text-end"
            onClick={() => router.push("/admin/pending-requests")}
          >
            view all
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
