"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { HeaderMenuProps } from "@/utils/Types/interfaces";
import Admin_Header from "./Header_Components/Admin_Header";
import Farmer_Header from "./Header_Components/Farmer_Header";

function Header_Menu({ onNavigationComplete }: HeaderMenuProps) {
  const router = useRouter();

  const userState = useAppSelector((state) => state.user.userState);

  const handleOnClick = (url: string) => {
    router.push(url);
    onNavigationComplete();
  };

  return (
    <div className="h-[calc(100vh-56px)] p-[20px] absolute z-[9999] w-full">
      {userState?.role === "Admin" && (
        <Admin_Header handleOnClick={handleOnClick} />
      )}
      {userState?.role === "Farmer" && (
        <Farmer_Header handleOnClick={handleOnClick} />
      )}
    </div>
  );
}

export default Header_Menu;
