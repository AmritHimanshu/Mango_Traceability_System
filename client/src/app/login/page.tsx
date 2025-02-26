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
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";

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
    <>
      <MDBContainer
        fluid
        className="d-flex flex-column justify-content-center align-items-center vh-100"
      >
        <CustomLoadingBar ref={loadingBarRef} />

        {message.text && message.type && (
          <Message text={message.text} type={message.type} />
        )}

        <div
          className="p-5 bg-image"
          style={{
            backgroundImage:
              "url(https://mdbootstrap.com/img/new/textures/full/171.jpg)",
            height: "300px",
            width: "100%",
          }}
        ></div>

        <MDBCard
          className="mx-5 mb-5 p-5 shadow-5 w-100"
          style={{
            marginTop: "-100px",
            maxWidth: "600px",
            background: "hsla(0, 0%, 100%, 0.8)",
            backdropFilter: "blur(30px)",
          }}
        >
          <MDBCardBody className="p-5 text-center">
            <h2 className="fw-bold mb-5">Sign In</h2>

            <MDBInput
              wrapperClass="mb-4"
              label="Email"
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <MDBBtn
              className="w-100 mb-4"
              size="sm"
              onClick={(e) => handleFormData(e)}
            >
              sign in
            </MDBBtn>

            <div className="flex text-[9px] md:text-[13px] lg:text-[16px">
              <div className="w-[100%] mt-5 text-start">
                Forgot password?{" "}
                <Link href={FORGOT_PASSWORD}>
                  <span className="text-blue-600 hover:underline">
                    click here
                  </span>
                </Link>
              </div>

              <div className="w-[100%] mt-5 text-end">
                Don't have an account?{" "}
                <Link href={REGISTER}>
                  <span className="text-blue-600 hover:underline">
                    Sign up.
                  </span>
                </Link>
              </div>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default page;
