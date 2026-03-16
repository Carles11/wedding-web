import PricingCTATableAdapter from "@/1-widgets/marketing/ui/PricingCTATableAdapter";
import PricingPageShell from "@/1-widgets/marketing/ui/PricingPageShell";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";
import type { TranslationDictionary } from "@/4-shared/types";
import { PricingPageProps } from "@/4-shared/types/pricingPage";

export default async function PricingPage({
  lang,
  searchParams,
}: PricingPageProps) {
  // Resolve async searchParams
  const resolvedParams = await resolveSearchParams(searchParams);

  // Extract language with fallback to "en"
  const resolvedLang = resolveLanguageFromParams(
    lang,
    resolvedParams,
    isValidLanguage,
  );

  // Fetch translations
  const t: TranslationDictionary = await fetchBuilderTranslations(
    resolvedLang,
    "en",
  );

  return (
    <PricingPageShell
      title={t["pricing.title"] ?? "Plans & Pricing"}
      summary={
        t["pricing.summary"] ??
        "Create a beautiful wedding website and share your special day."
      }
      fine_print={
        t["pricing.fine_print"] ??
        "All prices include applicable taxes where required."
      }
    >
      <PricingCTATableAdapter lang={resolvedLang} t={t} />
    </PricingPageShell>
  );
}
