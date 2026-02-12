import Image from "next/image";
import React from "react";

/**
 * Example site type for showcasing live wedding sites
 */
export type ExampleSite = {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  previewImage?: string;
  isPremium: boolean;
};

/**
 * Props for TestimonialsSection
 */
export interface TestimonialsSectionProps {
  sectionTitle: string;
  sectionSubtitle: string;
  viewExampleButtonText: string;
  examples: ExampleSite[];
}

export default function TestimonialsSection({
  sectionTitle,
  sectionSubtitle,
  viewExampleButtonText,
  examples,
}: TestimonialsSectionProps) {
  const single = examples.length === 1;

  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-lg text-gray-600">{sectionSubtitle}</p>
        </div>

        <div
          className={`mt-10 grid gap-8 ${single ? "grid-cols-1 justify-center" : "grid-cols-1 md:grid-cols-2"}`}
        >
          {examples.map((site) => (
            <article
              key={site.siteUrl}
              className={`bg-white rounded-lg shadow-sm overflow-hidden transform transition duration-200 hover:shadow-lg hover:-translate-y-1 ${
                site.isPremium ? "border-l-4 border-[#6ABDA6]" : ""
              }`}
            >
              {site.previewImage ? (
                <div className="w-full h-48 md:h-56 relative">
                  <Image
                    src={site.previewImage}
                    alt={`${site.siteName} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 md:h-56 flex items-center justify-center bg-gradient-to-r from-[#6ABDA6] to-[#F4A261]">
                  <span className="text-white text-xl font-semibold">
                    {site.siteName}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {site.siteName}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {site.siteDescription}
                    </p>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium ${
                        site.isPremium
                          ? "bg-[#6ABDA6] text-white"
                          : "bg-gray-200 text-gray-800"
                      } rounded-full`}
                    >
                      {site.isPremium ? "Premium" : "Free"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={site.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${site.siteName} example in new tab`}
                    className="inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6ABDA6]"
                    style={{ borderColor: "#6ABDA6", color: "#064e3b" }}
                  >
                    {viewExampleButtonText}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
