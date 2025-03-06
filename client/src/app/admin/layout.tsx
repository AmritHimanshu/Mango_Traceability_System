"use client";

import { useEffect, useState } from "react";
import { isMobile } from "@/utils/IsMobile/isMobile";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isFooter, setIsFooter] = useState(false);

  useEffect(() => {
    if (isMobile()) {
      setIsFooter(false);
    } else setIsFooter(true);
  }, []);

  return (
    <div>
      <Header />
      <div className="flex">{children}</div>
      {isFooter && <Footer />}
    </div>
  );
}
