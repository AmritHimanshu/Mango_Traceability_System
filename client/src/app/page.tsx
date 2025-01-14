"use client"

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/utils/Paths/paths";
import AdminHome from './components/admin/Home';
import FarmerHome from './components/farmer/Home';
import "../styles/style.css";
import 'leaflet/dist/leaflet.css';

export default function Home() {

  const userState = useAppSelector((state) => state.user.userState);
  
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if(!userState) return router.push(LOGIN);
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {userState?.role === 'Admin' && <AdminHome />}
      {userState?.role === 'Farmer' && <FarmerHome />}
    </div>
  );
}