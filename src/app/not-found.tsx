"use client";

import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { i18n404 } from "@/4-shared/config/seo/i18n404";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./globals.css";

export default function RootNotFound() {
  const pathname = usePathname();
  const segments = pathname?.split("/") || [];
  const langCandidate = segments[1] as SupportedLanguage;
  const lang = SUPPORTED_LANGUAGES.includes(langCandidate)
    ? langCandidate
    : "en";

  const dict = i18n404[lang as keyof typeof i18n404] || i18n404.en;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 antialiased">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 select-none">
          <span className="text-9xl font-bold text-gray-200">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{dict.title}</h1>

        <p className="text-gray-600 mb-8">{dict.desc}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-semibold transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: "#6ABDA6" }}
          >
            {dict.home}
          </Link>
          <Link
            href={`/${lang}/faq`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {dict.faq}
          </Link>
        </div>
      </div>
    </main>
  );
}
