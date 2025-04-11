"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import socket from "@/utils/Services/socket";
import { useDispatch } from "react-redux";
import { incrementUnread } from "@/store/features/notificationSlice";

const SocketInitializer = () => {
  const user = useAppSelector((state) => state.user.userState);
  const userId = user?.uniqueID;

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      socket.connect();
      socket.emit("identify", userId);

      socket.on("notification", (data) => {
        // console.log("📬 Notification received:", data);
        dispatch(incrementUnread());
      });
    }

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [userId]);

  return null;
};

export default SocketInitializer;