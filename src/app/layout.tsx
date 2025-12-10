import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  // You can specify site-wide default metadata here, will be overridden by page-specific metadata if set
  title: "Wedding Event Website",
  description:
    "Multilingual SaaS wedding & event platform — fully SSR & SEO optimized",
  // Other global meta options can go here, but page-specific will take priority!
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For now, lang is statically set to "es", will make dynamic in a future step!
  return (
    <html lang="es" className="bg-white text-neutral-900 font-sans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
