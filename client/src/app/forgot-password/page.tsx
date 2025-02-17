"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import {
  FORGOT_SEND_OTP_EMAIL,
  UPDATE_PASSWORD,
  VERIFY_OTP_EMAIL,
} from "@/utils/Apis/api";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "../components/common/Message";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const sendOtpToEmail = async () => {
    if (!email) {
      setMessage({ text: "Enter your email", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${FORGOT_SEND_OTP_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setIsEmailOtpSent(true);
      setMessage({ text: data.message, type: "success" });
    } catch (error) {
      setIsEmailOtpSent(false);
    }

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const verifyOtpToEmail = async () => {
    if (!otp) {
      setMessage({ text: "Enter otp", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${VERIFY_OTP_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, otp: otp }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      setIsOtpVerified(true);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
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

  const changePassword = async () => {
    if (!password || !confirm_password) {
      setMessage({ text: "Fill all the fields", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (!isPasswordVerified) {
      setMessage({ text: "Password is weak!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (password !== confirm_password) {
      setMessage({ text: "Passwords not matched", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${UPDATE_PASSWORD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirm_password }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      router.push(LOGIN);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-0px)] bg-[url('/assets/mangoBg.jpg')] bg-cover">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="p-5 w-[330px] md:w-[400px] lg:w-[500px] rounded-sm shadow-md bg-zinc-900 bg-opacity-95 text-white">
        {!isEmailOtpSent && !isOtpVerified && (
          <div className="mb-10 text-sm md:text-xl text-center">
            Reset your Password
          </div>
        )}

        {isEmailOtpSent && !isOtpVerified && (
          <div className="mb-10 text-sm md:text-xl text-center">
            OTP Verification
          </div>
        )}

        {isEmailOtpSent && isOtpVerified && (
          <div className="mb-10 text-sm md:text-xl text-center">
            Enter new password
          </div>
        )}

        {!isEmailOtpSent && !isOtpVerified && (
          <div className="flex items-start flex-col space-y-5">
            <label htmlFor="email">Enter your email:</label>
            <div className="flex justify-between input-tag">
              <input
                type="email"
                id="email"
                name="email"
                className="outline-none w-full bg-transparent"
                placeholder="John@xyz.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="btn bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white"
              onClick={() => sendOtpToEmail()}
            >
              Verify email
            </button>
          </div>
        )}

        {isEmailOtpSent && !isOtpVerified && (
          <div className="flex items-start flex-col space-y-5">
            <label htmlFor="otp">Enter otp:</label>
            <div className="flex justify-between input-tag">
              <input
                type="text"
                id="otp"
                name="otp"
                className="outline-none w-full bg-transparent"
                placeholder="enter your otp"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              className="btn bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white"
              onClick={() => verifyOtpToEmail()}
            >
              Submit
            </button>
          </div>
        )}

        {isEmailOtpSent && isOtpVerified && (
          <>
            <div className="flex items-start flex-col mb-5">
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
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handlePasswordCheck(e);
                  }}
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
              {errorMessage && (
                <div className="text-red-500 text-[12px]">{errorMessage}</div>
              )}
            </div>

            <div className="flex items-start flex-col mb-5">
              <label htmlFor="cpassword">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="flex justify-between input-tag">
                <input
                  type="password"
                  id="cpassword"
                  name="confirm_password"
                  className="outline-none w-full bg-transparent"
                  placeholder="Confirm your password"
                  value={confirm_password}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn bg-green-600 text-white"
              onClick={() => changePassword()}
            >
              Change password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default page;
