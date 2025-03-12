"use client";

import React, { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Message from "@/app/components/common/Message";
import Banner from "@/app/components/common/Banner";

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

      <Banner
        img_src="/assets/manager_image.jpeg"
        img_alt="Manager"
        heading="Manager"
        description=""
      />
    </div>
  );
}

export default page;
