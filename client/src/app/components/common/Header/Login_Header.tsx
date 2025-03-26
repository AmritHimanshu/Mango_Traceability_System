"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Login_Header() {
  const router = useRouter();

  return (
    <div className="sticky w-full top-0 z-[9999] bg-white transition-all duration-300 flex items-center justify-between">
      <div className="py-3 px-5">
        <Image
          src="/assets/cdac-logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="bg-white p-1 rounded-sm"
        />
      </div>
      <div className="text-center px-2 hidden md:block">
        <div className="font-bold text-customOrange text-xs md:text-sm lg:text-xl">
          Making Maldha Aam Accessible to every Indian
        </div>
        <div className="text-xs text-black hidden lg:block">
          we are dedicated to deliver fresh and natural mangoes which are grown
          chemical residue free to your door step. We provide all variety of
          mangoes to our customers.
        </div>
      </div>
      <div className="py-3 px-5 text-black cursor-pointer hover:!text-green-700 duration-150" onClick={() => router.push('/contact-us')}>Contact us</div>
    </div>
  );
}

export default Login_Header;

// bg-[url(/assets/login-bg.jpg)] bg-cover bg-bottom bg-no-repeat
