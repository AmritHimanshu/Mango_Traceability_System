"use client";

import React from "react";
import { usePathname } from "next/navigation";

function page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const pathname = usePathname();
  const id = pathname.split("/").pop();

  return (
    <div>
      <div>This is farmer id</div>
    </div>
  );
}

export default page;
