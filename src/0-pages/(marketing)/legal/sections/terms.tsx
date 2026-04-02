import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";

type SectionProps = {
  translations: MarketingTranslations;
};

export function TermsUseSection({ translations }: SectionProps) {
  return (
    <section id="use" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.use.title",
          "1. Use of Service",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.use.desc",
          "You must be at least 18 years old to use WeddWeb. You agree to use the service only for lawful purposes.",
        )}
      </p>
    </section>
  );
}

export function TermsAccountSection({ translations }: SectionProps) {
  return (
    <section id="account" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.account.title",
          "2. Account Registration",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.account.desc",
          "You are responsible for maintaining the confidentiality of your account credentials.",
        )}
      </p>
    </section>
  );
}

export function TermsContentSection({ translations }: SectionProps) {
  return (
    <section id="content" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.content.title",
          "3. Content & Intellectual Property",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.content.desc",
          "All content on WeddWeb, including text, images, and code, is owned by WeddWeb or its licensors.",
        )}
      </p>
    </section>
  );
}

export function TermsUserContentSection({ translations }: SectionProps) {
  return (
    <section id="user-content" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.user_content.title",
          "4. User Content",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.user_content.desc",
          "You retain ownership of content you upload but grant WeddWeb a license to use, display, and distribute it as needed to provide the service.",
        )}
      </p>
    </section>
  );
}

export function TermsProhibitedSection({ translations }: SectionProps) {
  return (
    <section
      id="prohibited"
      className="mb-14 scroll-mt-24 p-8 rounded-3xl bg-white/50 border border-white/80 shadow-sm"
    >
      <Heading as="h2" className="font-display text-2xl mb-6 pb-6">
        {t(
          translations,
          "marketing.legal.terms.prohibited.title",
          "5. Prohibited Conduct",
        )}
      </Heading>
      <ul className="grid gap-4">
        {[
          {
            key: "marketing.legal.terms.prohibited.laws",
            label: "Violating any laws",
          },
          {
            key: "marketing.legal.terms.prohibited.ip",
            label: "Infringing IP rights",
          },
          {
            key: "marketing.legal.terms.prohibited.malicious",
            label: "Malicious content",
          },
          {
            key: "marketing.legal.terms.prohibited.access",
            label: "Unauthorized access",
          },
          {
            key: "marketing.legal.terms.prohibited.domain_abuse",
            label:
              "Circumventing domain, event, or plan limits (for example, by repeatedly swapping custom domains or sharing your account access).",
          },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-sm text-gray-700">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-[10px] font-bold">
              ✕
            </span>
            {t(translations, item.key, item.label)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TermsTerminationSection({ translations }: SectionProps) {
  return (
    <section id="termination" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.termination.title",
          "6. Termination",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.termination.desc",
          "We may suspend or terminate your account if you violate these Terms or misuse the service.",
        )}
      </p>
    </section>
  );
}

export function TermsDisclaimerSection({ translations }: SectionProps) {
  return (
    <section id="disclaimer" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.disclaimer.title",
          "7. Disclaimers & Liability",
        )}
      </Heading>
      <div className="p-6 rounded-2xl bg-slate-900/5 italic text-sm border-l-4 border-slate-300">
        {t(
          translations,
          "marketing.legal.terms.disclaimer.desc",
          'WeddWeb is provided "as is" without warranties of any kind.',
        )}
      </div>
    </section>
  );
}

export function TermsChangesSection({ translations }: SectionProps) {
  return (
    <section id="changes" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.changes.title",
          "8. Changes to Terms",
        )}
      </Heading>
      <p className="text-gray-700 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.changes.desc",
          "We may update these Terms from time to time. Changes will be posted on this page.",
        )}
      </p>
    </section>
  );
}

export function TermsContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-14 scroll-mt-24 pt-10 border-t border-black/5"
    >
      <Heading as="h2" className="font-display text-2xl pb-4">
        {t(translations, "marketing.legal.terms.contact.title", "9. Contact")}
      </Heading>
      <p className="text-gray-700">
        {t(
          translations,
          "marketing.legal.terms.contact.desc",
          "For questions about these Terms, contact:",
        )}{" "}
        <a
          href="mailto:carles@rio-frances.com"
          className="font-semibold underline decoration-2 transition-all hover:opacity-70"
          style={{
            color: "var(--marketing-color-primary)",
            textDecorationColor: "var(--marketing-color-primary-focus)",
          }}
        >
          carles@rio-frances.com
        </a>
      </p>
    </section>
  );
}
