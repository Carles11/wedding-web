import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";

type SectionProps = {
  translations: MarketingTranslations;
};

export function TermsUseSection({ translations }: SectionProps) {
  return (
    <section id="use" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.use.title",
          "1. Use of Service",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.use.desc",
          "You must be at least 18 years old to use WeddWeb. You agree to use the service only for lawful purposes related to event planning and personal celebrations.",
        )}
      </p>
    </section>
  );
}

export function TermsAccountSection({ translations }: SectionProps) {
  return (
    <section id="account" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.account.title",
          "2. Account Registration",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.account.desc",
          "You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. We use Supabase for secure authentication.",
        )}
      </p>
    </section>
  );
}

/**
 * Added clarity on "Legacy Mode" and One-time payments
 */
export function TermsSubscriptionSection({ translations }: SectionProps) {
  return (
    <section id="billing" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.billing.title",
          "3. Payments & Subscriptions",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.billing.desc",
          "Payments are processed securely via Stripe. Premium plans are one-time payments. Free accounts may transition to 'Legacy Mode' (view-only) after 6 months of inactivity to preserve platform resources.",
        )}
      </p>
    </section>
  );
}

export function TermsContentSection({ translations }: SectionProps) {
  return (
    <section id="content" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.content.title",
          "4. Intellectual Property",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.content.desc",
          "All platform software, design, and localized technical search engine implementations are owned by WeddWeb.",
        )}
      </p>
    </section>
  );
}

export function TermsUserContentSection({ translations }: SectionProps) {
  return (
    <section id="user-content" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.user_content.title",
          "5. User Content",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.user_content.desc",
          "You retain ownership of the photos and text you upload. By using WeddWeb, you grant us a worldwide license to host and display this content specifically to provide your wedding website services.",
        )}
      </p>
    </section>
  );
}

export function TermsProhibitedSection({ translations }: SectionProps) {
  return (
    <section
      id="prohibited"
      className="mb-14 scroll-mt-24 p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 border border-white/80 dark:border-gray-700/80 shadow-sm"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.prohibited.title",
          "6. Prohibited Conduct",
        )}
      </Heading>
      <ul className="grid gap-4">
        {[
          {
            key: "marketing.legal.terms.prohibited.laws",
            label: "Violating any local or international laws",
          },
          {
            key: "marketing.legal.terms.prohibited.ip",
            label:
              "Uploading content that infringes on third-party intellectual property",
          },
          {
            key: "marketing.legal.terms.prohibited.malicious",
            label:
              "Attempting to reverse engineer or interfere with platform technical SEO or search engine implementations",
          },
          {
            key: "marketing.legal.terms.prohibited.access",
            label: "Unauthorized access to other users' event data",
          },
          {
            key: "marketing.legal.terms.prohibited.domain_abuse",
            label:
              "Circumventing domain, event, or plan limits (for example, by repeatedly swapping custom domains or sharing your account access).",
          },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-sm text-gray-700 dark:text-gray-300">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-400 flex items-center justify-center text-[10px] font-bold">
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
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.termination.title",
          "7. Termination",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.termination.desc",
          "We reserve the right to suspend or terminate accounts that violate these Terms or negatively impact platform stability.",
        )}
      </p>
    </section>
  );
}

export function TermsDisclaimerSection({ translations }: SectionProps) {
  return (
    <section id="disclaimer" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.disclaimer.title",
          "8. Disclaimers & Liability",
        )}
      </Heading>
      <div className="p-6 rounded-2xl bg-slate-900/5 dark:bg-slate-100/10 italic text-sm border-l-4 border-slate-300 dark:border-slate-600">
        {t(
          translations,
          "marketing.legal.terms.disclaimer.desc",
          'WeddWeb is provided "as is". We are not liable for any third-party content, server downtime, or loss of data beyond the one-time purchase price paid.',
        )}
      </div>
    </section>
  );
}

export function TermsChangesSection({ translations }: SectionProps) {
  return (
    <section id="changes" className="mb-14 scroll-mt-24">
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(
          translations,
          "marketing.legal.terms.changes.title",
          "9. Changes to Terms",
        )}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
        {t(
          translations,
          "marketing.legal.terms.changes.desc",
          "We update these terms as our SaaS features evolve. The 'Last Updated' date will be updated accordingly.",
        )}
      </p>
    </section>
  );
}

export function TermsContactSection({ translations }: SectionProps) {
  return (
    <section
      id="contact"
      className="mb-14 scroll-mt-24 pt-10 border-t border-black/5 dark:border-white/10"
    >
      <Heading as="h2" className="font-display text-3xl pb-4">
        {t(translations, "marketing.legal.terms.contact.title", "10. Contact")}
      </Heading>
      <p className="text-gray-700 dark:text-gray-300">
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
