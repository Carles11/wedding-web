import { headers } from "next/headers";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteIdForSubdomain } from "@/4-shared/lib/getSiteIdForSubdomain";
import { fetchHeroSection } from "@/3-entities/sections/api/fetchHeroSection";
import { fetchProgramSection } from "@/3-entities/sections/api/fetchProgramSection";
import { HeroSection } from "@/3-entities/sections/ui/HeroSection";
import { ProgramSectionComponent } from "@/3-entities/sections/ui/ProgramSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  let siteId: string | null = null;
  const subdomain = host.endsWith(".localhost:3000")
    ? host.replace(".localhost:3000", "")
    : host.endsWith(".wedding-web.com")
    ? host.replace(".wedding-web.com", "")
    : null;

  if (subdomain) {
    siteId = await getSiteIdForSubdomain(subdomain);
  } else {
    siteId = await getSiteIdForDomain(host);
  }

  if (!siteId) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-700">
          Wedding Event Not Found
        </h1>
        <p className="text-lg text-gray-600 max-w-lg text-center">
          This wedding website is not yet published or available for this
          domain: <strong>{host}</strong>
        </p>
      </div>
    );
  }

  const [hero, program] = await Promise.all([
    fetchHeroSection(siteId),
    fetchProgramSection(siteId),
  ]);

  return (
    <div className="flex flex-col gap-16 md:gap-24 px-4 md:px-8 lg:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
      {hero && <HeroSection hero={hero} lang={lang} />}
      {program && <ProgramSectionComponent program={program} lang={lang} />}
    </div>
  );
}
