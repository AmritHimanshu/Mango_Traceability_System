"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { admin } from "@/utils/Sidebar/sidebarList";
import { usePathname, useRouter } from "next/navigation";

function Sidebar() {
  const userState = useAppSelector((state) => state.user.userState);

  const pathname = usePathname();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(()=>{
    setIsClient(true);
  },[]);

  if (!isClient) return null;

  return (
    <div className="bg-gray-100 pl-5 md:w-[250px] lg:w-[300px] xl:w-[350px] h-[calc(100vh-56px)] sm:h-[calc(100vh-72px)] hidden md:block">
      <div>
        {userState?.role === "Admin" &&
          admin.map((list, index) => (
            <div key={index}
              className={`px-4 py-5 w-full text-[16px] lg:text-[18px] cursor-pointer hover:bg-gray-50 duration-150 ${
                pathname === list.path ? "bg-white font-bold border-l-[5px] border-yellow-400" : "bg-transparent"
              }`}
              onClick={() => router.push(list.path)}
            >
              {list.name}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
