"use client";

import { FeaturesGridProps } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";

import { CheckIcon } from "@/4-shared/ui/commons/icons/checkIcon";

export default function FeaturesGrid({
  sectionTitle,
  freeTierName,
  premiumTierName,
  freeFeatures,
  premiumFeatures,
  popularBadgeLabel = "Popular",
  lang,
  faqTitle,
}: FeaturesGridProps) {
  return (
    <section
      aria-labelledby="marketing-features-title"
      className="py-16"
      style={{ background: "var(--marketing-bg-subtle-gradient)" }}
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <Heading as="h2" id="marketing-features-title">
          {sectionTitle}
        </Heading>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Tier */}
          <article
            className="flex flex-col h-full p-8 rounded-2xl shadow-sm"
            style={{
              background: "var(--color-background)",
              border: "1px solid var(--builder-color-border)",
            }}
          >
            <header
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid var(--builder-color-border)" }}
            >
              <Heading
                as="h3"
                className="text-base font-semibold uppercase tracking-widest opacity-60"
              >
                {freeTierName}
              </Heading>
            </header>

            <ul
              className="space-y-5 text-left flex-1"
              aria-label="Free tier features"
            >
              {freeFeatures.map((f, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <CheckIcon />
                  <div>
                    <div className="text-md font-semibold">{f.title}</div>
                    {f.description ? (
                      <div className="text-sm mt-0.5 opacity-55">
                        {f.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Premium Tier */}
          <article
            className="flex flex-col h-full p-8 rounded-2xl shadow-md relative"
            style={{
              background: "var(--color-background)",
              border: "2px solid var(--marketing-color-primary)",
            }}
          >
            <div
              className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: "var(--marketing-color-primary)" }}
            >
              {popularBadgeLabel}
            </div>

            <header
              className="mb-6 pb-4"
              style={{ borderBottom: "1px solid var(--builder-color-border)" }}
            >
              <Heading
                as="h3"
                className="text-base font-semibold uppercase tracking-widest opacity-60"
              >
                {premiumTierName}
              </Heading>
            </header>

            <ul
              className="space-y-5 text-left flex-1"
              aria-label="Premium tier features"
            >
              {premiumFeatures.map((f, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <CheckIcon />
                  <div>
                    <div className="text-md font-semibold">{f.title}</div>
                    {f.description ? (
                      <div className="text-sm mt-0.5 opacity-55">
                        {f.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* FAQ Button */}
        <div className="mt-12">
          <a
            href={`${lang ? `${lang}/faq` : "/"}`}
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white shadow-md transition hover:opacity-90"
            style={{ background: "var(--marketing-color-primary)" }}
            aria-label="Frequently Asked Questions"
          >
            {faqTitle ?? "Frequently Asked Questions"}
          </a>
        </div>
      </div>
    </section>
  );
}
