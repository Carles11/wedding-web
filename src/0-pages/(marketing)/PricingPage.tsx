import PricingCTATable from "@/2-features/builder/billing/ui/pricing/PricingCTATable";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";

type PricingPageProps = {
  lang?: string;
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PricingPage({
  lang,
  searchParams,
}: PricingPageProps) {
  let resolvedSearchParams = searchParams;
  if (
    resolvedSearchParams &&
    typeof resolvedSearchParams === "object" &&
    typeof (resolvedSearchParams as unknown as Promise<unknown>).then ===
      "function"
  ) {
    resolvedSearchParams = await (resolvedSearchParams as Promise<{
      [key: string]: string | string[] | undefined;
    }>);
  }

  const paramsObj = resolvedSearchParams as
    | { [key: string]: string | string[] | undefined }
    | undefined;

  const langRaw =
    typeof lang === "string"
      ? lang
      : Array.isArray(paramsObj?.lang) && typeof paramsObj?.lang[0] === "string"
        ? paramsObj?.lang[0]
        : typeof paramsObj?.lang === "string"
          ? paramsObj?.lang
          : "en";

  const resolvedLang = isValidLanguage(langRaw) ? langRaw : "en";
  const t = await fetchBuilderTranslations(resolvedLang, "en");
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
        <PricingCTATable lang={resolvedLang} t={t} />
        {/* FINE PRINT */}
        <p className="text-sm text-gray-500 text-center mt-20 max-w-xl mx-auto">
          {t["pricing.fine_print"] ??
            "All prices include applicable taxes where required."}
        </p>
      </div>
    </main>
  );
}
