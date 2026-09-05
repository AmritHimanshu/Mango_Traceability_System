"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { ADMIN_OVERVIEW, FARMER_OVERVIEW, LOGIN } from "@/utils/Paths/paths";

export default function Home() {
  const userState = useAppSelector((state) => state.user.userState);

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!userState) return router.push(LOGIN);

    if (userState.role === "Admin") {
      return router.push(ADMIN_OVERVIEW);
    }

    if (userState.role === "Farmer") {
      return router.push(FARMER_OVERVIEW);
    }
  }, []);

  if (!isClient) return null;

  return <div></div>;
}
