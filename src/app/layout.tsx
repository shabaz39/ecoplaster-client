import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingProvider";
import client from "@/lib/apolloClient";
import ApolloWrapper from "@/components/ApolloWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/HomepageComponents/Navbar";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "../providers";
import { WishlistProvider } from "@/context/WishlistContext";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ApolloWrapper>
              <LoadingProvider>
              <WishlistProvider>
                {children}
                </WishlistProvider>
              </LoadingProvider>
            </ApolloWrapper>
          </CartProvider>
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </body>
    </html>
  );
}