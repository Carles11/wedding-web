import React from "react";
import FlowerDivider from "./FlowerDivider";

type SectionContainerProps = {
  id?: string;
  heading?: React.ReactNode;
  headingId?: string;
  subtitle?: React.ReactNode;
  variant?: "white" | "muted";
  withDivider?: boolean;
  imageBackground?: boolean;
  // new: per-section divider customization
  dividerMotive?: string; // e.g. "flower1" | "flower2" | "sprig"
  dividerClassName?: string;
  dividerSize?: number;
  dividerOpacity?: number;
  children: React.ReactNode;
};

/**
 * Consistent section wrapper used across public sections.
 * - variant: 'white' (default) or 'muted' (slightly grey)
 * - withDivider: show the discreet FlowerDivider centered above the section
 * - dividerMotive / dividerClassName / dividerSize / dividerOpacity customize the motif per section
 */
export default function SectionContainer({
  id,
  heading,
  headingId,
  subtitle,
  variant = "white",
  withDivider = false,
  imageBackground,
  dividerMotive,
  dividerClassName,
  dividerSize,
  dividerOpacity,
  children,
}: SectionContainerProps) {
  const bgClass = variant === "muted" ? "bg-transparent" : "bg-white";
  const innerBg = variant === "muted" ? "bg-white" : "bg-white";
  const motive = dividerMotive ?? "flower1";
  const motifClass = dividerClassName ?? "w-36 h-auto";
  const size = dividerSize ?? 120;
  const opacity = dividerOpacity ?? 0.06;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${bgClass} relative py-16 md:py-24`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {withDivider && (
          <div className="flex justify-center -mt-10 mb-6">
            <FlowerDivider
              motive={motive}
              className={motifClass}
              size={size}
              opacity={opacity}
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {(heading || subtitle) && (
            <header className="mb-6">
              {heading && (
                <h2
                  id={headingId}
                  className="text-2xl md:text-3xl font-extrabold leading-tight text-neutral-800"
                >
                  {heading}
                </h2>
              )}
              {subtitle && <p className="mt-2 text-neutral-600">{subtitle}</p>}
            </header>
          )}

          <div
            className={`${innerBg} rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
