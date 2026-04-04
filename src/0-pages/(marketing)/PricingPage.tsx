import PricingCTATableAdapter from "@/1-widgets/marketing/ui/PricingCTATableAdapter";
import PricingPageShell from "@/1-widgets/marketing/ui/PricingPageShell";

import type { MarketingTranslations } from "@/4-shared/types";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function PricingPage({ translations, lang }: Props) {
  return (
    <>
      <PricingPageShell
        title={translations["pricing.title"] ?? "Plans & Pricing"}
        summary={
          translations["pricing.summary"] ??
          "Create a beautiful wedding website and share your special day."
        }
        fine_print={
          translations["pricing.fine_print"] ??
          "All prices include applicable taxes where required."
        }
      >
        <PricingCTATableAdapter lang={lang} t={translations} />
      </PricingPageShell>
    </>
  );
}
