// src/app/[lang]/page.tsx

import { fetchHeroSection } from "@/3-entities/sections/api/fetchHeroSection";
import { fetchProgramSection } from "@/3-entities/sections/api/fetchProgramSection";
import type {
  HeroSection as HeroSectionType,
  ProgramSection as ProgramSectionType,
} from "@/4-shared/types";
import { HeroSection } from "@/3-entities/sections/ui/HeroSection";
import { ProgramSectionComponent } from "@/3-entities/sections/ui/ProgramSection";

// SSR: Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const siteId = "aa34aa33-0ad3-4231-952c-89d7fd655d53"; // Will be dynamic for tenants in future
  const hero: HeroSectionType | null = await fetchHeroSection(siteId);
  const lang = params.lang;

  const title = hero?.title?.[lang] || "Wedding Event Website";
  const description = hero?.content?.description?.[lang] || "";
  const image = hero?.content?.backgroundImage || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      locale: lang,
    },
    alternates: {
      languages: {
        es: "/es",
        ca: "/ca",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const siteId = "aa34aa33-0ad3-4231-952c-89d7fd655d53"; // Dynamic in future
  const lang = params.lang;

  const [hero, program]: [HeroSectionType | null, ProgramSectionType | null] =
    await Promise.all([fetchHeroSection(siteId), fetchProgramSection(siteId)]);

  return (
    <div className="flex flex-col gap-16 md:gap-24 px-4 md:px-8 lg:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
      {hero && <HeroSection hero={hero} lang={lang} />}
      {program && <ProgramSectionComponent program={program} lang={lang} />}
    </div>
  );
}
