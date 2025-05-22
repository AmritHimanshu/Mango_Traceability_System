"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUserState } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import { LOGOUT_USER, SIGNIN_USER } from "@/utils/Apis/api";
import { FORGOT_PASSWORD, REGISTER } from "@/utils/Paths/paths";
import Message from "../components/common/Message";
import ReCAPTCHA from "react-google-recaptcha";
import useRecaptcha from "@/utils/Services/useRecaptcha";
import CustomCaptcha from "@/utils/Services/cutomCaptcha/CustomCaptcha";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const userState = useAppSelector((state) => state.user.userState);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

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
        setMessage({ text: `${data.error}`, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      dispatch(setUserState(null));
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  useEffect(() => {
    if (userState) {
      logOut();
    }

    const welcomeShown = localStorage.getItem("welcomeShown");

    if (welcomeShown) {
      localStorage.clear();
    }
  }, []);

  const handleFormData = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setMessage({ text: "", type: "" });

    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) return;

    if (!capchaToken) {
      setMessage({ text: "Complete the captcha.", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${SIGNIN_USER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          capchaToken,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        setMessage({ text: data.error, type: "error" });
        handleRecaptcha("");
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        const error = new Error(data.error);
        throw error;
      }

      recaptchaRef.current?.reset();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      dispatch(setUserState(data));
      router.push("/");
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
      <div className="p-2 xl:p-5 w-full flex items-center justify-center">
        <CustomLoadingBar ref={loadingBarRef} />

        {message.text && message.type && (
          <Message text={message.text} type={message.type} />
        )}

        <div className="rounded-md overflow-hidden w-[400px] md:w-[500px] m-auto h-[500px] flex shadow-xl">
          <div className="bg-white bg-opacity-50 backdrop-blur-md text-black flex-grow flex items-center">
            <div className="px-5 py-3 w-full m-auto space-y-5">
              <div className="mt-2 text-xl text-center font-bold">Login</div>
              <div className="space-y-2">
                <label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-tag"
                />
                {emailError && (
                  <p className="text-red-600 text-sm">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-tag"
                />
                {passwordError && (
                  <p className="text-red-600 text-sm">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={`${RECAPTCHA_SITE_KEY}`}
                  onChange={handleRecaptcha}
                />

                {/* <CustomCaptcha /> */}
              </div>

              <div className="text-center">
                <button
                  className="custom-btn bg-customGreen"
                  onClick={(e) => handleFormData(e)}
                >
                  Login
                </button>
              </div>

              <div className="flex text-[10px] md:text-[13px] mt-3">
                <div className="w-[100%] text-start">
                  Forgot password?{" "}
                  <Link href={FORGOT_PASSWORD}>
                    <span className="text-blue-800 hover:underline">
                      click here
                    </span>
                  </Link>
                </div>

                <div className="w-[100%] text-end">
                  Don't have an account?{" "}
                  <Link href={REGISTER}>
                    <span className="text-blue-800 hover:underline">
                      Sign up.
                    </span>
                  </Link>
                </div>
              </div>

              <div className="text-center text-[7px] md:text-[10px] xl:text-[12px]">
                <div>&#169; 2025 C-DAC Patna. All rights reserved.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
