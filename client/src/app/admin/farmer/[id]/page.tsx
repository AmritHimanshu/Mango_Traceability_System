"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FarmList } from "@/utils/Types/interfaces";
import { LoadingBarRef } from "react-top-loading-bar";
import { LOGIN } from "@/utils/Paths/paths";
import { ADMIN_FETCH_FARMER_FARM_LIST } from "@/utils/Apis/api";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const pathname = usePathname();

  const id = pathname.split("/").pop();

  const [farms, setFarms] = useState<FarmList[]>([]);

  console.log(farms);

  const limit = 10;
  let skip = 0;

  const fetchFarms = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FETCH_FARMER_FARM_LIST}/${id}?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.status !== 201 && res.status !== 500) {
        router.push(LOGIN);
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setFarms((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      skip = skip + limit;
      fetchFarms();
    }
  };

  useEffect(() => {
    fetchFarms();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div>
      <div>This is farmer page</div>
    </div>
  );
}

export default page;
