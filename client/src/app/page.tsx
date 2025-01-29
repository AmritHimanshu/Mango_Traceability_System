"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/utils/Paths/paths";
import AdminHome from "./components/admin/Home";
import FarmerHome from "./components/farmer/Home";
import "../styles/style.css";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const userState = useAppSelector((state) => state.user.userState);

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!userState) return router.push(LOGIN);

    const welcomeShown = localStorage.getItem("welcomeShown");

    if (!welcomeShown) {
      setShowWelcome(true);
      localStorage.setItem("welcomeShown", "true");

      const timeId = setTimeout(() => {
        setShowWelcome(false);
        console.log("Inside timer");
      }, 3000);

      console.log("Outside timer");

      return () => {
        clearTimeout(timeId);
      };
    }
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {userState && showWelcome && (
        <div className="text-center p-2 bg-yellow-300 text-black font-bold shadow-md">
          Welcome {userState.name}!
        </div>
      )}
      {userState?.role === "Admin" && <AdminHome />}
      {userState?.role === "Farmer" && <FarmerHome />}
    </div>
  );
}
