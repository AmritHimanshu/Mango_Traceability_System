"use client";

import React, { useState } from 'react';

function Header_Menu() {

    const [user, setUser] = useState(false);

    return (
        <div className='h-[calc(100vh-56px)]'>
            {!user ? (
                <div>
                    <div>Login</div>
                    <div>Register</div>
                </div>
                ) : (
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
        </div>
    )
}

export default Header_Menu
