"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/store";
import mango_logo from "../../../../public/assets/Mango_logo.png";
import Header_Menu from "./Header_Menu";

// Material UI Icon
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Header() {
  const userState = useAppSelector((state) => state.user.userState);

  const [isClient, setIsClient] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const handleIsMenuState = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    setIsClient(true);

    if (isMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenu]);

  if (!isClient) return null;

  return (
    <div className="sticky top-0 z-[9999] bg-slate-200">
      <div className="p-2 sm:py-4 sm:px-4 flex items-center justify-between">
        {!isMenu ? (
          <Link href="/">
            <div className="flex items-center justify-start">
              <Image
                src={mango_logo}
                alt="mango_logo"
                priority={true}
                height={40}
                width={40}
              />
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">MTS</p>
                <div className="text-[5px] font-bold">
                  Mango Traceability System
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div
            className="py-2 flex space-x-2 cursor-pointer"
            onClick={() => setIsMenu(false)}
          >
            <ArrowBackIcon />
            <div>Back</div>
          </div>
        )}

        {userState && (
          <>
            {!isMenu ? (
              <>
              <div className="md:hidden">
                <MenuIcon
                  className="cursor-pointer"
                  onClick={() => setIsMenu(!isMenu)}
                />
              </div>
              <div className="hidden md:block text-center text-sm font-semibold text-gray-800">
                <div>{userState.name.toUpperCase()}</div>
                <div className="font-thin text-[11px]">{userState.uniqueID}</div>
              </div>
              </>
            ) : (
              <div className="md:hidden">
                <CloseIcon
                  className="cursor-pointer"
                  onClick={() => setIsMenu(!isMenu)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {isMenu && (
        <div>
          <Header_Menu onNavigationComplete={handleIsMenuState} />
        </div>
      )}
    </div>
  );
}

export default Header;
