import Footer from "@/components/Footer";
import Navbar from "@/components/Header/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import Script from "next/script";
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
  title: "Muscle Denz",
  description:
    "Fuel your gains with Muscle Denz — your go-to hub for high-protein recipes, clean eating tips, and meal plans designed to boost energy, burn fat, and build lean muscle.",
  icons: {
    icon: "/logo/md-logo.png",
    shortcut: "/logo/md-logo.png",
    apple: "/logo/md-logo.png",
  },
  alternates: {
    canonical: "https://muscledenz.com",
  },
  openGraph: {
    title: "Muscle Denz",
    description:
      "Fuel your gains with Muscle Denz — your go-to hub for high-protein recipes, clean eating tips, and meal plans designed to boost energy, burn fat, and build lean muscle.",
    url: "https://muscle-denz.vercel.app/",
    siteName: "Muscle Denz",
    images: [
      {
        url: "/logo/md-logo.png",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muscle Denz",
    description:
      "Fuel your gains with Muscle Denz — your go-to hub for high-protein recipes, clean eating tips, and meal plans designed to boost energy, burn fat, and build lean muscle.",
    images: "/logo/md-logo.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#008ED6",
  other: {
    keywords:
      "nutrition, meal plans, fitness, healthy recipes, lean muscle, Muscle Denz",
  },
};

function SearchBarFallback() {
  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      Loading...
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-91M59524XN"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-91M59524XN');
          `}
        </Script>
      </head>
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
