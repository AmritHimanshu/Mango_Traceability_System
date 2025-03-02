"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import { User } from "@/utils/Types/interfaces";
import {
  FARMER_MANAGEMENT,
  LOGIN,
  MANAGER_MANAGEMENT,
  PENDING_REQUESTS,
} from "@/utils/Paths/paths";
import {
  ADMIN_AUTHENTICATE_USER,
  ADMIN_FETCH_NO_OF_USERS,
  ADMIN_FEW_PENDING_REQUESTS,
} from "@/utils/Apis/api";
import { useAppSelector } from "@/store/store";
import Message from "../components/common/Message";
import HomeCard from "../components/admin/HomeCard";
import PendingUserTable from "../components/admin/PendingUserTable";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" });
  const [showWelcome, setShowWelcome] = useState(false);
  const [noOfVerifiedManagers, setNoOfVerifiedManagers] = useState(0);
  const [noOfVerifiedFarmers, setNoOfVerifiedFarmers] = useState(0);
  const [noOfPendingRequests, setNoOfPendingRequests] = useState(0);
  const [noOfRejectedRequests, sestNoOfRejectedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [parameter, setParameter] = useState({
    id: "",
    role: "",
    status: false,
  });

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

      setNoOfVerifiedManagers(data.noOfVerifiedManagers);
      setNoOfVerifiedFarmers(data.noOfVerifiedFarmers);
      setNoOfPendingRequests(data.noOfPendingRequests);
      sestNoOfRejectedRequests(data.noOfRejectedRequests);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

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

      setPendingRequests(data);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  const authenticateReq = async (id: string, role: string, status: boolean) => {
    if (!role && status === true) {
      setMessage({ text: "Please assign role to the user!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);

      setIsConfirm(false);
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
      if (res.status === 400 || res.status === 404) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

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

      setMessage({ text: data.message, type: "success" });

      fetchNoOfUsers();
      fetchPendingRequests();
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
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

  const confirmReq = (id: string, role: string, status: boolean) => {
    setIsConfirm(true);
    setParameter({
      id: id,
      role: role,
      status: status,
    });
  };

  const handleOnCancel = () => {
    setIsConfirm(false);
    setParameter({
      id: "",
      role: "",
      status: false,
    });
  };

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[100vh] relative">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/bg_video.mp4" type="video/mp4" />
        </video>

        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-10 lg:space-y-0 w-full lg:w-[60%]">
            <div className="w-full lg:w-[50%]">
              <div className="w-full text-[30px] md:text-[50px] xl:text-[60px] 2xl:text-[80px] font-bold">
                Pure <span className="text-customGreen">Organic</span> Products
              </div>
            </div>

            <div className="w-full lg:w-[45%] text-base md:text-lg lg:text-base 2xl:text-xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Cupiditate soluta asperiores ipsam at quaerat modi quia ex id
              inventore? Vero.
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] m-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        <HomeCard
          title="Total number of pending requests"
          description="pending_requests"
          count={noOfPendingRequests}
          textColor="orange"
          url={PENDING_REQUESTS}
        />
        <HomeCard
          title="Total number of verified managers"
          description="verified_managers"
          count={noOfVerifiedManagers}
          textColor="green"
          url={MANAGER_MANAGEMENT}
        />
        <HomeCard
          title="Total number of verified farmers"
          description="verified_farmers"
          count={noOfVerifiedFarmers}
          textColor="green"
          url={FARMER_MANAGEMENT}
        />
        <HomeCard
          title="Total number of rejected requests"
          description="rejected_requests"
          count={noOfRejectedRequests}
          textColor="red"
          url=""
        />
      </div>

      {pendingRequests.length > 0 && (
        <div className="my-5 space-y-5">
          <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-center underline">
            Recent Pending Requests
          </div>
          <div className="w-full rounded-lg shadow-2xl overflow-hidden">
            <table className="w-full text-[10px] md:text-[13px] lg:text-[16px] table-fixed">
              <thead>
                <tr className="font-bold bg-primarycColor bg-opacity-80 text-white">
                  <td className="px-4 py-3 text-left">S. No.</td>
                  <td className="px-4 py-3 text-left">Name</td>
                  <td className="px-4 py-3 text-left">Email</td>
                  <td className="px-4 py-3 text-left">Phone</td>
                  <td className="px-4 py-3 text-left">Date</td>
                  <td className="px-4 py-3 text-left">Assign role</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-400">Accept</span>/
                    <span className="text-red-400">Reject</span>
                  </td>
                </tr>
              </thead>

              <tbody className="text-[9px] md:text-[12px] lg:text-[16px]">
                {pendingRequests.map((user, index) => (
                  <PendingUserTable
                    key={index}
                    idx={index}
                    user={user}
                    confirmReq={confirmReq}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end my-4">
            <span
              className="mt-3 underline text-end cursor-pointer hover:text-blue-700 duration-200"
              onClick={() => router.push("/admin/pending-requests")}
            >
              view all
            </span>
          </div>
        </div>
      )}

      {isConfirm && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center">
          <div className="bg-white p-3 w-[300px] md:w-[400px] lg:w-[450px] m-auto space-y-5 rounded-md">
            <div>
              <div className="text-sm md:text-xl">
                Are you sure, you want to save?
              </div>
              <div className="text-[10px] md:text-[13px]">
                You will not be able to edit/change after saving!
              </div>
            </div>
            <div className="text-end text-[11px] md:text-lg space-x-2">
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-red-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() => handleOnCancel()}
              >
                Cancel
              </button>
              <button
                className="!w-[30px] md:!w-[50px] lg:!w-[100px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                onClick={() =>
                  authenticateReq(
                    parameter.id,
                    parameter.role,
                    parameter.status
                  )
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
