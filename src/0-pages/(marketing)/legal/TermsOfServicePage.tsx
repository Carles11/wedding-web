import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import {
  TermsAccountSection,
  TermsChangesSection,
  TermsContactSection,
  TermsContentSection,
  TermsDisclaimerSection,
  TermsProhibitedSection,
  TermsTerminationSection,
  TermsUserContentSection,
  TermsUseSection,
} from "./sections/terms";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function TermsOfServicePage({ translations, lang }: Props) {
  // Sections are now modular components

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--marketing-bg-gradient)" }}
    >
      {/* Hero Header */}
      <header className="py-12 px-4 text-center border-b border-black/5">
        <Heading
          as="h1"
          className="font-display text-4xl md:text-6xl mb-6"
          style={{ color: "var(--marketing-color-on-gradient-text)" }}
        >
          {t(translations, "marketing.legal.terms.title", "Terms of Service")}
        </Heading>
        <p className="max-w-2xl mx-auto opacity-70 text-lg font-plus-jakarta">
          {t(
            translations,
            "marketing.legal.terms.intro",
            "These Terms of Service govern your use of the WeddWeb platform.",
          )}
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16">
        {/* Desktop Navigation */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-4">
              {t(
                translations,
                "marketing.legal.terms.navigation",
                "Table of Contents",
              )}
            </p>
            <a
              href="#use"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.use.title",
                "1. Use of Service",
              )}
            </a>
            <a
              href="#account"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.account.title",
                "2. Account Registration",
              )}
            </a>
            <a
              href="#content"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.content.title",
                "3. Content & Intellectual Property",
              )}
            </a>
            <a
              href="#user-content"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.user_content.title",
                "4. User Content",
              )}
            </a>
            <a
              href="#prohibited"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.prohibited.title",
                "5. Prohibited Conduct",
              )}
            </a>
            <a
              href="#termination"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.termination.title",
                "6. Termination",
              )}
            </a>
            <a
              href="#disclaimer"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.disclaimer.title",
                "7. Disclaimers & Liability",
              )}
            </a>
            <a
              href="#changes"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.changes.title",
                "8. Changes to Terms",
              )}
            </a>
            <a
              href="#contact"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.terms.contact.title",
                "9. Contact",
              )}
            </a>
          </nav>
        </aside>

        {/* Legal Content */}
        <main className="flex-1 max-w-2xl">
          <TermsUseSection translations={translations} />
          <TermsAccountSection translations={translations} />
          <TermsContentSection translations={translations} />
          <TermsUserContentSection translations={translations} />
          <TermsProhibitedSection translations={translations} />
          <TermsTerminationSection translations={translations} />
          <TermsDisclaimerSection translations={translations} />
          <TermsChangesSection translations={translations} />
          <TermsContactSection translations={translations} />
        </main>
      </div>
    </div>
  );
}
