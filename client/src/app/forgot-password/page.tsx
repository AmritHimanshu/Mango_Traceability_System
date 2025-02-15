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
      alert("Enter your email");
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
        const error = new Error(data.error);
        throw error;
      }

      alert(data.message);
      setIsOtpVerified(true);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const changePassword = async () => {
    if (!password || !confirm_password) {
      return alert("Fill all the fields");
    }

    if (password !== confirm_password) {
      return alert("Passwords not matched");
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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="p-5 w-[330px] md:w-[400px] lg:w-[500px] border-[1px] rounded-sm shadow-md">
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
