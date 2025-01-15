"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FARMER_FETCH_FARM_DATA } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const fetchFarmData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${FARMER_FETCH_FARM_DATA}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

    //   if (res.status !== 201) {
    //     router.push(LOGIN);
    //   }

      console.log(data);
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, []);

  return (
    <div>
      <div>This is id</div>
    </div>
  );
}

export default page;
