"use client";

import React, { useEffect, useRef, useState } from "react";
import { LoadingBarRef } from "react-top-loading-bar";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import CustomLoadingBar from "@/app/components/common/loadingBar/CustomLoadingBar";
import { LOGIN } from "@/utils/Paths/paths";
import Message from "@/app/components/common/Message";
import { notification } from "@/utils/Types/interfaces";
import socket from "@/utils/Services/socket";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const userState = useAppSelector((state) => state.user.userState);
  const userId = userState?.uniqueID;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const router = useRouter();

  const [notifications, setNotifications] = useState<notification[]>([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const currentDate = new Date();

  useEffect(() => {
    if (!userState) {
      router.push(LOGIN);
    }
  }, []);

  useEffect(() => {
    const handleWeatherNotification = (data: notification) => {
      setNotifications([data]);
    };

    if (userState && userId) {
      socket.emit("identify_for_weather_report", userId);

      socket.on("weather_notification", handleWeatherNotification);
    }

    return () => {
      socket.emit("stop_weather_notification", userId);
      socket.off("weather_notification", handleWeatherNotification);
    };
  }, [userState, userId]);

  return (
    <div className="page-main-div">
      <CustomLoadingBar ref={loadingBarRef} />

      {message.text && message.type && (
        <Message text={message.text} type={message.type} />
      )}

      <div className="my-3 max-w-[50%] m-auto p-2 space-y-10 text-black">
        <div className="text-center border-b-[1px] border-black p-2 font-semibold">
          {currentDate.toDateString()}
        </div>

        <div className="space-y-10">
          {notifications.length > 0 ? (
            notifications[0].farmAlerts?.map((notification, index) => (
              <div key={index} className="bg-white p-3 space-y-10 shadow-lg">
                <div className="flex items-center justify-between py-2 border-b-[1px] border-black">
                  <div>Current Weather</div>
                  <div className="font-semibold">{notification.block}</div>
                  <div>
                    {currentDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>

                <div className="flex">
                  <div className="space-y-5 w-[50%]">
                    <div className="flex items-center space-x-2">
                      {notification.alerts.weather === "clouds" ? (
                        <CloudIcon sx={{ color: "gray", fontSize: "50px" }} />
                      ) : notification.alerts.weather === "thunderstorm" ? (
                        <ThunderstormIcon
                          sx={{ color: "gray", fontSize: "50px" }}
                        />
                      ) : notification.alerts.weather === "rain" ? (
                        <ThunderstormIcon
                          sx={{ color: "gray", fontSize: "50px" }}
                        />
                      ) : (
                        <WbSunnyOutlinedIcon
                          sx={{ color: "orange", fontSize: "50px" }}
                        />
                      )}

                      <div>
                        <span className="text-[40px]">
                          {notification.alerts.temperature}&deg;
                        </span>
                        <span>C</span>
                      </div>
                    </div>
                    <div className="text-18px]">
                      Condition:{" "}
                      <span className="capitalize">
                        {notification.alerts.weather}
                      </span>
                    </div>
                  </div>

                  <div className="w-[50%]">
                    <div className="flex justify-between py-2 border-b-[1px]">
                      <span>Wind</span>
                      <span>{notification.alerts.wind}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b-[1px]">
                      <span>Humidity</span>
                      <span>{notification.alerts.humidity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center my-10 text-gray-700">
              Fetching weather reports...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
