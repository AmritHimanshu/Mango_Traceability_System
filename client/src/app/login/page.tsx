"use client";

import React, { useState } from "react";
import Link from "next/link";
import mango_bg from "../../../public/mango_bg.jpg";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="flex items-center justify-center h-[calc(100vh-56px)]"
      style={{ backgroundImage: `url(${mango_bg.src})` }}
    >
      <div className="p-5 w-[300px] bg-white bg-opacity-90 rounded-md">
        <form action="" className="space-y-10">
          <div className="flex items-start flex-col">
            <label htmlFor="id">Your ID <span className="text-red-600">*</span></label>
            <input
              type="text"
              id="id"
              name="id"
              value={email}
              className="input-tag"
              placeholder="2034567"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="password">Password <span className="text-red-600">*</span></label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisiblePassword ? "text" : "password"}`}
                id="password"
                name="password"
                value={password}
                className="outline-none w-full bg-transparent"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
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

          <select name="role" id="role" className="p-2 outline-none border-[1px] border-black rounded-md">
            <option value="">Select your role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Farmer">Farmer</option>
          </select>
          <button className="btn">Login</button>
        </form>

        <div className="w-[100%] mt-5">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="text-green-600 font-bold">Sign up.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
