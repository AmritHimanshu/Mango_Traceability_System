"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { resetUnread } from "@/store/features/notificationSlice";
import { useRouter } from "next/navigation";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import { GET_NOTIFICATION } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "@/app/components/common/Message";
import { notification } from "@/utils/Types/interfaces";
import { getRelativeTime } from "@/utils/Services/getRelativeTime";
import socket from "@/utils/Services/socket";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const dispatch = useDispatch();

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
    dispatch(resetUnread());
    fetchNotifications();
  }, []);
  
  useEffect(() => {
    const handleNotification = (data: notification) => {
      setNotification((prev) => [data, ...prev]);
    };
  
    socket.on("notification", handleNotification);
  
    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="my-5 !space-y-5 max-w-[90%] m-auto p-2">
        <div className="font-bold text-black text-heading-size text-center">
          Notifications
        </div>
        {notification ? (
          <div className="space-y-12 w-full lg:w-[80%] m-auto text-black">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-table-head-size">
                    <td className="px-4 py-3 text-left"></td>
                  </tr>
                </thead>

                <tbody className="text-table-body-size">
                  {notification.map((noti, index) =>
                    noti.message.map((msg, idx) => (
                      <tr
                        key={`${index}-${idx}`}
                        className="text-black bg-customGreen bg-opacity-10 odd:bg-opacity-5 border-b-[1px] border-black last:border-b-0"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div>{msg}</div>
                          <div className="text-right text-gray-600 text-xs">{getRelativeTime(noti.createdAt)}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
