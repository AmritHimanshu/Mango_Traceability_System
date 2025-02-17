"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import { Farm } from "@/utils/Types/interfaces";
import CustomLoadingBar from "@/app/components/loadingBar/CustomLoadingBar";
import Heading from "@/app/components/common/Heading";
import { ADMIN_FARM } from "@/utils/Paths/paths";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const farm_id = searchParams.get("farm_id");

  const [farmData, setFarmData] = useState<Farm>();

  const handleOnCancel = () => {
    router.push(`${ADMIN_FARM}?farm_id=${farm_id}`);
  };

  return (
    <div>
      <CustomLoadingBar ref={loadingBarRef} />

      {farmData && <Heading text={`${farmData.farm} (Edit)`} />}

      <div className="text-end my-7">
        <button
          onClick={handleOnCancel}
          className="bg-red-600 text-white hover:bg-red-100 hover:text-red-600 duration-200 rounded-sm px-2 py-1 text-[11px] md:text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default page;
