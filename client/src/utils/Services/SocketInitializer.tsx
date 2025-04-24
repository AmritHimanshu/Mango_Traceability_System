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
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
};

export default SocketInitializer;