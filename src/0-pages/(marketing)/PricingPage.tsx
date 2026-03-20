import PricingCTATableAdapter from "@/1-widgets/marketing/ui/PricingCTATableAdapter";
import PricingPageShell from "@/1-widgets/marketing/ui/PricingPageShell";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
// Removed misplaced imports
// ...existing code...
import type { TranslationDictionary } from "@/4-shared/types";

export default async function PricingPage({
  params,
}: {
  params?: { lang?: string };
}) {
  // Use the [lang] path segment for language
  const realParams = await params;
  const lang = realParams?.lang ?? "en";

  // Fetch translations
  const t: TranslationDictionary = await fetchBuilderTranslations(lang, "en");

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
      <PricingCTATableAdapter lang={lang} t={t} />
    </PricingPageShell>
  );
}
