"use client";

import React, { useState } from "react";
import Image from "next/image";
import mango_logo from "../../public/Mango_logo.png";
import Header_Menu from "./Header_Menu";

// Material UI Icon
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Header() {
  const [isMenu, setIsMenu] = useState(false);

  return (
    <>
      <div className="py-2 px-4 bg-green-100 flex items-center justify-between relative">
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

        {!isMenu ? (
          <MenuIcon onClick={() => setIsMenu(!isMenu)} />
        ) : (
          <CloseIcon onClick={() => setIsMenu(!isMenu)} />
        )}
      </div>
      {isMenu && (
        <div>
          <Header_Menu />
        </div>
      )}
    </>
  );
}

export default Header;
