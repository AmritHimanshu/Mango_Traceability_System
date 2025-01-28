"use client";

import React, { useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import { FORGOT_SEND_OTP_EMAIL, VERIFY_OTP_EMAIL } from "@/utils/Apis/api";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(true);

  const sendOtpToEmail = async () => {
    if (!email) {
      alert("Enter your email");
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
        const error = new Error(data.error);
        throw error;
      }

      setIsEmailOtpSent(true);
      alert(data.message);
    } catch (error) {
      console.log("Error: ", error);
      alert(error);
      setIsEmailOtpSent(false);
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const verifyOtpToEmail = async () => {
    if (!otp) {
      alert("Enter your email");
      return;
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
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
      <CustomLoadingBar ref={loadingBarRef} />

      {!isEmailOtpSent && !isOtpVerified && (
        <div className="mb-10 text-[18px]">Reset your Password</div>
      )}

      {isEmailOtpSent && !isOtpVerified && (
        <div className="mb-10 text-[18px]">OTP Verification</div>
      )}

      {isEmailOtpSent && isOtpVerified && (
        <div className="mb-10 text-[18px]">Enter new password</div>
      )}

      <div className="p-5 w-[300px] bg-cardBackground bg-opacity-90 rounded-md shadow-md">
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
              className="btn bg-green-600 text-white"
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
              className="btn bg-green-600 text-white"
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
              onClick={() => verifyOtpToEmail()}
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
