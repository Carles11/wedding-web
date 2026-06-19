import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";

// All section components for Cookie Policy Page

type SectionProps = {
  translations: MarketingTranslations;
};

export function CookieWhatSection({ translations }: SectionProps) {
  return (
    <section id="what" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.what_are_cookies.title",
          "1. What Are Cookies?",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.what_are_cookies.desc",
          "Cookies are small text files stored on your device. They allow us to recognize your session, secure your payments, and analyze platform performance to improve our technical SEO and AI search features.",
        )}
      </p>
    </section>
  );
}

export function CookieTypesSection({ translations }: SectionProps) {
  const cookies = [
    {
      key: "essential",
      title: "marketing.legal.cookie.types.essential",
      desc: "marketing.legal.cookie.types.essential_desc",
      defaultLabel: "Essential Cookies",
      defaultDesc:
        "Required for authentication (Supabase) and secure payment processing (Stripe). The service cannot function without these.",
      color: "var(--marketing-color-primary)",
    },
    {
      key: "analytics",
      title: "marketing.legal.cookie.types.analytics",
      desc: "marketing.legal.cookie.types.analytics_desc",
      defaultLabel: "Analytical Cookies",
      defaultDesc:
        "Provided by Google Analytics 4 (GA4). These help us understand how you use the builder and which features are most valuable.",
      color: "var(--marketing-color-accent)",
    },
    {
      key: "preference",
      title: "marketing.legal.cookie.types.preference",
      desc: "marketing.legal.cookie.types.preference_desc",
      defaultLabel: "Preference Cookies",
      defaultDesc:
        "Used to remember your UI settings, such as your preferred language (English, Catalan, Spanish, etc.).",
      color: "#6366f1",
    },
  ];
  return (
    <section
      id="types"
      className="mb-16 scroll-mt-24 border-t border-black/5 dark:border-white/10 pt-12"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.types.title",
          "2. Specific Cookies We Use",
        )}
      </Heading>
      <div className="grid gap-6">
        {cookies.map((cookie) => (
          <div
            key={cookie.key}
            className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 shadow-sm flex gap-5"
          >
            <div
              className="w-2 h-auto rounded-full"
              style={{ background: cookie.color }}
            />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t(translations, cookie.title, cookie.defaultLabel)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(translations, cookie.desc, cookie.defaultDesc)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CookieUsageSection({ translations }: SectionProps) {
  return (
    <section id="usage" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.usage.title",
          "3. Our Usage Policy",
        )}
      </Heading>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        {t(
          translations,
          "marketing.legal.cookie.usage.current",
          "We use cookies to maintain your session via Supabase, process payments via Stripe, and track platform growth via Google Analytics. We prioritize your privacy: analytical cookies are only activated if you provide explicit consent through our cookie banner.",
        )}
      </p>
    </section>
  );
}

export function CookieManageSection({ translations }: SectionProps) {
  return (
    <section id="manage" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.manage.title",
          "4. Managing Your Preferences",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.manage.current",
          "You can withdraw your consent for analytical cookies at any time via the settings icon on the bottom of the screen. Essential cookies required for security and account access cannot be disabled through our settings but can be blocked via your browser (which may break the site).",
        )}
      </p>
    </section>
  );
}

export function CookieThirdPartySection({ translations }: SectionProps) {
  return (
    <section id="third-party" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.third_party.title",
          "5. Third-Party Cookies",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.third_party.current",
          "We use Google Analytics (Google LLC) and Stripe (Stripe, Inc.) for analytics and payment security. These third parties may set cookies according to their own privacy policies. We do not use third-party advertising or tracking cookies for marketing purposes.",
        )}
      </p>
    </section>
  );
}

export function CookieUpdatesSection({ translations }: SectionProps) {
  return (
    <section id="updates" className="mb-16 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.updates.title",
          "6. Policy Updates",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.updates.desc",
          "As we introduce new features or localized search engine improvements, our use of cookies may evolve. Significant changes will be posted here.",
        )}
      </p>
    </section>
  );
}

export function CookieContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-24 pt-10 border-t border-black/5 dark:border-white/10"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.cookie.contact.title",
          "7. Cookie Inquiries",
        )}
      </Heading>
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20">
        <p className="text-gray-700 dark:text-gray-300 pb-4">
          {t(
            translations,
            "marketing.legal.cookie.contact.desc",
            "For specific questions regarding our use of cookies and how we process GA4 identifiers, please contact:",
          )}
        </p>
        <a
          href="mailto:carles@rio-frances.com"
          className="marketing-btn marketing-btn-primary marketing-btn-md w-full sm:w-auto"
        >
          carles@rio-frances.com
        </a>
      </div>
    </section>
  );
}
