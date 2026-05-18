import PricingCTATable from "@/2-features/builder/billing/ui/pricing/PricingCTATable";
import type { TranslationDictionary } from "@/4-shared/types";

export interface PricingCTATableAdapterProps {
  lang: string;
  t: TranslationDictionary;
  priceOverrides?: { price: number; currency: string };
}

/**
 * Adapter wrapper around builder's PricingCTATable.
 * Isolates cross-layer coupling and provides marketing-safe interface.
 */
export default function PricingCTATableAdapter({
  lang,
  t,
  priceOverrides,
}: PricingCTATableAdapterProps) {
  return <PricingCTATable lang={lang} t={t} priceOverrides={priceOverrides} />;
}
