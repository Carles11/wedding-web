import PricingCTATable from "@/2-features/marketing/pricing/PricingCTATable";

import { getSiteIdForDomainOrSubdomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { headers } from "next/headers";

export default async function PricingPage({ lang = "en" }: { lang?: string }) {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const siteId = await getSiteIdForDomainOrSubdomain(host);

  const t = await getMergedTranslations(siteId, lang, "en");
  return (
    <main className="relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {" "}
        {/* HERO */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            {t["pricing.title"] ?? "Plans & Pricing"}
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {t["pricing.summary"] ??
              "Create a beautiful wedding website and share your special day."}
          </p>
        </div>
        <PricingCTATable lang={lang} t={t} />
        {/* FINE PRINT */}
        <p className="text-sm text-gray-500 text-center mt-20 max-w-xl mx-auto">
          {t["pricing.fine_print"] ??
            "All prices include applicable taxes where required."}
        </p>
      </div>
    </main>
  );
}
