"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_FETCH_NO_OF_USERS,
  ADMIN_FEW_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import { useAppSelector } from "@/store/store";
import Mango_tree from "../../../public/assets/Mango_tree.png";
import HomeCard from "../components/admin/HomeCard";
import PendingUserCard from "../components/admin/PendingUserCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState(false);
  const [noOfVerifiedManagers, setNoOfVerifiedManagers] = useState(0);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(0);
  const [noOfPendingRequests, setNoOfPendingRequests] = useState(0);
  const [noOfRejectedRequests, sestNoOfRejectedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  const fetchNoOfUsers = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

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
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
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

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
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

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setPendingRequests(data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const authenticateReq = async (id: string, role: string, status: boolean) => {
    if (!role && status === true) {
      alert("Please assign role to the user!");
      return;
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
        return;
      }

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        return;
      }

      if (res.status === 500) {
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

  useEffect(() => {

    fetchNoOfUsers();
    fetchPendingRequests();

    const welcomeShown = localStorage.getItem("welcomeShown");

    if (!welcomeShown) {
      setShowWelcome(true);
      localStorage.setItem("welcomeShown", "true");

      const timerId = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }

  }, []);


  return (
    <div className="p-5 w-[calc(100vw-350px)] h-[calc(100vh-72px)] overflow-y-auto">
      <CustomLoadingBar ref={loadingBarRef} />

      {userState && showWelcome && (
        <div className="text-center p-2 bg-yellow-300 text-black font-bold shadow-md">
          Welcome {userState.name}!
        </div>
      )}

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

export default page;
