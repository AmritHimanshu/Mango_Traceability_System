"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import mango_logo from "../../../../public/assets/Mango_logo.png";
import Header_Menu from "./Header_Menu";

// Material UI Icon
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Header() {
  const [isMenu, setIsMenu] = useState(false);

  const handleIsMenuState = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    if (isMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenu]);

  return (
    <div className="sticky top-0 z-[9999]">
      <div className="py-4 px-4 bg-gray-100 flex items-center justify-between">
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
          <div className="py-2 flex space-x-2" onClick={()=>setIsMenu(false)}>
          <ArrowBackIcon />
          <div>Back</div>
          </div>
        )}

        {!isMenu ? (
          <MenuIcon onClick={() => setIsMenu(!isMenu)} />
        ) : (
          <CloseIcon onClick={() => setIsMenu(!isMenu)} />
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
