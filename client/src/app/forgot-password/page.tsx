"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import {
  FORGOT_SEND_OTP_EMAIL,
  UPDATE_PASSWORD,
  VERIFY_OTP_EMAIL,
} from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "../components/common/Message";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
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
    <>
      <div className="p-2 xl:p-5 w-full h-[100vh] overflow-y-auto relative bg-[url(/assets/login-bg.jpg)] bg-cover bg-bottom bg-no-repeat flex items-center justify-center">
        <CustomLoadingBar ref={loadingBarRef} />

        {message.text && message.type && (
          <Message text={message.text} type={message.type} />
        )}

        <div className="rounded-md overflow-hidden w-[500px] m-auto flex shadow-xl">

          <div className="bg-white bg-opacity-50 backdrop-blur-md text-black flex-grow flex items-center">
            <div className="px-5 py-3 w-full m-auto space-y-5">
              {!isEmailOtpSent && !isOtpVerified && (
                <div className="mt-2 text-xl text-center">
                  Reset your Password
                </div>
              )}

              {isEmailOtpSent && !isOtpVerified && (
                <div className="mt-2 text-xl text-center">OTP Verification</div>
              )}

              {isEmailOtpSent && isOtpVerified && (
                <div className="mt-2 text-xl text-center">
                  Enter new password
                </div>
              )}

              {!isEmailOtpSent && !isOtpVerified && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-tag"
                    />
                  </div>

                  <div>
                    <button
                      className="custom-btn bg-customGreen"
                      onClick={() => sendOtpToEmail()}
                    >
                      Verify Email
                    </button>
                  </div>
                </>
              )}

              {isEmailOtpSent && !isOtpVerified && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      required
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-tag"
                    />
                  </div>

                  <div>
                    <button
                      className="custom-btn bg-customGreen"
                      onClick={() => verifyOtpToEmail()}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}

              {isEmailOtpSent && isOtpVerified && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        handlePasswordCheck(e);
                      }}
                      className="input-tag"
                    />
                  </div>
                  {errorMessage && (
                    <div className="text-red-600 text-[12px]">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="cpassword">Confirm your password</label>
                    <div className="flex items-center justify-between space-x-2 input-tag">
                      <input
                        type={`${
                          isVisibleConfirmPassword ? "text" : "password"
                        }`}
                        id="cpassword"
                        name="confirm_password"
                        value={confirm_password}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="outline-0"
                      />
                      {isVisibleConfirmPassword ? (
                        <VisibilityIcon
                          className="cursor-pointer"
                          onClick={() =>
                            setIsVisibleConfirmPassword(
                              !isVisibleConfirmPassword
                            )
                          }
                        />
                      ) : (
                        <VisibilityOffIcon
                          className="cursor-pointer"
                          onClick={() =>
                            setIsVisibleConfirmPassword(
                              !isVisibleConfirmPassword
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      className="custom-btn bg-customGreen"
                      onClick={() => changePassword()}
                    >
                      Change password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
