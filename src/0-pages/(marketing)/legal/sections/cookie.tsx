import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";

// All section components for Cookie Policy Page

type SectionProps = {
  translations: MarketingTranslations;
};

export function CookieWhatSection({ translations }: SectionProps) {
  return (
    <section id="what" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-3xl mb-6">
        {t(
          translations,
          "marketing.legal.cookie.what_are_cookies.title",
          "1. What Are Cookies?",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.what_are_cookies.desc",
          "Cookies are small text files stored on your device by your browser when you visit websites. They help websites remember your preferences, enhance your experience, and provide analytics.",
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
      color: "var(--marketing-color-primary)",
    },
    {
      key: "analytics",
      title: "marketing.legal.cookie.types.analytics",
      desc: "marketing.legal.cookie.types.analytics_desc",
      color: "var(--marketing-color-accent)",
    },
    {
      key: "preference",
      title: "marketing.legal.cookie.types.preference",
      desc: "marketing.legal.cookie.types.preference_desc",
      color: "#6366f1",
    },
    {
      key: "third_party",
      title: "marketing.legal.cookie.types.third_party",
      desc: "marketing.legal.cookie.types.third_party_desc",
      color: "#94a3b8",
    },
  ];
  return (
    <section
      id="types"
      className="mb-16 scroll-mt-24 border-t border-black/5 pt-12"
    >
      <h2 className="font-display text-3xl mb-8">
        {t(
          translations,
          "marketing.legal.cookie.types.title",
          "2. Types We Use",
        )}
      </h2>
      <div className="grid gap-6">
        {cookies.map((cookie) => (
          <div
            key={cookie.key}
            className="p-6 rounded-2xl bg-white/50 border border-white shadow-sm flex gap-5"
          >
            <div
              className="w-2 h-auto rounded-full"
              style={{ background: cookie.color }}
            />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                {t(
                  translations,
                  cookie.title,
                  `${cookie.key.charAt(0).toUpperCase() + cookie.key.slice(1)} Cookies:`,
                )}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(translations, cookie.desc, "Description pending.")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CookieUsageSection({ translations }: SectionProps) {
  const usageKeys = [
    "marketing.legal.cookie.usage.auth",
    "marketing.legal.cookie.usage.analytics",
    "marketing.legal.cookie.usage.prefs",
    "marketing.legal.cookie.usage.performance",
  ];
  return (
    <section id="usage" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-3xl mb-6">
        {t(
          translations,
          "marketing.legal.cookie.usage.title",
          "3. How We Use Them",
        )}
      </h2>
      <p className="mb-6 text-gray-700">
        {t(
          translations,
          "marketing.legal.cookie.usage.intro",
          "We use cookies to:",
        )}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {usageKeys.map((key, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl bg-teal-50/50 text-sm text-teal-800 border border-teal-100/50"
          >
            <span className="text-teal-500 font-bold">✓</span>
            {t(translations, key, "Site function")}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CookieManageSection({ translations }: SectionProps) {
  return (
    <section id="manage" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.cookie.manage.title",
          "4. Managing Preferences",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.manage.desc",
          "Policy details.",
        )}
      </p>
    </section>
  );
}

export function CookieThirdPartySection({ translations }: SectionProps) {
  return (
    <section id="third-party" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.cookie.third_party.title",
          "5. Third-Party Services",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.third_party.desc",
          "Policy details.",
        )}
      </p>
    </section>
  );
}

export function CookieUpdatesSection({ translations }: SectionProps) {
  return (
    <section id="updates" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(translations, "marketing.legal.cookie.updates.title", "6. Updates")}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.cookie.updates.desc",
          "Policy details.",
        )}
      </p>
    </section>
  );
}

export function CookieContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-24 pt-10 border-t border-black/5"
    >
      <h2 className="font-display text-3xl mb-6">
        {t(translations, "marketing.legal.cookie.contact.title", "7. Contact")}
      </h2>
      <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-xl shadow-black/5">
        <p className="text-gray-700 mb-6">
          {t(
            translations,
            "marketing.legal.cookie.contact.desc",
            "If you have any questions about our use of cookies, please contact us at:",
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
