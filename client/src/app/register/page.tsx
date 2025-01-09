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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const handleFormState = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="flex items-center justify-center h-[calc(100vh-56px)]"
      style={{ backgroundImage: `url(${mango_bg.src})` }}
    >
      <div className="p-5 w-[300px] bg-white bg-opacity-90 rounded-md">
        <form action="" className="space-y-5">
          <div className="flex items-start flex-col">
            <label htmlFor="name">Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-tag"
              placeholder="John Doe"
              required
              onChange={(e) => handleFormState(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="email">Email <span className="text-red-600">*</span></label>
            <input
              type="text"
              id="email"
              name="email"
              className="input-tag"
              placeholder="John@xyz.com"
              required
              onChange={(e) => handleFormState(e)}
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number <span className="text-red-600">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="input-tag"
              placeholder="+91 9876543210"
              required
              onChange={(e) => handleFormState(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="password">Password <span className="text-red-600">*</span></label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisiblePassword ? "text" : "password"}`}
                id="password"
                name="password"
                className="outline-none w-full bg-transparent"
                placeholder="Enter your password"
                required
                onChange={(e) => handleFormState(e)}
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
            <label htmlFor="cpassword">Confirm Password <span className="text-red-600">*</span></label>
            <div className="flex justify-between input-tag">
              <input
                type={`${isVisibleConfirmPassword ? "text" : "password"}`}
                id="cpassword"
                name="confirm_password"
                className="outline-none w-full bg-transparent"
                placeholder="Confirm your password"
                required
                onChange={(e) => handleFormState(e)}
              />
              {isVisibleConfirmPassword ? (
                <VisibilityIcon
                  onClick={() =>
                    setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                  }
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() =>
                    setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                  }
                />
              )}
            </div>
          </div>

          <select name="role" id="role" className="p-2 outline-none border-[1px] border-black rounded-md" onChange={(e)=>handleFormState(e)}>
            <option value="">Select your role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Farmer">Farmer</option>
          </select>

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
