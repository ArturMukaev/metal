import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import YMetrika from "@/components/yandexMetrika";
import { GoogleAnalytics } from "@/components/googleAnalytics";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default:
      "Металлообработка и изготовление металлических изделий | СТИЛКРАФТ",
    template: "%s | СТИЛКРАФТ",
  },
  description:
    "Профессиональная металлообработка в Перми. Токарные, фрезерные, зуборезные работы. Изготовление деталей по чертежам. Компания СТИЛКРАФТ - создавая надежность.",
  keywords: [
    "металлообработка",
    "токарные работы",
    "фрезерные работы",
    "изготовление деталей",
    "шестерни на заказ",
    "Пермь",
    "СТИЛКРАФТ",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  authors: [{ name: "СТИЛКРАФТ" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "СТИЛКРАФТ",
    title: "Металлообработка и изготовление металлических изделий | СТИЛКРАФТ",
    description:
      "Профессиональная металлообработка в Перми. Токарные, фрезерные, зуборезные работы.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "СТИЛКРАФТ - Металлообработка",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "yandex-verification": "05e39d4c55c11bb4",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Suspense>
          <YMetrika />
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
