"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setUserState } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/store";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import { LOGOUT_USER, SIGNIN_USER } from "@/utils/Apis/api";
import { FORGOT_PASSWORD, REGISTER } from "@/utils/Paths/paths";
import Message from "../components/common/Message";
import ReCAPTCHA from "react-google-recaptcha";
import useRecaptcha from "@/utils/Services/useRecaptcha";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

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
        const error = new Error(data.error);
        throw error;
      }

      dispatch(setUserState(null));
    } catch (error) {
      setMessage({ text: `${error}`, type: "error" });
    }

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);
  };

  useEffect(() => {
    logOut();

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

    if (!email || !password) {
      setMessage({ text: "Fill all the fields", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

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
      <div className="p-2 xl:p-5 w-full h-[100vh] overflow-y-auto relative">
        <CustomLoadingBar ref={loadingBarRef} />

        {message.text && message.type && (
          <Message text={message.text} type={message.type} />
        )}

        <div className="border-4 border-primarycColor rounded-md w-[calc(100%-10%)] m-auto h-full flex">
          <div className="w-[50%] hidden xl:block relative h-full">
            <Image
              src="/assets/login_image.jpg"
              alt=""
              fill
              className="object-fill"
            />
          </div>
          <div className="bg-primarycColor text-white flex-grow flex items-center">
            <div className="p-3 w-full xl:w-[400px] m-auto space-y-5">
              <div className="mt-2 text-xl text-center">Login</div>
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

              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-tag"
                />
              </div>

              <div className="flex items-center justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={`${RECAPTCHA_SITE_KEY}`}
                  onChange={handleRecaptcha}
                />
              </div>

              <div className="text-center">
                <button
                  className="!w-[130px] !text-[9px] md:!text-[12px] lg:!text-[16px] py-[3px] lg:py-[7px] bg-green-600 bg-opacity-80 text-white font-bold rounded-[5px] hover:shadow-md hover:bg-opacity-85 duration-200"
                  onClick={(e) => handleFormData(e)}
                >
                  Login
                </button>
              </div>

              <div className="flex text-[9px] md:text-[13px] my-5">
                <div className="w-[100%] text-start">
                  Forgot password?{" "}
                  <Link href={FORGOT_PASSWORD}>
                    <span className="text-yellow-400 hover:underline">
                      click here
                    </span>
                  </Link>
                </div>

                <div className="w-[100%] text-end">
                  Don't have an account?{" "}
                  <Link href={REGISTER}>
                    <span className="text-yellow-400 hover:underline">
                      Sign up.
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
