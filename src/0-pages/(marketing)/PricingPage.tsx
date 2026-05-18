import PricingCTATableAdapter from "@/1-widgets/marketing/ui/PricingCTATableAdapter";
import PricingPageShell from "@/1-widgets/marketing/ui/PricingPageShell";

import type { MarketingTranslations } from "@/4-shared/types";

type Props = {
  translations: MarketingTranslations;
  lang: string;
  priceOverrides?: { price: number; currency: string };
};

export default function PricingPage({
  translations,
  lang,
  priceOverrides,
}: Props) {
  return (
    <>
      <PricingPageShell
        title={translations["pricing.title"] ?? "Start Free. Own It Forever."}
        summary={
          translations["pricing.summary"] ??
          "Your wedding website stays online forever—in 11 native scripts, on your own domain, with complete privacy. Begin for free, and upgrade once when you're ready for all of it."
        }
        fine_print={
          translations["pricing.fine_print"] ??
          "All prices are in EUR and include any applicable taxes. The Premium plan is a single, one-time payment—no annual renewals, no hidden costs, no surprises."
        }
      >
        <PricingCTATableAdapter
          lang={lang}
          t={translations}
          priceOverrides={priceOverrides}
        />
      </PricingPageShell>
    </>
  );
}
