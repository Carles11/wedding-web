import { TestimonialsSectionProps } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { MarketingButton } from "@/4-shared/ui/marketing";
import Image from "next/image";

export default function TestimonialsSection({
  sectionTitle,
  sectionSubtitle,
  viewExampleButtonText,
  examples,
}: TestimonialsSectionProps) {
  const premium = examples.find((s) => s.isPremium) ?? examples[0];

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: "var(--marketing-bg-subtle-gradient)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Heading
            as="h2"
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--marketing-color-on-gradient-text)" }}
          >
            {sectionTitle}
          </Heading>
          <p className="mt-3 text-base md:text-lg text-gray-500 dark:text-gray-400">
            {sectionSubtitle}
          </p>
        </div>

        {/* Split layout */}
        <div
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16 rounded-3xl overflow-hidden p-8 md:p-12"
          style={{
            background: "var(--color-background)",
            border: "1px solid var(--builder-color-border, #e8e6e1)",
            boxShadow: "0 4px 32px 0 rgba(106,189,166,0.08)",
          }}
        >
          {/* Image side */}
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg relative aspect-4/3 shrink-0">
            <Image
              src="/assets/images/ines-und-carles-hero-image.jpg"
              alt="Example wedding site preview"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              className="object-cover object-center"
              priority
            />
            {/* Subtle overlay with URL */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3 text-xs text-white font-medium tracking-wide"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
              }}
            >
              {premium.siteUrl}
            </div>
          </div>

          {/* Copy side */}
          <div className="flex flex-col items-start gap-5 w-full md:w-1/2">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
              {premium.siteName}
            </h3>

            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              {premium.siteDescription}
            </p>

            <MarketingButton
              href={premium.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              aria-label={`Open ${premium.siteName} example in new tab`}
            >
              {viewExampleButtonText} →
            </MarketingButton>
          </div>
        </div>
      </div>
    </section>
  );
}
