import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageToggle } from "@/2-features/language-toggle/ui/LanguageToggle";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding Event Website",
  description:
    "Multilingual SaaS wedding & event platform — fully SSR & SEO optimized",
  // ...other global meta if needed
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string }; // <- Next.js provides the lang segment as param
}) {
  // Use dynamic lang from the URL segment
  const lang = params.lang; // e.g. "es" or "ca"
  const availableLangs = ["es", "ca"];

  return (
    <html lang={lang} className="bg-white text-neutral-900 font-sans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full flex justify-end items-center p-4">
          <LanguageToggle activeLang={lang} availableLangs={availableLangs} />
        </header>
        {children}
      </body>
    </html>
  );
}
