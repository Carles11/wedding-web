"use client";

import { MarketingButton } from "@/4-shared/ui/marketing";

/**
 * Props for `HeroMarketing` component.
 */
export interface HeroMarketingProps {
  /** Headline text (e.g., translations['marketing.hero.headline']) */
  headline: string;
  /** Subheadline text (e.g., translations['marketing.hero.subheadline']) */
  subheadline: string;
  /** Primary CTA button text (e.g., translations['marketing.hero.cta_primary']) */
  ctaPrimary: string;
  /** Optional secondary CTA button text (e.g., translations['marketing.hero.cta_secondary']) */
  ctaSecondary?: string;
  /** Optional callback for primary CTA button */
  onPrimaryClick?: () => void;
  /** Optional callback for secondary CTA button */
  onSecondaryClick?: () => void;
}

/**
 * Full-width marketing hero section.
 *
 * - Uses a soft gradient background (teal -> white -> orange)
 * - Responsive, accessible, and accepts click handlers for CTAs
 */
export default function HeroMarketing({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  onPrimaryClick,
  onSecondaryClick,
}: HeroMarketingProps) {
  return (
    <section
      className="w-full min-h-[80vh] flex items-center"
      aria-label="Marketing hero"
    >
      <div className="w-full bg-gradient-to-br from-[#E6FAF4] via-white to-[#FFF5EB] py-20 h-[-webkit-fill-available]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            {headline}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center">
            <MarketingButton
              variant="primary"
              size="lg"
              onClick={onPrimaryClick}
              aria-label={ctaPrimary}
            >
              {ctaPrimary}
            </MarketingButton>

            {ctaSecondary ? (
              <MarketingButton
                variant="secondary"
                size="lg"
                onClick={onSecondaryClick}
                aria-label={ctaSecondary}
              >
                {ctaSecondary}
              </MarketingButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
