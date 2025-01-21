"use client";

import React from "react";
import { useAppSelector } from "@/store/store";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);
  console.log(userState)

  return (
    <div className="min-h-[calc(100vh-56px)] p-3 bg-gray-50">
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default page;
