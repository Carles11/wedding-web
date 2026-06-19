import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { ReactNode } from "react";

export interface PricingPageShellProps {
  title: string;
  summary: string;
  fine_print: string;
  children: ReactNode; // PricingCTATable or adapter
}

/**
 * Pricing page layout shell with background glow, hero section, and fine print.
 */
export default function PricingPageShell({
  title,
  summary,
  fine_print,
  children,
}: PricingPageShellProps) {
  return (
    <main className="relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(106,189,166,0.15),transparent_60%)]" />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* HERO */}
        <div className="text-center mb-20">
          <Heading
            as="h1"
            className="text-3xl md:text-4xl font-bold text-center pt-0 md:pt-4 pb-8"
            style={{ color: "var(--marketing-color-on-gradient-text)" }}
          >
            {title}
          </Heading>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {summary}
          </p>
        </div>

        {/* PRICING TABLE */}
        {children}

        {/* FINE PRINT */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20 max-w-xl mx-auto">
          {fine_print}
        </p>
      </div>
    </main>
  );
}
