"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Login_Header() {
  const router = useRouter();

  return (
    <div className="absolute w-full top-0 z-[9999] transition-all duration-300 flex items-center justify-between">
      <div className="py-2 px-5">
        <Image
          src="/assets/cdac-logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="bg-white p-1 rounded-sm"
        />
      </div>
      
      <div className="py-2 px-5">
        <Image
          src="/assets/bau-logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="bg-white p-1 rounded-sm"
        />
      </div>
    </div>
  );
}

export default Login_Header;

// bg-[url(/assets/login-bg.jpg)] bg-cover bg-bottom bg-no-repeat
