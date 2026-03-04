import { createClient } from "@/4-shared/lib/supabase/client";
import type { WeddingGift } from "@/4-shared/types";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

type UpdateWeddingGiftOpts = {
  // Main non-i18n payment fields
  data: Partial<WeddingGift>;
  // i18n fields: translations by language
  title?: Partial<Record<SupportedLanguage, string>>;
  instructions?: Partial<Record<SupportedLanguage, string>>;
};

/**
 * Update the wedding gift block for a site.
 * Will update the wedding_gift row as well as translation keys in site_translations.
 */
export async function updateWeddingGiftBySite(
  siteId: string,
  opts: UpdateWeddingGiftOpts,
): Promise<void> {
  if (!siteId) throw new Error("Missing siteId");

  const supabase = await createClient();

  // Find the existing gift row (or upsert is possible here)
  const { data, error } = await supabase
    .from("wedding_gift")
    .select("id")
    .eq("site_id", siteId)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Wedding gift row not found");

  const giftId = data.id;

  const ALLOWED_COLUMNS = [
    "paypal_url",
    "bank_account_iban",
    "bank_account_swift",
    "bank_account_holder",
    "bank_name",
    "bizum_phone",
    "venmo_username",
    "giftlist_url",
    "honeymoon_fund_url",
    "other_method_url",
    "other_method_desc",
    "sort_order",
  ];

  const filteredData = Object.fromEntries(
    Object.entries(opts.data ?? {}).filter(([k]) =>
      ALLOWED_COLUMNS.includes(k),
    ),
  );

  // 1. Update main record
  if (filteredData && Object.keys(filteredData).length > 0) {
    const { error: upError } = await supabase
      .from("wedding_gift")
      .update(filteredData)
      .eq("id", giftId);
    if (upError) throw new Error(upError.message);
  }

  // 2. Update translations in site_translations
  const upserts: {
    key: string;
    locale: string;
    value: string;
    site_id: string;
  }[] = [];

  if (opts.title) {
    Object.entries(opts.title).forEach(([lang, value]) => {
      if (value)
        upserts.push({
          key: `wedding_gift.title.${giftId}`,
          locale: lang,
          value,
          site_id: siteId,
        });
    });
  }
  if (opts.instructions) {
    Object.entries(opts.instructions).forEach(([lang, value]) => {
      if (value)
        upserts.push({
          key: `wedding_gift.instructions.${giftId}`,
          locale: lang,
          value,
          site_id: siteId,
        });
    });
  }

  if (upserts.length > 0) {
    const { error: transError } = await supabase
      .from("site_translations")
      .upsert(upserts, { onConflict: "site_id,key,locale" });
    if (transError) throw new Error(transError.message);
  }
}
