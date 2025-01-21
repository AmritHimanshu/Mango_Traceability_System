"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);
  console.log(userState);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-[calc(100vh-56px)] p-3 bg-gray-50">
      {userState && (
        <div className="p-4 space-y-5">
          <div className="h-[150px] w-[150px] m-auto border-2 border-black rounded-full"></div>
          <div className="space-y-[1px]">
            <div className="font-bold">{userState.name}</div>
            <div>{userState.email}</div>
            <div>{userState.phone}</div>
            <div>{userState.role}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
