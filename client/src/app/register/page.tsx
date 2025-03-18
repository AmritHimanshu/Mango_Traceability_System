"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { setUserState } from "@/store/features/userSlice";
import { LoadingBarRef } from "react-top-loading-bar";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import {
  LOGOUT_USER,
  REGISTER_USER,
  SEND_OTP_EMAIL,
  SEND_OTP_EMAIL_WITHOUTCAPTCHA,
  SEND_OTP_PHONE,
  SEND_OTP_PHONE_WITHOUTCAPTCHA,
  VERIFY_OTP_EMAIL,
  VERIFY_OTP_PHONE,
} from "@/utils/Apis/api";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "../components/common/Message";
import ReCAPTCHA from "react-google-recaptcha";
import useRecaptcha from "@/utils/Services/useRecaptcha";

// Material UI Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [flagPhone, setFlagPhone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

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

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, "IN");
    return phoneNumberObj?.isValid();
  };

  const handleFormData = async () => {
    const { name, email, phone, password, confirm_password } = formData;

    if (!isOTPVerified) {
      setMessage({ text: "OTP is not verified!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
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
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      router.push(LOGIN);
    } catch (error) {}

    setIsOtp(false);

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const verifyOtp = async () => {
    if (!phoneOtp) {
      setMessage({ text: "Enter your OTP", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    setFlagPhone(true);

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      const res = await fetch(`${BASE_URL}/${VERIFY_OTP_EMAIL}`, {
      // const res = await fetch(`${BASE_URL}/${VERIFY_OTP_PHONE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp: phoneOtp }),
        // body: JSON.stringify({ phone: formData.phone, otp: phoneOtp }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setIsOTPVerified(true);
      setMessage({ text: data.message, type: "success" });
    } catch (error) {}

    setPhoneOtp("");
    setFlagPhone(false);

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    if (isOTPVerified) handleFormData();
  }, [isOTPVerified]);

  const reSendOTP = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      // const res = await fetch(`${BASE_URL}/${SEND_OTP_PHONE_WITHOUTCAPTCHA}`, {
      const res = await fetch(`${BASE_URL}/${SEND_OTP_EMAIL_WITHOUTCAPTCHA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ phone: formData.phone }),
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
      setIsOtp(true);
    } catch (error) {}

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  const sendOTP = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    const { name, email, phone, password, confirm_password } = formData;

    if (!name || !email || !phone || !password || !confirm_password) {
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
      setMessage({ text: "Passwords not matched!", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setMessage({ text: "Invalid phone number", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (!formData.phone) {
      setMessage({ text: "Phone number field is empty", type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 2000);
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setMessage({ text: "Invalide phone number", type: "error" });
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
      // const res = await fetch(`${BASE_URL}/${SEND_OTP_PHONE}`, {
      const res = await fetch(`${BASE_URL}/${SEND_OTP_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, capchaToken }),
        // body: JSON.stringify({ phone: formData.phone, capchaToken }),
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

      setMessage({ text: data.message, type: "success" });
      setIsOtp(true);
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
      <div className="p-2 xl:p-5 w-full h-[100vh] overflow-y-auto relative bg-gradient-to-tr from-customOrange to-customGreen flex items-center justify-center">
        <CustomLoadingBar ref={loadingBarRef} />

        {message.text && message.type && (
          <Message text={message.text} type={message.type} />
        )}

        <div className={`rounded-md overflow-hidden w-[1200px] m-auto ${!isOtp ? "h-[800px]" : "h-[500px]"} flex shadow-xl`}>
          <div className="w-[50%] hidden lg:block relative h-full">
            <Image
              src="/assets/registration_image.jpg"
              alt=""
              fill
              className="object-fill"
            />
          </div>

          <div className="bg-white text-black flex-grow flex items-center overflow-y-auto">
            {!isOtp ? (
              <>
                <div className="p-3 w-full lg:w-[400px] m-auto space-y-5">
                  <div className="mt-2 text-xl text-center">Registration</div>
                  <div className="space-y-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      required
                      onChange={(e) => handleFormState(e)}
                      className="input-tag"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      required
                      onChange={(e) => handleFormState(e)}
                      className="input-tag"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      required
                      onChange={(e) => handleFormState(e)}
                      className="input-tag"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      required
                      onChange={(e) => {
                        handleFormState(e);
                        handlePasswordCheck(e);
                      }}
                      className="input-tag"
                    />
                    {errorMessage && (
                      <div className="text-yellow-300 text-[12px] text-start">
                        {errorMessage}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <div className="flex items-center justify-between space-x-2 input-tag">
                      <input
                        type={`${
                          isVisibleConfirmPassword ? "text" : "password"
                        }`}
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        required
                        onChange={(e) => handleFormState(e)}
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

                  <div className="flex items-center justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={`${RECAPTCHA_SITE_KEY}`}
                      onChange={handleRecaptcha}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      className="!w-[100px] text-sm lg:text-lg py-[5px] lg:py-[7px] bg-customGreen text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
                      onClick={(e) => sendOTP(e)}
                    >
                      Register
                    </button>
                  </div>

                  <div className="w-[100%] my-3 text-[11px] md:text-[15px] text-center">
                    Already have an account?{" "}
                    <Link href="/login">
                      <span className="text-blue-600 hover:underline">
                        Sign in.
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 w-full lg:w-[400px] m-auto space-y-5">
                  <div className="mb-3 text-sm">
                    Enter the One Time Password (OTP) sent to your email
                  </div>
                  <hr />
                  <div className="space-y-2">
                    <label htmlFor="name">Enter OTP</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={phoneOtp}
                      required
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="input-tag"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      className="!w-[150px] text-sm lg:text-lg py-[5px] lg:py-[7px] bg-[#6b7280] text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
                      onClick={() => reSendOTP()}
                    >
                      RESEND OTP
                    </button>

                    {!flagPhone ? (
                      <button
                        className="!w-[100px] text-sm lg:text-lg py-[5px] lg:py-[7px] bg-customGreen text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
                        onClick={() => verifyOtp()}
                      >
                        VERIFY
                      </button>
                    ) : (
                      <button
                        className="!w-[150px] text-sm lg:text-lg py-[5px] lg:py-[7px] bg-customGreen text-white font-bold rounded-md hover:shadow-md hover:bg-opacity-95 duration-200"
                        disabled
                      >
                        VERIFYING...
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
