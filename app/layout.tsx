import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Auth App - Next.js",
  description: "Complete authentication system with TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
