import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LoadingProvider from "@/components/LoadingProvider"; // Import the client component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EcoPlaster",
  description: "EcoPlaster's eco-friendly ecommerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>{children}</LoadingProvider> {/* Wrap children */}
      </body>
    </html>
  );
}
