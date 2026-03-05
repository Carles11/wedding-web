import { createClient } from "@/4-shared/lib/supabase/client";
import type { WeddingGift } from "@/4-shared/types";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

/**
 * Fetch the wedding gift (if any) for a site, plus all translation fields (title/instructions...) for enabled languages.
 */
export async function fetchWeddingGiftBySite(
  siteId: string,
  enabledLangs: SupportedLanguage[] = ["en", "es", "ca"],
): Promise<
  | (WeddingGift & {
      title: Record<SupportedLanguage, string>;
      instructions: Record<SupportedLanguage, string>;
    })
  | null
> {
  if (!siteId) return null;
  const supabase = await createClient();

  // Step 1: Get the wedding gift row for this site (assuming only one per site)
  const { data, error } = await supabase
    .from("wedding_gift")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true }) // optional: pick lowest sort_order if multiple
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    // Not a hard error: treat as "not set up yet"
    return null;
  }

  const weddingGiftId = data.id;

  // Step 2: Compose i18n keys
  const titleKeys = enabledLangs.map((l) => ({
    locale: l,
    key: `wedding_gift.title.${weddingGiftId}`,
  }));
  const instructionsKeys = enabledLangs.map((l) => ({
    locale: l,
    key: `wedding_gift.instructions.${weddingGiftId}`,
  }));
  const wantedKeys = [...titleKeys, ...instructionsKeys];

  // Step 3: Fetch translations
  const { data: translations, error: tError } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", siteId)
    .in("locale", enabledLangs)
    .in(
      "key",
      wantedKeys.map((x) => x.key),
    );

  // Build lookup tables
  const title: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  const instructions: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;
  (translations ?? []).forEach((tr) => {
    if (tr.key.startsWith("wedding_gift.title.")) {
      title[tr.locale as SupportedLanguage] = tr.value;
    }
    if (tr.key.startsWith("wedding_gift.instructions.")) {
      instructions[tr.locale as SupportedLanguage] = tr.value;
    }
  });

  return {
    ...data,
    title, // i18n
    instructions, // i18n
  };
}
