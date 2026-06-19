import { COOKIE_CONSENT_VERSION } from "@/4-shared/config/consents/versions";
import {
  CookieContactSection,
  CookieManageSection,
  CookieThirdPartySection,
  CookieTypesSection,
  CookieUpdatesSection,
  CookieUsageSection,
  CookieWhatSection,
} from "./sections/cookie";

import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function CookiePolicyPage({ translations, lang }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--marketing-bg-gradient)" }}
    >
      {/* Hero Header */}
      <header className="py-12 px-4 text-center border-b border-black/5 dark:border-white/10">
        <div className="inline-block mb-4 text-teal-600 dark:text-teal-400 animate-bounce">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1-2 0Z" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="11" r="1" fill="currentColor" />
            <circle cx="16" cy="15" r="1" fill="currentColor" />
          </svg>
        </div>
        <Heading
          as="h1"
          className="font-display text-4xl md:text-6xl mb-6"
          style={{ color: "var(--marketing-color-on-gradient-text)" }}
        >
          {t(translations, "marketing.legal.cookie.title", "Cookie Policy")}
        </Heading>
        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
          {t(
            translations,
            "marketing.legal.cookie.version",
            "Last updated on ",
          )}{" "}
          {COOKIE_CONSENT_VERSION}
        </div>
        <p className="max-w-2xl mx-auto text-lg opacity-70 font-plus-jakarta leading-relaxed">
          {t(
            translations,
            "marketing.legal.cookie.intro",
            "This policy explains how WeddWeb uses cookies and similar technologies to improve your experience.",
          )}
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16">
        {/* Sticky Table of Contents could be refactored to use the same section titles if needed */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-4">
              {t(
                translations,
                "marketing.legal.cookie.navigation",
                "Navigation",
              )}
            </p>
            <a
              href="#what"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.what.title",
                "What Are Cookies?",
              )}
            </a>
            <a
              href="#types"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.types.title",
                "Types We Use",
              )}
            </a>
            <a
              href="#usage"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.usage.title",
                "How We Use Them",
              )}
            </a>
            <a
              href="#manage"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.manage.title",
                "Managing Preferences",
              )}
            </a>
            <a
              href="#third-party"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.third_party.title",
                "Third-Party Services",
              )}
            </a>
            <a
              href="#updates"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.updates.title",
                "Updates",
              )}
            </a>
            <a
              href="#contact"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.cookie.contact.title",
                "Contact",
              )}
            </a>
          </nav>
        </aside>

        {/* Legal Content */}
        <main className="flex-1 max-w-2xl font-plus-jakarta">
          <CookieWhatSection translations={translations} />
          <CookieTypesSection translations={translations} />
          <CookieUsageSection translations={translations} />
          <CookieManageSection translations={translations} />
          <CookieThirdPartySection translations={translations} />
          <CookieUpdatesSection translations={translations} />
          <CookieContactSection translations={translations} />
        </main>
      </div>
    </div>
  );
}
