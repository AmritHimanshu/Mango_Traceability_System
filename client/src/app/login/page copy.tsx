"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUserState } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/store";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/loadingBar/CustomLoadingBar";
import { LOGOUT_USER, SIGNIN_USER } from "@/utils/Apis/api";
import { FORGOT_PASSWORD, REGISTER } from "@/utils/Paths/paths";
import Message from "../components/common/Message";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

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

  const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({ text: "Fill all the fields", type: "error" });
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
        }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      dispatch(setUserState(data));
      router.push("/");

      // setMessage({ text: "Successfully signed in", type: "success" });
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="log-reg-page-main-div bg-[url('/assets/mangoBg.jpg')] bg-cover" >
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="p-5 w-[330px] md:w-[400px] lg:w-[500px] rounded-sm shadow-md bg-zinc-900 bg-opacity-95 text-white">
        <div className="mb-3 text-center">Login</div>

        <form
          action="POST"
          className="space-y-10"
          onSubmit={(e) => handleFormData(e)}
        >
          <div className="flex items-start flex-col">
            <label htmlFor="id">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="id"
              name="id"
              value={email}
              className="input-tag bg-transparent"
              placeholder="example@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                className="outline-none w-full bg-transparent"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {isVisiblePassword ? (
                <VisibilityIcon
                  className="cursor-pointer"
                  onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                />
              ) : (
                <VisibilityOffIcon
                  className="cursor-pointer"
                  onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-green-600 bg-opacity-90 hover:bg-opacity-100 text-white duration-200"
          >
            Login
          </button>
        </form>

        <div className="flex text-[9px] md:text-[14px] lg:text-[16px]">
          <div className="w-[100%] mt-5 text-start">
            Forgot password?{" "}
            <Link href={FORGOT_PASSWORD}>
              <span className="text-blue-600 hover:underline">click here</span>
            </Link>
          </div>

          <div className="w-[100%] mt-5 text-end">
            Don't have an account?{" "}
            <Link href={REGISTER}>
              <span className="text-blue-600 hover:underline">Sign up.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
