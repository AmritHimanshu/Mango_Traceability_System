"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import Admin_Header from "./Header_Components/Admin_Header";
import Common_Header from "./Header_Components/Common_Header";

interface HeaderMenuProps {
  onNavigationComplete: () => void;
}

function Header_Menu({ onNavigationComplete }: HeaderMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const userState = useAppSelector((state) => state.user.userState);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const url = `/${e.currentTarget.innerText.toLowerCase()}`;
    router.push(url);
    onNavigationComplete();
  };

  return (
    <div className="h-[calc(100vh-56px)] p-[20px] absolute w-full bg-white">
      {!userState ? (
        <Common_Header handleOnClick={handleOnClick} />
      ) : (
        userState?.role === "Admin" && (
          <Admin_Header handleOnClick={handleOnClick} />
        )
      )}
    </div>
  );
}

export default Header_Menu;
