import type { Metadata } from "next";
import "./globals.css";
// import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Next 16 Boilerplate",
  description: "Next 16 Boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {/* <SessionProvider>{children}</SessionProvider> */}
        {children}
      </body>
    </html>
  );
}
