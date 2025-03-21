"use client";

import React from 'react';
import Image from "next/image";

function Login_Header() {
  return (
    <div className='sticky w-full top-0 z-[9999] bg-white transition-all duration-300 flex items-center justify-between'>
      <div className='py-3 px-5'>
        <Image src="/assets/cdac-logo.png" alt="Logo" width={50} height={50} className='bg-white p-1 rounded-sm'/>
      </div>
      <div className='font-bold text-customOrange'>Making Maldha Aam Accessible to every Indian</div>
      <div className='py-3 px-5'></div>
    </div>
  )
}

export default Login_Header

// bg-[url(/assets/login-bg.jpg)] bg-cover bg-bottom bg-no-repeat