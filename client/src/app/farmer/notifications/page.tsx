"use client";

import React, { useRef } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/common/Heading";

function page() {

  const loadingBarRef = useRef<LoadingBarRef>(null);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text="NOTIFICATIONS" />
    </div>
  );
}

export default page;
