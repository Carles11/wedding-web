import type { HeroSection as HeroSectionType } from "@/4-shared/types";
import Image from "next/image";

type HeroSectionProps = {
  hero: HeroSectionType;
  lang: string;
};

export function HeroSection({ hero, lang }: HeroSectionProps) {
  const title = hero.title?.[lang] ?? "";
  const description = hero.content?.description?.[lang] ?? "";
  const backgroundImage = hero.content?.backgroundImage ?? "";

  return (
    <section className="relative w-full h-[55vh] min-h-[340px] max-h-[60vh] overflow-hidden flex items-center justify-center rounded-xl shadow-lg">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title || "Hero image for event"}
          fill
          loading="eager"
          priority={true}
          className="object-cover object-center brightness-[.84] contrast-125 sepia hue-rotate-[350deg] saturate-140"
          style={{
            filter:
              "grayscale(0.07) sepia(0.18) contrast(1.15) brightness(0.84) hue-rotate(-10deg) saturate(1.4)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 className="font-serif text-5xl md:text-6xl font-light text-white text-center tracking-wide drop-shadow-lg">
          {title}
        </h1>
        <p className="mt-4 font-sans text-lg md:text-xl text-white text-center drop-shadow">
          {description}
        </p>
      </div>
    </section>
  );
}
