"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/store";
import { setUserState } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/store";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);

  const dispatch = useAppDispatch();

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Fill all the fields");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/signin-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        alert(data.error);
        return;
      }

      alert("Successfully signed in");

      dispatch(setUserState(data));

      console.log(data);
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <div className="p-5 w-[300px] bg-cardBackground bg-opacity-90 rounded-md shadow-md">
        <form
          action="POST"
          className="space-y-10"
          onSubmit={(e) => handleFormData(e)}
        >
          <div className="flex items-start flex-col">
            <label htmlFor="id">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="id"
              name="id"
              value={email}
              className="input-tag"
              placeholder="example@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="password">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisiblePassword ? "text" : "password"}`}
                id="password"
                name="password"
                value={password}
                className="outline-none w-full bg-transparent"
                placeholder="Enter your password"
                required
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

          <select
            name="role"
            id="role"
            className="p-2 outline-none border-[1px] border-black rounded-md"
            required
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Farmer">Farmer</option>
          </select>

          <button type="submit" className="btn">
            Login
          </button>
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
