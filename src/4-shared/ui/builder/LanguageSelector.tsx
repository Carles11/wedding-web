"use client";
import { LANGUAGES_SELECTOR as LANGUAGES } from "@/4-shared/config/i18n";
import React from "react";

/**
 * Props for LanguageSelector
 */
export interface LanguageSelectorProps {
  currentLang: string;
  label?: string;
  onLanguageChange: (lang: string) => void;
}

/**
 * LanguageSelector - simple, accessible language dropdown for marketing header
 */
export default function LanguageSelector({
  currentLang,
  label,
  onLanguageChange,
}: LanguageSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value);
  };

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-block">
        <select
          id="marketing-lang-select"
          value={currentLang}
          onChange={handleChange}
          aria-label={label ?? "Select language"}
          className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6ABDA6]"
        >
          {LANGUAGES.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.nativeName} — {lng.name}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
          ▾
        </span>
      </div>
    </div>
  );
}
