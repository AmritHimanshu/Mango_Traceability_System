"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import { GET_NOTIFICATION } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "@/app/components/common/Message";
import { notification } from "@/utils/Types/interfaces";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [notification, setNotification] = useState<notification[]>([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchNotifications = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

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

      console.log(data);

      setNotification(data);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="my-5 !space-y-5 max-w-[90%] m-auto p-2">
        <div className="font-bold text-black text-heading-size">Notifications</div>
        {notification ? (
          <div className="space-y-12 w-full lg:w-[55%] text-black">
            {notification.map((noti, index) => (
              <div key={index} className="space-y-5">
                {noti.message.split('".').map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}

                <div className="text-right text-gray-600">
                  {new Date(noti.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 my-2">
            No records found!
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
