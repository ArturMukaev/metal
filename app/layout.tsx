import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Металлообработка и изготовление металлических изделий | СТИЛКРАФТ',
    template: '%s | СТИЛКРАФТ',
  },
  description:
    'Профессиональная металлообработка в Перми. Токарные, фрезерные, зуборезные работы. Изготовление деталей по чертежам. Компания СТИЛКРАФТ - создавая надежность.',
  keywords: [
    'металлообработка',
    'токарные работы',
    'фрезерные работы',
    'изготовление деталей',
    'шестерни на заказ',
    'Пермь',
    'СТИЛКРАФТ',
  ],
  authors: [{ name: 'СТИЛКРАФТ' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'СТИЛКРАФТ',
    title: 'Металлообработка и изготовление металлических изделий | СТИЛКРАФТ',
    description:
      'Профессиональная металлообработка в Перми. Токарные, фрезерные, зуборезные работы.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'СТИЛКРАФТ - Металлообработка',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Добавьте коды верификации при необходимости
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  },
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
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

