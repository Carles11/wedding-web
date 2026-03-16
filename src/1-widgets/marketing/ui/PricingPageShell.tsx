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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* HERO */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6">{title}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {summary}
          </p>
        </div>

        {/* PRICING TABLE */}
        {children}

        {/* FINE PRINT */}
        <p className="text-sm text-gray-500 text-center mt-20 max-w-xl mx-auto">
          {fine_print}
        </p>
      </div>
    </main>
  );
}
