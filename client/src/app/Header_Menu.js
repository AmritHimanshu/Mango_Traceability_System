"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Header_Menu() {

    const pathname = usePathname();

    const [user, setUser] = useState(false);

    return (
        <div className='h-[calc(100vh-56px)] p-[20px] absolute w-full bg-[#f6fff6]'>
            {!user ? (
                <div className='space-y-3'>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/login' ? "text-green-800" : "text-black"}`}>
                        <Link href="/login">Login</Link>
                    </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/register' ? "text-green-800" : "text-black"}`}>
                        <Link href="/register">Register</Link>
                    </div>
                </div>
            ) : (
                <div className='space-y-3'>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/' ? "text-green-800" : "text-black"}`}>
                        <Link href="/">Home</Link>
                        </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/about' ? "text-green-800" : "text-black"}`}>
                        <Link href="/about">About</Link>
                        </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/contact' ? "text-green-800" : "text-black"}`}>
                        <Link href="/contact">Contact</Link>
                        </div>
                    <div className={`py-3 w-full border-b-[1px] border-black font-bold ${pathname === '/logout' ? "text-green-800" : "text-black"}`}>
                        <Link href="/logout">Logout</Link>
                        </div>
                </div>
            )}
        </div>
    )
}

export default Header_Menu
