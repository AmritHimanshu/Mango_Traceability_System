"use client";

import React, { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Message from "@/app/components/common/Message";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();

  const user_id = pathname.split("/").pop();

  const [managerName, setManagerName] = useState("Manager");
  const [message, setMessage] = useState({ text: "", type: "" });

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="h-[500px] md:h-[600px] xl:h-[400px] relative">
        <Image
          src="/assets/farmers_image.jpg"
          alt="Farmer"
          fill
          priority
          style={{ objectPosition: "center", objectFit: "cover" }}
        />
        <div className="p-3 md:p-5 absolute top-0 w-full h-full bg-neutral-950 bg-opacity-50 flex items-center justify-center">
          <div className="w-[80%] m-auto">
            <div className="text-[30px] md:text-[50px] font-bold text-white">
              Manager
            </div>
            <div className="text-customOrange text-[20px] md:text-[30px]">
              {managerName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
