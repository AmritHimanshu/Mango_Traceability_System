"use client";

import React, { useState } from 'react';
import Link from 'next/link';

function Header_Menu() {

    const [user, setUser] = useState(false);

    return (
        <div className='h-[calc(100vh-56px)] p-[20px] absolute w-full bg-[#f6fff6]'>
            {!user ? (
                <div className='space-y-3'>
                    <div className='py-3 w-full border-b-[1px] border-black font-bold'>
                        <Link href="/login">Login</Link>
                    </div>
                    <div className='py-3 border-b-[1px] border-black font-bold'>
                        <Link href="/register">Register</Link>
                    </div>
                </div>
            ) : (
                <div className='space-y-3'>
                    <div className='py-3 border-b-[1px] border-black font-bold'>
                        <Link href="/">Home</Link>
                        </div>
                    <div className='py-3 border-b-[1px] border-black font-bold'>
                        <Link href="/about">About</Link>
                        </div>
                    <div className='py-3 border-b-[1px] border-black font-bold'>
                        <Link href="/contact">Contact</Link>
                        </div>
                    <div className='py-3 border-b-[1px] border-black font-bold'>
                        <Link href="/logout">Logout</Link>
                        </div>
                </div>
            )}
        </div>
    )
}

export default Header_Menu
