import React from "react";
import Image from "next/image";
import mango_logo from "../../public/Mango_logo.png";

// Material UI Icon
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  return (
    <div className="py-2 px-4 bg-green-100 flex items-center justify-between">
      <div className="flex items-center justify-start">
        <Image src={mango_logo} alt="mango_logo" height={40} width={40}></Image>
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold">MTS</p>
          <div className="text-[5px] font-bold">Mango Traceability System</div>
        </div>
      </div>

      <MenuIcon />
    </div>
  );
}

export default Header;
