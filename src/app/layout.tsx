import Footer from "@/components/Footer";
import Navbar from "@/components/Header/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react'
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

function SearchBarFallback() {
  return <div className="flex justify-center items-center w-full h-[90vh]">Loading...</div>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<SearchBarFallback />}>
          <Navbar />
        </Suspense>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Footer />
      </body>

    </html>
  );
}
