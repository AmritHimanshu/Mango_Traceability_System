"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/utils/Types/interfaces";
import { LOGIN } from "@/utils/Paths/paths";
import ListUserCard from "@/app/components/admin/components/ListUserCard";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const [managers, setManagers] = useState<User[]>([]);

  const limit = 7;
  let skip = 0;

  const fetchManagers = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/admin/api/manager-management?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.status !== 201) {
        return router.push(LOGIN);
      }

      setManagers((prev) => {
        if (prev.length === 0) return data;
        else {
          return [...prev, ...data];
        }
      });
    } catch (error) {
      console.log(error);
      alert("Error fetchManagers");
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      skip = skip + limit;
      fetchManagers();
    }
  };

  useEffect(() => {
    fetchManagers();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <div className="px-3 py-3 relative">
      {managers.length !== 0 ? (
        <>
          <div className="py-3 text-lg font-bold sticky top-[56px] bg-white text-center">
            Managers
          </div>
          <div className="space-y-2">
            {managers.map((manager, index) => (
              <div key={index} className="border-b-[1px] py-3">
                <ListUserCard index={index} user={manager} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">No records found!</div>
      )}
    </div>
  );
}

export default page;
