"use client";

/**
 * Props for CTASection
 */
export interface CTASectionProps {
  headline: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

/**
 * CTASection - final call-to-action section for marketing page
 */
export default function CTASection({
  headline,
  description,
  buttonText,
  onButtonClick,
}: CTASectionProps) {
  return (
    <section
      aria-label="Call to action"
      className="py-16 md:py-24 bg-gradient-to-r from-[#6ABDA6] to-[#F4A261]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          {headline}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-white/90">{description}</p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onButtonClick}
            aria-label={buttonText}
            className="w-full md:w-auto inline-flex items-center justify-center px-10 py-4 md:py-5 text-xl font-semibold rounded-full bg-white text-[#0f766e] shadow-xl transform transition duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
