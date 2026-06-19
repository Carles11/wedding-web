import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";

type SectionProps = {
  translations: MarketingTranslations;
  lang?: string;
};

export function PrivacyCollectSection({ translations, lang }: SectionProps) {
  return (
    <section id="collect" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.collect.title",
          "1. Information We Collect",
        )}
      </Heading>
      <div className="space-y-6">
        {[
          {
            label: "marketing.legal.privacy.collect.account",
            desc: "marketing.legal.privacy.collect.account_desc",
            defaultLabel: "Account & Profile Data",
            defaultDesc:
              "Name, email, and preferred language provided during registration via Supabase Auth.",
          },
          {
            label: "marketing.legal.privacy.collect.usage",
            desc: "marketing.legal.privacy.collect.usage_desc",
            defaultLabel: "Usage & Analytical Data",
            defaultDesc:
              "Interactions with our builder, feature usage, and conversion events tracked via Google Analytics 4 (GA4).",
          },
          {
            label: "marketing.legal.privacy.collect.payment",
            desc: "marketing.legal.privacy.collect.payment_desc",
            defaultLabel: "Transaction Data",
            defaultDesc:
              "Payment status and plan selection processed by Stripe. We do not store credit card details on our servers.",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-1 h-auto rounded-full bg-teal-200" />
            <div>
              <strong className="block text-gray-900 dark:text-gray-100 mb-1">
                {t(translations, item.label, item.defaultLabel)}
              </strong>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t(translations, item.desc, item.defaultDesc)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <div className="w-1 h-auto rounded-full bg-orange-200" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>
              {t(
                translations,
                "marketing.legal.privacy.collect.cookies",
                "Cookies & Identifiers:",
              )}
            </strong>{" "}
            {t(
              translations,
              "marketing.legal.privacy.collect.cookies_desc",
              "We use functional and analytical cookies. See our ",
            )}
            <a
              href={`/${lang?.toLowerCase() || "en"}/cookie-policy`}
              className="underline font-medium text-teal-600 dark:text-teal-400"
            >
              {t(
                translations,
                "marketing.legal.privacy.collect.cookies_link",
                "Cookie Policy",
              )}
            </a>{" "}
            {t(
              translations,
              "marketing.legal.privacy.collect.cookies_desc2",
              "for granular details.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export function PrivacyUseSection({ translations }: SectionProps) {
  return (
    <section
      id="use"
      className="mb-16 scroll-mt-24 p-8 rounded-3xl bg-white/40 dark:bg-gray-800/40 border border-white/80 dark:border-gray-700/80 shadow-sm"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.use.title",
          "2. How We Use Your Data",
        )}
      </Heading>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            key: "marketing.legal.privacy.use.improve",
            label: "Optimizing technical SEO and platform speed",
          },
          {
            key: "marketing.legal.privacy.use.communicate",
            label: "Sending transactional emails via Resend",
          },
          {
            key: "marketing.legal.privacy.use.legal",
            label: "Processing one-time payments via Stripe",
          },
          {
            key: "marketing.legal.privacy.use.security",
            label: "Preventing fraud and unauthorized access",
          },
        ].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            {t(translations, item.key, item.label)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PrivacySharingSection({ translations }: SectionProps) {
  return (
    <section id="sharing" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.sharing.title",
          "3. Third-Party Service Providers",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.sharing.desc",
          "We share limited data with essential partners: Supabase (Data Storage), Stripe (Payments), Resend (Emails), and Google (Analytics). These partners are GDPR compliant.",
        )}
      </p>
    </section>
  );
}

export function PrivacyTransfersSection({ translations }: SectionProps) {
  return (
    <section id="transfers" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.transfers.title",
          "4. International Data Transfers",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.transfers.desc",
          "As we use services like Google and Supabase, your data may be processed in the United States. We ensure Standard Contractual Clauses are in place to protect your information.",
        )}
      </p>
    </section>
  );
}

export function PrivacyRightsSection({ translations }: SectionProps) {
  return (
    <section
      id="rights"
      className="mb-16 scroll-mt-24 border-t border-black/5 dark:border-white/10 pt-12"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.rights.title",
          "5. Your Privacy Rights",
        )}
      </Heading>
      <div className="grid gap-3">
        {[
          {
            key: "marketing.legal.privacy.rights.access",
            label: "Right to access and export your data",
          },
          {
            key: "marketing.legal.privacy.rights.object",
            label: "Right to object to analytical tracking",
          },
          {
            key: "marketing.legal.privacy.rights.withdraw",
            label: "Right to delete your account and site",
          },
          {
            key: "marketing.legal.privacy.rights.contact",
            label: "Contact us to exercise these rights",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group p-4 rounded-xl transition-all hover:bg-white/80 border border-transparent hover:border-teal-100 flex items-center justify-between"
          >
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {t(translations, item.key, item.label)}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-500 dark:text-teal-400">
              →
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PrivacySecuritySection({ translations }: SectionProps) {
  return (
    <section id="security" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.security.title",
          "6. Data Security",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.security.desc",
          "We use industry-standard encryption (SSL/TLS) and secure database protocols provided by Supabase to protect your data at rest and in transit.",
        )}
      </p>
    </section>
  );
}

export function PrivacyRetentionSection({ translations }: SectionProps) {
  return (
    <section id="retention" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.retention.title",
          "7. Data Retention",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.retention.desc",
          "We retain your data as long as your account is active. Inactive free accounts and their associated sites may be archived or deleted after 6 months of inactivity.",
        )}
      </p>
    </section>
  );
}

export function PrivacyUpdatesSection({ translations }: SectionProps) {
  return (
    <section id="updates" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.updates.title",
          "8. Policy Updates",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.updates.desc",
          "We may update this policy to reflect changes in our tools (like new analytics features). Significant changes will be notified via email.",
        )}
      </p>
    </section>
  );
}

export function PrivacyContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-24 pt-12 border-t-2 border-teal-500/20 dark:border-teal-400/20"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.privacy.contact.title",
          "9. Privacy Contact",
        )}
      </Heading>
      <div className="p-8 rounded-3xl bg-teal-900 dark:bg-teal-950 text-white shadow-xl shadow-teal-900/10 dark:shadow-teal-950/30">
        <p className="mb-6 opacity-80 text-sm">
          {t(
            translations,
            "marketing.legal.privacy.contact.desc1",
            "For privacy-related requests (Data Access, Deletion, or GDPR inquiries), contact:",
          )}
        </p>
        <address className="not-italic space-y-1 font-plus-jakarta text-lg">
          <p className="font-bold text-teal-200">Carles del Río Francés</p>
          <p className="opacity-90">Elbestrasse 15</p>
          <p className="opacity-90">60329 Frankfurt am Main</p>
          <div className="pt-4 text-sm opacity-60">
            <p>Steuernummer: 013 861 02632</p>
            <p>Ust-Id. Nr.: DE275710941</p>
          </div>
          <div className="pt-6">
            <a
              href="mailto:carles@rio-frances.com"
              className="inline-block px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-teal-900 dark:text-teal-200 font-bold transition-transform hover:scale-105"
            >
              carles@rio-frances.com
            </a>
          </div>
        </address>
      </div>
    </section>
  );
}
