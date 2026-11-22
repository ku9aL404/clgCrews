import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusCrew — Your Campus. Your Tasks. Your People.",
  description: "A premium campus marketplace for student services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
