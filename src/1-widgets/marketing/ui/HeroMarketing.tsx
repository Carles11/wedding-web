"use client";

import { HeroMarketingProps } from "@/4-shared/types";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { MarketingButton } from "@/4-shared/ui/marketing";

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
  primaryHref,
  secondaryHref,
}: HeroMarketingProps) {
  return (
    <section
      className="w-full min-h-[80vh] flex items-center"
      aria-label="Marketing hero"
    >
      <div
        className="w-full py-20 h-[-webkit-fill-available]"
        style={{ background: "var(--marketing-bg-gradient)" }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Heading as="h1">{headline}</Heading>
          <p className="mt-6 text-xl md:text-2xl text-gray-600">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center">
            <MarketingButton
              variant="primary"
              href={primaryHref} // Crawler now sees this!
              size="lg"
              onClick={onPrimaryClick}
              aria-label={ctaPrimary}
            >
              {ctaPrimary}
            </MarketingButton>

            {ctaSecondary ? (
              <MarketingButton
                variant="secondary"
                href={secondaryHref} // Crawler now sees this!
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
