"use client";
import React from "react";

/**
 * Single feature item displayed in the grid.
 */
export type Feature = {
  /** Emoji or icon identifier (e.g., "🌐") */
  icon: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
};

/**
 * Props for `FeaturesGrid` component.
 */
export interface FeaturesGridProps {
  /** Section heading text */
  sectionTitle: string;
  /** Free tier display name */
  freeTierName: string;
  /** Premium tier display name */
  premiumTierName: string;
  /** Features included in the free tier */
  freeFeatures: Feature[];
  /** Features included in the premium tier */
  premiumFeatures: Feature[];
  /** Label for the premium badge (e.g., "Popular") */
  popularBadgeLabel?: string;
}

/**
 * FeaturesGrid
 *
 * Compares Free vs Premium features in a responsive two-column layout.
 */
export default function FeaturesGrid({
  sectionTitle,
  freeTierName,
  premiumTierName,
  freeFeatures,
  premiumFeatures,
  popularBadgeLabel = "Popular",
}: FeaturesGridProps) {
  return (
    <section
      aria-labelledby="marketing-features-title"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2
          id="marketing-features-title"
          className="text-3xl md:text-4xl font-bold"
        >
          {sectionTitle}
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Tier Card */}
          <article className="flex flex-col h-full p-6 bg-white border border-gray-200 shadow-md rounded-lg">
            <header className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold uppercase">
                {freeTierName}
              </h3>
            </header>

            <ul
              className="mt-2 space-y-6 text-left flex-1"
              aria-label="Free tier features"
            >
              {freeFeatures.map((f, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 text-3xl md:text-4xl">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{f.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {f.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Premium Tier Card */}
          <article className="flex flex-col h-full p-6 bg-white border-2 border-[#6ABDA6] shadow-lg rounded-lg relative">
            <div className="absolute -top-3 right-3 bg-[#6ABDA6] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {popularBadgeLabel}
            </div>
            <header className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold uppercase">
                {premiumTierName}
              </h3>
            </header>

            <ul
              className="mt-2 space-y-6 text-left flex-1"
              aria-label="Premium tier features"
            >
              {premiumFeatures.map((f, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 text-3xl md:text-4xl">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{f.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {f.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
