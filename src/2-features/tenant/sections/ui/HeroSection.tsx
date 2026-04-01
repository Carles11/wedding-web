import { getPublicUrlForTenantBucketImage } from "@/4-shared/helpers/getPublicUrlForTenantBucketImage";
import type { HeroSectionType } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import Image from "next/image";

type HeroSectionProps = {
  hero: HeroSectionType;
  backgroundImage: string; // Public URL already fetched outside
};

/**
 * HeroSection
 * - Renders hero image + title + description
 */
export default function HeroSection({
  hero,
  backgroundImage,
}: HeroSectionProps) {
  const title = hero.title ?? "";
  const description = hero.description ?? "";

  return (
    <section
      className="relative w-full h-screen min-h-[340px] overflow-hidden flex items-center justify-center shadow-lg"
      aria-labelledby="hero-title"
    >
      {backgroundImage && (
        <Image
          src={getPublicUrlForTenantBucketImage(backgroundImage)}
          alt={title || "Hero image for event"}
          fill
          loading="eager"
          priority
          className="object-cover object-center brightness-[.84] contrast-125 sepia hue-rotate-350 saturate-140"
          style={{
            filter:
              "grayscale(0.07) sepia(0.18) contrast(1.15) brightness(0.84) hue-rotate(-10deg) saturate(1.4)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center">
        <Heading
          id="hero-title"
          as="h1"
          className="font-light text-white text-center tracking-wide drop-shadow-lg max-w-[90%] md:max-w-3xl"
        >
          {title}
        </Heading>

        {description && (
          <p className="subtitle mt-4 font-sans text-lg md:text-xl text-white text-center drop-shadow max-w-[85%] md:max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
