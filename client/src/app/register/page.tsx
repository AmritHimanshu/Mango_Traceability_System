"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { setUserState } from "@/store/features/userSlice";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import {
  LOGOUT_USER,
  REGISTER_USER,
  SEND_OTP_EMAIL,
  SEND_OTP_PHONE,
  VERIFY_OTP_EMAIL,
  VERIFY_OTP_PHONE,
} from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [isOtp, setIsOtp] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [flagPhone, setFlagPhone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormState = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    let new_pass = e.target.value;

    let lowerCase = /[a-z]/g;
    let upperCase = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let specialCharacter = /[-'/`~!@#$%^&*(){}[\]|;:",.<>?\\]/g;

    if (!new_pass) {
      setErrorMessage("");
      setIsPasswordVerified(false);
      return;
    }

    if (!new_pass.match(lowerCase)) {
      setErrorMessage("Password must contains lowercase");
      setIsPasswordVerified(false);
      return;
    } else if (!new_pass.match(upperCase)) {
      setErrorMessage("Password must contains uppercase");
      setIsPasswordVerified(false);
      return;
    } else if (!new_pass.match(numbers)) {
      setErrorMessage("Password must contains numbers");
      setIsPasswordVerified(false);
      return;
    } else if (!new_pass.match(specialCharacter)) {
      setErrorMessage("Password must contains special character");
      setIsPasswordVerified(false);
      return;
    } else if (new_pass.length < 8) {
      setErrorMessage("Password must be at least 8 character long");
      setIsPasswordVerified(false);
      return;
    } else {
      setIsPasswordVerified(true);
      setErrorMessage("");
    }
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

    const welcomeShown = localStorage.getItem("welcomeShown");

    if (welcomeShown) {
      localStorage.clear();
    }
  }, []);

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, "IN");
    return phoneNumberObj?.isValid();
  };


  const handleFormData = async () => {
    const { name, email, phone, password, confirm_password } = formData;
    if (!name || !email || !phone || !password || !confirm_password) {
      alert("Fill all the fields");
      return;
    }

    if (!isPasswordVerified) {
      alert("Password is weak");
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

    if (!isOTPVerified) {
      alert("OTP is not verified!");
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
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

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const verifyOtp = async () => {
    if (!phoneOtp) {
      alert("Enter your OTP");
      return;
    }

    setFlagPhone(true);

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${VERIFY_OTP_PHONE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone, otp: phoneOtp }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      setIsOTPVerified(true);
      alert(data.message);
      handleFormData();
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    setPhoneOtp("");
    setFlagPhone(false);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const sendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, phone, password, confirm_password } = formData;
    if (!name || !email || !phone || !password || !confirm_password) {
      alert("Fill all the fields");
      return;
    }

    if (!isPasswordVerified) {
      alert("Password is weak");
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

    if (!formData.phone) {
      alert("Phone number field is empty");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      alert("Invalid phone number");
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${SEND_OTP_PHONE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      setIsOtp(true);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };


  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <CustomLoadingBar ref={loadingBarRef} />

      <div className="p-5 w-[330px] md:w-[400px] lg:w-[500px] bg-cardBackground rounded-sm shadow-md">
        {!isOtp ? (
          <>
            <div className="mb-3 text-center">Registration</div>

            <form
              action="POST"
              onSubmit={(e) => sendOTP(e)}
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
                  value={formData.name}
                  required
                  onChange={(e) => handleFormState(e)}
                />
              </div>

              <div className="flex items-start flex-col">
                <label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="flex justify-between border-b-2 border-black w-full">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="outline-none pt-2 w-[73%] bg-transparent"
                    placeholder="John@xyz.com"
                    value={formData.email}
                    required
                    onChange={(e) => handleFormState(e)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="flex justify-between border-b-2 border-black">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="outline-none pt-2 w-[73%] bg-transparent"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    required
                    onChange={(e) => handleFormState(e)}
                  />
                </div>
              </div>

              <div className="flex items-start flex-col">
                <label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="flex justify-between input-tag">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="outline-none w-full bg-transparent"
                    placeholder="Enter your password"
                    value={formData.password}
                    required
                    onChange={(e) => {
                      handleFormState(e);
                      handlePasswordCheck(e);
                    }}
                  />
                </div>
                {errorMessage && (
                  <div className="text-red-500 text-[12px]">{errorMessage}</div>
                )}
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
                    value={formData.confirm_password}
                    required
                    onChange={(e) => handleFormState(e)}
                  />
                  {isVisibleConfirmPassword ? (
                    <VisibilityIcon
                      className="cursor-pointer"
                      onClick={() =>
                        setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                      }
                    />
                  ) : (
                    <VisibilityOffIcon
                      className="cursor-pointer"
                      onClick={() =>
                        setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                      }
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white duration-200"
              >
                Register
              </button>
            </form>

            <div className="w-[100%] mt-5">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-600 hover:underline">Sign in.</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div
                className="text-end cursor-pointer"
                onClick={() => setIsOtp(false)}
              >
                X
              </div>

              <hr />

              <div className="w-[90%]">
                Enter the One Time Password (OTP) sent to your mobile
              </div>

              <input
                type="text"
                className="border-[1px] border-black w-full p-2 outline-0"
                placeholder="Enter OTP"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
              />
              <div className="space-x-3 text-end text-[14px]">
                <button
                  className="py-1 px-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 duration-200"
                  // onClick={(e) => sendOTP}
                >
                  RESEND OTP
                </button>

                {flagPhone ? (
                  <button className="py-1 px-2 bg-green-600 bg-opacity-70 text-white rounded-sm">
                    Verifying
                  </button>
                ) : (
                  <button
                    className="py-1 px-2 bg-green-600 text-white rounded-sm hover:bg-green-700 duration-200"
                    onClick={verifyOtp}
                  >
                    VERIFY
                  </button>
                ) }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default page;
