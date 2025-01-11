"use client"

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import AdminHome from './components/admin/Home';

export default function Home() {

  const userState = useAppSelector((state) => state.user.userState);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div>
      {userState?.role === 'Admin' && <AdminHome />}
    </div>
  );
}