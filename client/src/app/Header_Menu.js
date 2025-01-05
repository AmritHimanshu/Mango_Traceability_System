"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'

function Header_Menu({onNavigationComplete}) {

    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(false);

    const handleOnClick = (e) => {
        const url = `/${e.target.innerText.toLowerCase()}`;
        router.push(url);
        onNavigationComplete();
    }

    return (
        <div className='h-[calc(100vh-56px)] p-[20px] absolute w-full bg-[#f6fff6]'>
            {!user ? (
                <div className='space-y-3'>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/login' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        Login
                    </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/register' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        Register
                    </div>
                </div>
            ) : (
                <div className='space-y-3'>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        Home
                    </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/about' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        About
                    </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/contact' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        Contact
                    </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/logout' ? "text-green-800" : "text-black"}`} onClick={(e) => handleOnClick(e)}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header_Menu
