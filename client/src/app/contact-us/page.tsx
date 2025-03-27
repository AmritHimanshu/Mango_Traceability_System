"use client";

import React, { useRef, useState } from "react";
import Banner from "../components/common/Banner";
import CustomLoadingBar from "../components/common/loadingBar/CustomLoadingBar";
import { LoadingBarRef } from "react-top-loading-bar";
import Message from "../components/common/Message";
import Footer from "../components/common/Footer";
import { CONTACT_US_MAIL } from "@/utils/Apis/api";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const sendMail = async () => {
    const { name, email, phone, message } = userInfo;

    if (!name || !email || !phone || !message) {
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
      const res = await fetch(`${BASE_URL}/${CONTACT_US_MAIL}`, {
        method: "POSt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (res.status !== 201) {
        setMessage({ text: data.error, type: "error" });
        const error = new Error(data.error);
        throw error;
      }

      setMessage({ text: data.message, type: "success" });
    } catch (error) {}
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 2000);

    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <Banner
        img_src="/assets/plant.jpg"
        img_alt="Plant"
        heading="Contact us"
        description="Got any questions? Let us know how we can help."
      />

      <div className="my-5 max-w-[90%] m-auto text-black space-y-5">
        <div className="md:flex justify-between space-y-10 md:space-y-0">
          <div className="md:w-[48%]">
            <div className="text-center font-bold">Email Us</div>
            <div className="px-2 py-3 w-full m-auto space-y-5">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  required
                  onChange={(e) => handleOnChange(e)}
                  className="input-tag"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  required
                  onChange={(e) => handleOnChange(e)}
                  className="input-tag"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  required
                  onChange={(e) => handleOnChange(e)}
                  className="input-tag"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  value={userInfo.message}
                  required
                  onChange={(e) => handleOnChange(e)}
                  rows={5}
                  cols={35}
                  className="input-tag resize-none"
                />
              </div>

              <div className="text-center">
                <button
                  className="custom-btn bg-customGreen"
                  onClick={sendMail}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-[48%] space-y-20">
            <div className="text-center font-bold">Connect</div>
            <div className="flex justify-center space-x-10 mt-10">
              <img
                src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_instagram-256.png"
                alt=""
                className="w-[50px] cursor-pointer"
              />
              <img
                src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/facebook-256.png"
                alt=""
                className="w-[50px] cursor-pointer"
              />
              <img
                src="https://cdn2.iconfinder.com/data/icons/threads-by-instagram/24/x-logo-twitter-new-brand-64.png"
                alt=""
                className="w-[50px] cursor-pointer"
              />
            </div>
            <div className="space-y-3">
              <div>About us</div>
              <div className="text-xs md:text-lg lg:text-xl text-gray-800">
                we are dedicated to deliver fresh and natural mangoes which are
                grown chemical residue free to your door step. We provide all
                variety of mangoes to our customers.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default page;
