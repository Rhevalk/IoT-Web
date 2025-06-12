/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/layout/alert";

export const metadata: Metadata = {
  title: "CIN Farm",
  description: "Selamat datang di CIN Farm",
  icons: {
    icon: "/cin.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts alternatif untuk Geist */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Fira+Code&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-geist-sans: 'Inter', sans-serif;
            --font-geist-mono: 'Fira Code', monospace;
          }
        `}</style>
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
