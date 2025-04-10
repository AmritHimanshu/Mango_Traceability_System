"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import socket from "@/utils/Services/socket";

const SocketInitializer = () => {
  const user = useAppSelector((state) => state.user.userState);
  const userId = user?.uniqueID;

  useEffect(() => {
    if (userId) {
      socket.connect();
      socket.emit("identify", userId);

      socket.on("notification", (data) => {
        console.log("📬 Notification received:", data);
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