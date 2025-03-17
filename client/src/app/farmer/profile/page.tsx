"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/store";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Message from "@/app/components/common/Message";
import { LoadingBarRef } from "react-top-loading-bar";
import Image from "next/image";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);
  console.log(userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/profile_image.avif"
          alt="profile"
          fill
          priority
          style={{ objectPosition: "top", objectFit: "cover" }}
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-70 flex items-center justify-start">
          <div className="w-[80%] m-auto">
            <div className="text-[30px] md:text-[50px] font-bold text-white">
              Profile
            </div>
          </div>
        </div>
        <div className="h-[200px] w-[200px] m-auto border-2 border-black bg-white rounded-full absolute left-1/2 bottom-[-100px] transform -translate-x-1/2"></div>
      </div>

      <div className="my-32 min-h-[200px]">
        <div className="max-w-[90%] m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-black">
          <div>{userState?.name}</div>
          <div>{userState?.role}</div>
          <div>{userState?.email}</div>
          <div>{userState?.phone}</div>
        </div>
      </div>
    </div>
  );
}

export default page;
