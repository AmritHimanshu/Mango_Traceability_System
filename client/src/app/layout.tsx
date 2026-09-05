"use client";

import ReduxProvider from "@/store/redux-provider";
import { useEffect } from "react";
import { Nunito } from "next/font/google";
import SocketInitializer from "@/utils/Services/SocketInitializer";
// CSS is handled by Next.js; it has no TypeScript module declaration.
// @ts-expect-error -- intentional side-effect import for global styles
import "mdb-react-ui-kit/dist/css/mdb.min.css";
// CSS is handled by Next.js; it has no TypeScript module declaration.
// @ts-expect-error -- intentional side-effect import for global styles
import "@fortawesome/fontawesome-free/css/all.min.css";
// CSS is handled by Next.js; it has no TypeScript module declaration.
// @ts-expect-error -- intentional side-effect import for global styles
import "./globals.css";
// CSS is handled by Next.js; it has no TypeScript module declaration.
// @ts-expect-error -- intentional side-effect import for global styles
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
    // <ReduxProvider>
    <html lang="en">
      <body className={`${nunito.className} antialiased bg-white`}>
        {/* <SocketInitializer />
          {children} */}
        <ReduxProvider>
          <SocketInitializer />
          {children}
        </ReduxProvider>
      </body>
    </html>
    // </ReduxProvider>
  );
}
