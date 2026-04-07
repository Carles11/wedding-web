"use client";

import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import type { MarketingTranslations } from "@/4-shared/types";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function MarketingHeader({ translations, lang }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { user } = useSupabaseAuth();

  const router = useRouter();
  const pathname = usePathname();
  const langPrefix = `/${lang}`;
  const signUpRef = user ? `/${lang}/builder` : `/${lang}/auth/signup`;
  const logInRef = user ? `/${lang}/builder` : `/${lang}/auth/login`;

  const handleLanguageChange = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* LOGO */}
        <Link
          href={langPrefix}
          className="flex items-center gap-1 font-serif text-xl md:text-2xl font-bold tracking-tight shrink-0"
        >
          WeddWeb<span className="text-emerald-600">.com</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href={`${langPrefix}/features/multilingual-wedding-website`}
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            {t(translations, "marketing.nav.features", "Multilingual")}
          </Link>
          <a
            href={`${langPrefix}/#pricing`}
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            {t(translations, "marketing.nav.pricing", "Pricing")}
          </a>
          <Link
            href={`${langPrefix}/faq`}
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            {t(translations, "marketing.nav.faq", "FAQ")}
          </Link>
        </nav>

        {/* ACTION ZONE */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* NATIVE LANGUAGE SELECTOR */}
          <div className="relative group">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
              className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 md:px-3 text-[11px] md:text-xs font-semibold text-slate-700 hover:border-emerald-200 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown
                className={`w-3 h-3 opacity-40 transition-transform ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-40 origin-top-right transition-all z-50 ${
                isLangOpen
                  ? "scale-100 opacity-100 visible"
                  : "scale-95 opacity-0 invisible lg:group-hover:scale-100 lg:group-hover:opacity-100 lg:group-hover:visible"
              }`}
            >
              <div className="rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-black/5">
                <div className="max-h-[60vh] overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        handleLanguageChange(l);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                        l === lang
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "hover:bg-gray-50 text-slate-600"
                      }`}
                    >
                      {
                        SUPPORTED_LANGUAGE_LABELS[
                          l as keyof typeof SUPPORTED_LANGUAGE_LABELS
                        ]
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIGNUP - Hidden on mobile to avoid overflow */}
          <Link
            href={logInRef}
            className="text-md font-medium text-emerald-600"
          >
            {t(translations, "marketing.nav.login", "Log in")}
          </Link>
          <Link
            href={signUpRef}
            className="hidden sm:block rounded-full bg-emerald-600 px-4 py-2 text-xs md:text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            {t(translations, "pricing.cta", "Get Started")}
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 shadow-xl animate-in slide-in-from-top-2 z-40">
          <nav className="flex flex-col gap-6">
            <Link
              href={`${langPrefix}/features/multilingual-wedding-website`}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900"
            >
              {t(translations, "marketing.nav.features", "Multilingual")}
            </Link>
            <a
              href={`${langPrefix}/#pricing`}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900"
            >
              {t(translations, "marketing.nav.pricing", "Pricing")}
            </a>
            <Link
              href={`${langPrefix}/faq`}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900"
            >
              {t(translations, "marketing.nav.faq", "FAQ")}
            </Link>
            <hr className="border-gray-100" />
            <Link
              href={logInRef}
              className="text-md font-medium text-emerald-600"
            >
              {t(translations, "marketing.nav.login", "Log in")}
            </Link>
            <Link
              href={signUpRef}
              className="w-full text-center rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/10"
            >
              {t(translations, "pricing.cta", "Get Started")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
