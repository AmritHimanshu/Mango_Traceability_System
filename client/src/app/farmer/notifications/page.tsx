"use client";

import React, { useRef } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/admin/Heading";

function page() {

  const loadingBarRef = useRef<LoadingBarRef>(null);

  return (
    <div className="p-5 w-full md:w-[calc(100vw-250px)] lg:w-[calc(100vw-300px)] xl:w-[calc(100vw-350px)] h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-y-auto">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text="NOTIFICATIONS" />
    </div>
  );
}

export default page;
