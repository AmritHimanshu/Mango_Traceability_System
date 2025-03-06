"use client";

import ReduxProvider from "@/store/redux-provider";
import { useEffect } from "react";
import { Roboto } from "next/font/google";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import "../styles/style.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
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
        <body className={`${roboto.className} antialiased`}>{children}</body>
      </html>
    </ReduxProvider>
  );
}
