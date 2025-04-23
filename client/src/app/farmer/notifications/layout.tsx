"use client";

import SocketInitializer from "@/utils/Services/SocketInitializer";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <SocketInitializer />
      {children}
    </div>
  );
}
