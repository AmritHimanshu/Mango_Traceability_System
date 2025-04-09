"use client";

import React, { useRef } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";

function page() {

  const loadingBarRef = useRef<LoadingBarRef>(null);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      <div className="my-5 !space-y-5 max-w-[90%] m-auto p-2">
        
      </div>
    </div>
  );
}

export default page;
