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

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [flagEmail, setFlagEmail] = useState(false);
  const [flagPhone, setFlagPhone] = useState(false);

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

  const sendOtpEmail = async () => {
    if (!formData.email) {
      alert("Email field is empty");
      return;
    }

    setFlagEmail(true);

    try {
      const res = await fetch(`${BASE_URL}/${SEND_OTP_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      setIsEmailOtpSent(true);
      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    setFlagEmail(false);
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) {
      alert("Enter your OTP");
      return;
    }

    setFlagEmail(true);

    try {
      const res = await fetch(`${BASE_URL}/${VERIFY_OTP_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp: emailOtp }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        const error = new Error(data.error);
        throw error;
      }

      setIsEmailVerified(true);
      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    setEmailOtp("");
    setIsEmailOtpSent(false);
    setFlagEmail(false);
  };

  const sendOtpPhone = async () => {
    if (!formData.phone) {
      alert("Phone number field is empty");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      alert("Invalid phone number");
      return;
    }

    setFlagPhone(true);

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

      setIsPhoneOtpSent(true);
      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    setFlagPhone(false);
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp) {
      alert("Enter your OTP");
      return;
    }

    setFlagPhone(true);

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

      setIsPhoneVerified(true);
      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    setPhoneOtp("");
    setIsPhoneOtpSent(false);
    setFlagPhone(false);
  };

  const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, phone, password, confirm_password } = formData;
    if (!name || !email || !phone || !password || !confirm_password) {
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

    if(!isEmailVerified){
      alert("Verify your email");
      return;
    }

    if(!isPhoneVerified){
      alert("Verify your phone");
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

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <CustomLoadingBar ref={loadingBarRef} />

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
              value={formData.name}
              required
              onChange={(e) => handleFormState(e)}
            />
          </div>

          <div className="flex items-start flex-col">
            <label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="flex justify-between border-b-2 border-black">
              {!isEmailOtpSent ? (
                <>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="outline-none pt-2 w-[73%]"
                    placeholder="John@xyz.com"
                    value={formData.email}
                    required
                    onChange={(e) => handleFormState(e)}
                  />
                  {!isEmailVerified ? (
                    <button
                      onClick={() => sendOtpEmail()}
                      className="px-[5px] bg-blue-200 text-[12px] rounded-md"
                    >
                      {!flagEmail ? "Send Otp" : "sending..."}
                    </button>
                  ) : (
                    <div>Verified</div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="number"
                    id="otpEmail"
                    name="otpEmail"
                    className="outline-none pt-2 w-[73%]"
                    placeholder="Enter your otp"
                    value={emailOtp}
                    required
                    onChange={(e) => setEmailOtp(e.target.value)}
                  />
                  <button
                    onClick={() => verifyEmailOtp()}
                    className="px-[5px] bg-blue-200 text-[12px] rounded-md"
                  >
                    {!flagEmail ? "Verify Otp" : "verifying..."}
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="phone">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <div className="flex justify-between border-b-2 border-black">
              {!isPhoneOtpSent ? (
                <>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="outline-none pt-2 w-[73%]"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    required
                    onChange={(e) => handleFormState(e)}
                  />
                  {!isPhoneVerified ? (
                    <button
                      onClick={() => sendOtpPhone()}
                      className="px-[5px] bg-blue-200 text-[12px] rounded-md"
                    >
                      {!flagPhone ? "Send Otp" : "sending..."}
                    </button>
                  ) : (
                    <div>Verified</div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="number"
                    id="otpPhone"
                    name="otpPhone"
                    className="outline-none pt-2 w-[73%]"
                    placeholder="Enter your otp"
                    value={phoneOtp}
                    required
                    onChange={(e) => setPhoneOtp(e.target.value)}
                  />
                  <button
                    onClick={() => verifyPhoneOtp()}
                    className="px-[5px] bg-blue-200 text-[12px] rounded-md"
                  >
                    {!flagPhone ? "Verify Otp" : "verifying..."}
                  </button>
                </>
              )}
            </div>
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
                value={formData.password}
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
                value={formData.confirm_password}
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
