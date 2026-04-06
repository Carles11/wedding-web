"use client";

import { CTASectionProps } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { MarketingButton } from "@/4-shared/ui/marketing";

export default function CTASection({
  headline,
  description,
  buttonText,
  onButtonClick,
  primaryHref,
}: CTASectionProps) {
  return (
    <section
      aria-label="Call to action"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "var(--marketing-bg-gradient)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--marketing-color-primary)" }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--marketing-color-accent)" }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <Heading
          as="h2"
          className="text-3xl md:text-5xl font-bold leading-tight"
          style={{ color: "var(--marketing-color-on-gradient-text)" }}
        >
          {headline}
        </Heading>

        <p className="mt-5 text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          {description}.
        </p>

        <div className="mt-10">
          <MarketingButton
            variant="primary"
            href={primaryHref} // Crawler now sees this!
            size="lg"
            onClick={onButtonClick}
            aria-label={buttonText}
            className="w-full md:w-auto"
          >
            {buttonText} →
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
