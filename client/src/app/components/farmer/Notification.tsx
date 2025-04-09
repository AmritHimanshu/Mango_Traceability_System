"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import { GET_NOTIFICATION } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";

function Notification() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [notification, setNotification] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/${GET_NOTIFICATION}?userId=${userState?.uniqueID}`,
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

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        const error = new Error(data.error);
        throw error;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setNotification(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="absolute bg-white text-black border-[1px] border-gray-400 w-[400px] right-0 top-[30px] z-[999999] p-2 rounded-md">
      {notification ? (
        <div>
          {notification.map((noti, index) => (
            <div key={index} className="space-y-3">
              {noti.message.split('".').map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 my-2">No records found!</div>
      )}
    </div>
  );
}

export default Notification;
