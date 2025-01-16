"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import { ADMIN_FARMER_MANAGEMENT } from "@/utils/Apis/api";
import ListUserCard from "@/app/components/admin/components/ListUserCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const [farmers, setFarmers] = useState<User[]>([]);

  const limit = 7;
  let skip = 0;

  const fetchFarmers = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/${ADMIN_FARMER_MANAGEMENT}?limit=${limit}&skip=${skip}`,
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
        return;
      }

      if (res.status === 500) {
        const error = new Error(data.error);
        throw error;
      }

      setFarmers((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      skip = skip + limit;
      fetchFarmers();
    }
  };

  useEffect(() => {
    fetchFarmers();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className="px-3 py-3 relative">
      <div className="py-3 text-lg font-bold sticky top-[56px] bg-white text-center z-30">
        Farmers
      </div>
      {farmers.length !== 0 ? (
        <div className="space-y-2">
          {farmers.map((farmer, index) => (
            <div key={index} className="border-b-[1px] py-3">
              <ListUserCard index={index} user={farmer} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No records found!</div>
      )}
    </div>
  );
}

export default page;
