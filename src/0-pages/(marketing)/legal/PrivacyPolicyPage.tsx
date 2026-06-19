import { PRIVACY_POLICY_VERSION } from "@/4-shared/config/consents/versions";
import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import {
  PrivacyCollectSection,
  PrivacyContactSection,
  PrivacyRetentionSection,
  PrivacyRightsSection,
  PrivacySecuritySection,
  PrivacySharingSection,
  PrivacyTransfersSection,
  PrivacyUpdatesSection,
  PrivacyUseSection,
} from "./sections/privacy";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function PrivacyPolicyPage({ translations, lang }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--marketing-bg-gradient)" }}
    >
      {/* Hero Header */}
      <header className="py-12 px-4 text-center border-b border-black/5 dark:border-white/10">
        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
          {t(translations, "marketing.legal.privacy.badge", "Privacy First")}
        </div>
        <Heading
          as="h1"
          className="font-display text-4xl md:text-6xl pb-6"
          style={{ color: "var(--marketing-color-on-gradient-text)" }}
        >
          {t(translations, "marketing.legal.privacy.title", "Privacy Policy")}
        </Heading>
        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
          {t(
            translations,
            "marketing.legal.privacy.version",
            "Last updated on ",
          )}{" "}
          {PRIVACY_POLICY_VERSION}
        </div>
        <p className="max-w-2xl mx-auto text-lg opacity-70 font-plus-jakarta leading-relaxed">
          {t(
            translations,
            "marketing.legal.privacy.intro",
            "This policy describes how WeddWeb protects your personal information. We are committed to transparency and global compliance.",
          )}
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16">
        {/* Sticky Table of Contents */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-4">
              {t(
                translations,
                "marketing.legal.privacy.navigation",
                "Sections",
              )}
            </p>
            <a
              href="#collect"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.collect.title",
                "1. Information We Collect",
              )}
            </a>
            <a
              href="#use"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.use.title",
                "2. How We Use It",
              )}
            </a>
            <a
              href="#sharing"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.sharing.title",
                "3. Data Sharing",
              )}
            </a>
            <a
              href="#transfers"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.transfers.title",
                "4. International Transfers",
              )}
            </a>
            <a
              href="#rights"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.rights.title",
                "5. Your Rights",
              )}
            </a>
            <a
              href="#security"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.security.title",
                "6. Data Security",
              )}
            </a>
            <a
              href="#retention"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.retention.title",
                "7. Data Retention",
              )}
            </a>
            <a
              href="#updates"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.updates.title",
                "8. Policy Changes",
              )}
            </a>
            <a
              href="#contact"
              className="text-sm py-2 px-3 rounded-lg transition-all hover:bg-white/60 hover:translate-x-1"
              style={{ color: "var(--marketing-color-link)" }}
            >
              {t(
                translations,
                "marketing.legal.privacy.contact.title",
                "9. Contact",
              )}
            </a>
          </nav>
        </aside>

        {/* Legal Content */}
        <main className="flex-1 max-w-2xl">
          <PrivacyCollectSection translations={translations} lang={lang} />
          <PrivacyUseSection translations={translations} />
          <PrivacySharingSection translations={translations} />
          <PrivacyTransfersSection translations={translations} />
          <PrivacyRightsSection translations={translations} />
          <PrivacySecuritySection translations={translations} />
          <PrivacyRetentionSection translations={translations} />
          <PrivacyUpdatesSection translations={translations} />
          <PrivacyContactSection translations={translations} />
        </main>
      </div>
    </div>
  );
}
