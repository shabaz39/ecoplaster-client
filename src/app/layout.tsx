import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ApolloProvider from "@/components/ApolloProvider";  // Import the new provider
import LoadingProvider from "@/components/LoadingProvider"; 

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
        <ApolloProvider>
          <LoadingProvider>{children}</LoadingProvider> {/* Wrap children */}
        </ApolloProvider>
      </body>
    </html>
  );
}
