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

      <div className="my-3 w-full lg:max-w-[70%] xl:max-w-[70%] m-auto p-2 space-y-10 text-black">
        <div className="text-center border-b-[1px] border-black p-2 font-semibold">
          {currentDate.toDateString()}
        </div>

        <div className="space-y-10">
          {notifications.length > 0 ? (
            notifications[0].farmAlerts?.map((notification, index) => (
              <div key={index} className="bg-white p-3 shadow-lg space-y-5">
                <div className="space-y-10">
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

                  <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                    <div className="space-y-5 w-full md:w-[50%]">
                      <div className="flex items-center space-x-2">
                        {notification.currentAlert.weather === "clouds" ? (
                          <CloudIcon sx={{ color: "gray", fontSize: "50px" }} />
                        ) : notification.currentAlert.weather ===
                          "thunderstorm" ? (
                          <ThunderstormIcon
                            sx={{ color: "gray", fontSize: "50px" }}
                          />
                        ) : notification.currentAlert.weather === "rain" ? (
                          <ThunderstormIcon
                            sx={{ color: "gray", fontSize: "50px" }}
                          />
                        ) : (
                          <WbSunnyOutlinedIcon
                            sx={{ color: "orange", fontSize: "50px" }}
                          />
                        )}

                        <div>
                          <span className="text-[20px] md:text-[30px] xl:text-[40px]">
                            {notification.currentAlert.temperature}&deg;
                          </span>
                          <span>C</span>
                        </div>
                      </div>
                      <div className="text-18px]">
                        Condition:{" "}
                        <span className="capitalize">
                          {notification.currentAlert.weather}
                        </span>
                      </div>
                    </div>

                    <div className="w-full md:w-[50%]">
                      <div className="flex justify-between py-2 border-b-[1px]">
                        <span>Wind</span>
                        <span>{notification.currentAlert.wind}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b-[1px]">
                        <span>Humidity</span>
                        <span>{notification.currentAlert.humidity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 text-sm">
                  {Object.entries(notification.forecastAlert).map(
                    ([date, weatherData], index) => (
                      <div
                        key={index}
                        className="space-y-3 bg-customGreen bg-opacity-35 p-2"
                      >
                        <div className="text-center text-black">{date}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <div>
                              {weatherData.weather === "clouds" ? (
                                <CloudIcon
                                  sx={{ color: "white", fontSize: "20px" }}
                                />
                              ) : weatherData.weather === "thunderstorm" ? (
                                <ThunderstormIcon
                                  sx={{ color: "gray", fontSize: "20px" }}
                                />
                              ) : weatherData.weather === "rain" ? (
                                <ThunderstormIcon
                                  sx={{ color: "gray", fontSize: "20px" }}
                                />
                              ) : (
                                <WbSunnyOutlinedIcon
                                  sx={{ color: "orange", fontSize: "20px" }}
                                />
                              )}
                            </div>
                            <div>
                              <span>{weatherData.temperature}&deg;</span>
                              <span>{" "}c</span>
                            </div>
                          </div>
                          <div className="capitalize">
                            {weatherData.weather}
                          </div>
                        </div>
                      </div>
                    )
                  )}
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
