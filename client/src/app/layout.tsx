"use client";

import ReduxProvider from "@/store/redux-provider";
import { useEffect } from "react";
import { Nunito } from "next/font/google";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import "../styles/style.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then(() => {
        console.log("Service Worker Registered");
      });
    }
  }, []);

  return (
    <ReduxProvider>
      <html lang="en">
        <body className={`${nunito.className} antialiased bg-customGreen bg-opacity-10`}>{children}</body>
      </html>
    </ReduxProvider>
  );
}
