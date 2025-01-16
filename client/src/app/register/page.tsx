"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { setUserState } from "@/store/features/userSlice";
import { LOGOUT_USER, REGISTER_USER } from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const handleFormState = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const logOut = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${LOGOUT_USER}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      dispatch(setUserState(null));
    } catch (error) {
      console.log("Error: ", error);
      alert("Error");
    }
  };

  useEffect(() => {
    logOut();
  }, []);

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, "IN");
    return phoneNumberObj?.isValid();
  };

  const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, phone, password, confirm_password, role } = formData;
    if (!name || !email || !phone || !password || !confirm_password || !role) {
      alert("Fill all the fields");
      return;
    }

    if (password !== confirm_password) {
      alert("Passwords not matched");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert("Invalid phone number");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/${REGISTER_USER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirm_password,
          role,
        }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      router.push(LOGIN);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <div className="p-5 w-[300px] bg-cardBackground bg-opacity-90 rounded-md shadow-md">
        <form
          action="POST"
          onSubmit={(e) => handleFormData(e)}
          className="space-y-5"
        >
          <div className="flex items-start flex-col">
            <label htmlFor="name">
              Name <span className="text-red-600">*</span>
            </label>
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
            <label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
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
            <label htmlFor="phone">
              Phone Number <span className="text-red-600">*</span>
            </label>
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
            <label htmlFor="password">
              Password <span className="text-red-600">*</span>
            </label>
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
            <label htmlFor="cpassword">
              Confirm Password <span className="text-red-600">*</span>
            </label>
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

          <select
            name="role"
            id="role"
            className="p-2 outline-none border-[1px] border-black rounded-md"
            required
            onChange={(e) => handleFormState(e)}
          >
            <option value="">Select your role</option>
            <option value="Manager">Manager</option>
            <option value="Farmer">Farmer</option>
          </select>

          <button type="submit" className="btn bg-black text-white">
            Register
          </button>
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
