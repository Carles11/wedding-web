import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";

type SectionProps = {
  translations: MarketingTranslations;
};

export function PrivacyCollectSection({ translations }: SectionProps) {
  return (
    <section id="collect" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-3xl mb-6">
        {t(
          translations,
          "marketing.legal.privacy.collect.title",
          "1. Information We Collect",
        )}
      </h2>
      <div className="space-y-6">
        {[
          {
            label: "marketing.legal.privacy.collect.account",
            desc: "marketing.legal.privacy.collect.account_desc",
            defaultLabel: "Account Data",
            defaultDesc: "Name and email during registration.",
          },
          {
            label: "marketing.legal.privacy.collect.usage",
            desc: "marketing.legal.privacy.collect.usage_desc",
            defaultLabel: "Usage Data",
            defaultDesc: "Insights on how you interact with our tools.",
          },
          {
            label: "marketing.legal.privacy.collect.contact",
            desc: "marketing.legal.privacy.collect.contact_desc",
            defaultLabel: "Contact Data",
            defaultDesc: "Messages sent to our support team.",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-1 h-auto rounded-full bg-teal-200" />
            <div>
              <strong className="block text-gray-900 mb-1">
                {t(translations, item.label, item.defaultLabel)}
              </strong>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(translations, item.desc, item.defaultDesc)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <div className="w-1 h-auto rounded-full bg-orange-200" />
          <p className="text-sm text-gray-600">
            <strong>
              {t(
                translations,
                "marketing.legal.privacy.collect.cookies",
                "Cookies:",
              )}
            </strong>{" "}
            {t(
              translations,
              "marketing.legal.privacy.collect.cookies_desc",
              "See our ",
            )}
            <a
              href="/en/legal/cookie-policy"
              className="underline font-medium text-teal-600"
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
              "for details.",
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
      className="mb-16 scroll-mt-24 p-8 rounded-3xl bg-white/40 border border-white/80 shadow-sm"
    >
      <h2 className="font-display text-2xl mb-6">
        {t(
          translations,
          "marketing.legal.privacy.use.title",
          "2. How We Use It",
        )}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          "marketing.legal.privacy.use.improve",
          "marketing.legal.privacy.use.communicate",
          "marketing.legal.privacy.use.legal",
          "marketing.legal.privacy.use.security",
        ].map((key, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            {t(translations, key, "Service improvement")}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PrivacySharingSection({ translations }: SectionProps) {
  return (
    <section id="sharing" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.privacy.sharing.title",
          "3. Data Sharing",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.sharing.desc",
          "Details on how we handle data transfers and sharing.",
        )}
      </p>
    </section>
  );
}

export function PrivacyTransfersSection({ translations }: SectionProps) {
  return (
    <section id="transfers" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.privacy.transfers.title",
          "4. International Transfers",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.transfers.desc",
          "Details on how we handle data transfers and sharing.",
        )}
      </p>
    </section>
  );
}

export function PrivacyRightsSection({ translations }: SectionProps) {
  return (
    <section
      id="rights"
      className="mb-16 scroll-mt-24 border-t border-black/5 pt-12"
    >
      <h2 className="font-display text-3xl mb-6">
        {t(
          translations,
          "marketing.legal.privacy.rights.title",
          "5. Your Rights",
        )}
      </h2>
      <div className="grid gap-3">
        {[
          "marketing.legal.privacy.rights.access",
          "marketing.legal.privacy.rights.object",
          "marketing.legal.privacy.rights.withdraw",
          "marketing.legal.privacy.rights.contact",
        ].map((key, i) => (
          <div
            key={i}
            className="group p-4 rounded-xl transition-all hover:bg-white/80 border border-transparent hover:border-teal-100 flex items-center justify-between"
          >
            <span className="text-gray-700 font-medium">
              {t(translations, key, "Your right")}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-500">
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
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.privacy.security.title",
          "6. Data Security",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.security.desc",
          "Privacy details.",
        )}
      </p>
    </section>
  );
}

export function PrivacyRetentionSection({ translations }: SectionProps) {
  return (
    <section id="retention" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.privacy.retention.title",
          "7. Data Retention",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.retention.desc",
          "Privacy details.",
        )}
      </p>
    </section>
  );
}

export function PrivacyUpdatesSection({ translations }: SectionProps) {
  return (
    <section id="updates" className="mb-16 scroll-mt-24">
      <h2 className="font-display text-2xl mb-4">
        {t(
          translations,
          "marketing.legal.privacy.updates.title",
          "8. Policy Changes",
        )}
      </h2>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.privacy.updates.desc",
          "Privacy details.",
        )}
      </p>
    </section>
  );
}

export function PrivacyContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-24 pt-12 border-t-2 border-teal-500/20"
    >
      <h2 className="font-display text-3xl mb-6">
        {t(translations, "marketing.legal.privacy.contact.title", "9. Contact")}
      </h2>
      <div className="p-8 rounded-3xl bg-teal-900 text-white shadow-xl shadow-teal-900/10">
        <p className="mb-6 opacity-80 text-sm">
          {t(
            translations,
            "marketing.legal.privacy.contact.desc1",
            "For privacy questions or requests, contact:",
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
              className="inline-block px-6 py-3 rounded-full bg-white text-teal-900 font-bold transition-transform hover:scale-105"
            >
              carles@rio-frances.com
            </a>
          </div>
        </address>
      </div>
    </section>
  );
}
