"use client";

import React, { useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/common/Heading";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [managerName, setManagerName] = useState("Manager");

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      <Heading text={managerName} />
    </div>
  );
}

export default page;
