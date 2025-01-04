"use client";

import React, { useState } from "react";
import Link from "next/link";
import mango_bg from "../../../public/mango_bg.jpg";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

  return (
    <div
      className="flex items-center justify-center h-[100vh]"
      style={{ backgroundImage: `url(${mango_bg.src})` }}
    >
      <div className="p-5 w-[300px] bg-white bg-opacity-90 rounded-md">
        <form action="" className="space-y-5">
          <div className="flex items-start flex-col">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" className="input-tag" placeholder="John Doe" />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              className="input-tag"
              placeholder="John@xyz.com"
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" className="input-tag" placeholder="+91 9876543210" />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="password">Password</label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisiblePassword ? "text" : "password"}`}
                id="password"
                className="outline-none w-full bg-transparent"
                placeholder="Enter your password"
              />
              {isVisiblePassword ? (
                <VisibilityIcon
                  onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                />
              )}
            </div>
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="cpassword">Confirm Password</label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisibleConfirmPassword ? "text" : "password"}`}
                id="cpassword"
                className="outline-none w-full bg-transparent"
                placeholder="Confirm your password"
              />
              {isVisibleConfirmPassword ? (
                <VisibilityIcon
                  onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                />
              )}
            </div>
          </div>
          <button className="btn">Register</button>
        </form>

        <div className="w-[100%] mt-5">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-green-600 font-bold">Sign in.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
