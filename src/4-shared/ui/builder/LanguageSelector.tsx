"use client";
import { LANGUAGES_SELECTOR as LANGUAGES } from "@/4-shared/config/i18n";
import { LanguageSelectorProps } from "@/4-shared/types";
import Link from "next/link"; // Add this
import React from "react";

/**
 * LanguageSelector - simple, accessible language dropdown for marketing header
 */

export default function LanguageSelector({
  currentLang,
  label,
  onLanguageChange,
  preferencesTab,
}: LanguageSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value);
  };

  return (
    <div className="inline-flex items-center gap-3">
      {/* SEO/AI CRAWLER MAP: Hidden links so bots find all 11 languages */}
      <nav className="sr-only" aria-hidden="true">
        {LANGUAGES.map((lng) => (
          <Link key={lng.code} href={`/${lng.code}`}>
            {lng.name}
          </Link>
        ))}
      </nav>

      <div className="relative inline-block">
        <select
          id="marketing-lang-select"
          value={currentLang}
          onChange={handleChange}
          aria-label={label ?? "Select language"}
          className={`appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6ABDA6] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-[#6ABDA6] ${
            preferencesTab ? "w-full" : "w-auto"
          }`}
        >
          {LANGUAGES.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.nativeName} — {lng.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500">
          ▾
        </span>
      </div>
    </div>
  );
}
