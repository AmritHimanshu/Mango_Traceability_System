"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { admin, farmer } from "@/utils/Sidebar/sidebarList";
import { useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import Header_Menu from "./Header_Menu";

// Material UI Icon
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ADMIN_PROFILE, FARMER_PROFILE, LOGIN } from "@/utils/Paths/paths";

function Header() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  const pathname = usePathname();
  const path = pathname.split("/")[2];

  const router = useRouter();

  const headRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleIsMenuState = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headRef.current && !headRef.current.contains(event.target as Node)) {
        setIsDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headRef]);

  if (!isClient) return null;

  return (
    <>
      <div
        className={`sticky w-full top-0 z-[9999] transition-all duration-300 ${
          scrolling ? "bg-white text-black shadow-sm" : "bg-white text-black"
        }`}
      >
        <div className="py-3 px-5 flex items-center justify-between">
          {!isMenu ? (
            <Link href="/" className="hover:text-customOrange">
              <Image
                src="/assets/cdac-logo.png"
                alt="Logo"
                width={50}
                height={50}
              />
              {/* <div className="flex items-center justify-start">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-bold">MTS</p>
                  <div className="text-[5px] font-bold">
                    Mango Traceability System
                  </div>
                </div>
              </div> */}
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

          {!isMenu ? (
            <>
              <div className="lg:hidden">
                <MenuIcon
                  className="cursor-pointer"
                  onClick={() => setIsMenu(!isMenu)}
                />
              </div>
              <div className="hidden lg:block text-center text-sm">
                <div className="flex space-x-5">
                  {userState?.role === "Admin" && (
                    <>
                      {admin
                        .filter(
                          (list) =>
                            list.name !== "Profile" && list.name !== "Logout"
                        )
                        .map((list, index) => (
                          <div
                            key={index}
                            className={`cursor-pointer hover:text-green-700 duration-150 ${
                              pathname === list.path || path === list.base_path
                                ? "font-bold text-[16px] text-customGreen"
                                : "bg-transparent"
                            }`}
                            onClick={() => router.push(list.path)}
                          >
                            {list.name}
                          </div>
                        ))}

                      <div className="relative">
                        <div
                          className="cursor-pointer font-bold hover:text-green-700 duration-150"
                          onClick={() => setIsDropDown(!isDropDown)}
                        >
                          ADMIN
                        </div>
                        {isDropDown && (
                          <div
                            ref={headRef}
                            className="absolute z-[999999] bg-white py-2 px-3 space-y-3 rounded-sm top-10"
                          >
                            <div
                              className={`cursor-pointer hover:text-green-700 duration-150 ${
                                pathname === `${ADMIN_PROFILE}`
                                  ? "font-bold text-[16px] text-customGreen"
                                  : "bg-transparent"
                              }`}
                              onClick={() => {
                                router.push(ADMIN_PROFILE);
                                setIsDropDown(false);
                              }}
                            >
                              Profile
                            </div>
                            <div
                              className={`cursor-pointer hover:text-green-700 duration-150 ${
                                pathname === `${LOGIN}`
                                  ? "font-bold text-[16px] text-customGreen"
                                  : "bg-transparent"
                              }`}
                              onClick={() => router.push(LOGIN)}
                            >
                              Logout
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {userState?.role === "Farmer" && (
                    <>
                      {farmer
                        .filter(
                          (list) =>
                            list.name !== "Profile" && list.name !== "Logout"
                        )
                        .map((list, index) => (
                          <div
                            key={index}
                            className={`cursor-pointer hover:text-green-700 duration-150 ${
                              pathname === list.path || path === list.base_path
                                ? "font-bold text-[16px] text-customGreen"
                                : "bg-transparent"
                            }`}
                            onClick={() => router.push(list.path)}
                          >
                            {list.name}
                            {list.name === "Notifications" &&
                              unreadCount > 0 && (
                                <span className="ml-1 bg-red-600 text-white text-[10px] rounded-full px-1">
                                  {unreadCount}
                                </span>
                              )}
                          </div>
                        ))}

                      <div className="relative">
                        <div
                          className="cursor-pointer font-bold hover:text-green-700 duration-150"
                          onClick={() => setIsDropDown(!isDropDown)}
                        >
                          FARMER
                        </div>
                        {isDropDown && (
                          <div
                            ref={headRef}
                            className="absolute z-[999999] bg-white py-2 px-3 space-y-3 rounded-sm top-10"
                          >
                            <div
                              className={`cursor-pointer hover:text-green-700 duration-150 ${
                                pathname === `${FARMER_PROFILE}`
                                  ? "font-bold text-[16px] text-customGreen"
                                  : "bg-transparent"
                              }`}
                              onClick={() => {
                                router.push(FARMER_PROFILE);
                                setIsDropDown(false);
                              }}
                            >
                              Profile
                            </div>
                            <div
                              className={`cursor-pointer hover:text-green-700 duration-150 ${
                                pathname === `${LOGIN}`
                                  ? "font-bold text-[16px] text-customGreen"
                                  : "bg-transparent"
                              }`}
                              onClick={() => router.push(LOGIN)}
                            >
                              Logout
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
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
        </div>

        {isMenu && (
          <div>
            <Header_Menu onNavigationComplete={handleIsMenuState} />
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
