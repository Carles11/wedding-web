import type { TranslationDictionary, WeddingGift } from "@/4-shared/types";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";
import SectionContainer from "@/4-shared/ui/tenant/section/SectionContainer";

type Props = {
  data: WeddingGift | null;
  translations: TranslationDictionary;
};

function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}

export default function WeddingGiftSection({ data, translations }: Props) {
  if (!data) return null;

  const hasBank =
    data.bank_account_iban ||
    data.bank_account_swift ||
    data.bank_account_holder ||
    data.bank_name;
  const hasPaypal = !!data.paypal_url;
  const hasBizum = !!data.bizum_phone;
  const hasVenmo = !!data.venmo_username;
  const hasGiftlist = !!data.giftlist_url;
  const hasHoneymoon = !!data.honeymoon_fund_url;
  const hasOther = data.other_method_url || data.other_method_desc;

  return (
    <SectionContainer
      id="gifts"
      heading={t(translations, "wedding_gift_section.heading", "Wedding Gift")}
      subtitle={t(
        translations,
        "wedding_gift_section.subtitle",
        "Let guests know how to make a contribution: fill out one or several options.",
      )}
      variant="muted"
      withDivider
      dividerMotive="flower2"
      dividerClassName="w-36 h-auto"
      dividerSize={120}
      dividerOpacity={0.055}
    >
      <div className="relative z-10 max-w-xl mx-auto grid grid-cols-1 gap-6">
        {hasBank && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border space-y-1">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              🏦 {t(translations, "wedding_gift.bank", "Bank Transfer")}
            </div>
            {data.bank_account_holder && <div>{data.bank_account_holder}</div>}
            {data.bank_name && <div>{data.bank_name}</div>}
            {data.bank_account_iban && (
              <div>
                <strong>{t(translations, "wedding_gift.iban", "IBAN")}:</strong>{" "}
                {data.bank_account_iban}
              </div>
            )}
            {data.bank_account_swift && (
              <div>
                <strong>
                  {t(translations, "wedding_gift.swift", "SWIFT/BIC")}:
                </strong>{" "}
                {data.bank_account_swift}
              </div>
            )}
          </div>
        )}
        {hasPaypal && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              💸 {t(translations, "wedding_gift.paypal", "PayPal")}
            </div>
            <UnderlinedLink
              href={data.paypal_url!}
              className="text-neutral-700"
              ariaLabel={`PayPal link`}
              thicknessClass="h-0.5"
              external
            >
              {t(translations, "wedding_gift.paypal.url", "PayPal URL")}
            </UnderlinedLink>
          </div>
        )}
        {(hasBizum || hasVenmo) && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              📱 {t(translations, "wedding_gift.mobile", "Bizum / Venmo")}
            </div>
            {hasBizum && (
              <div>
                <strong>
                  {t(translations, "wedding_gift.bizum_phone", "Bizum Phone")}:
                </strong>{" "}
                {data.bizum_phone}
              </div>
            )}
            {hasVenmo && (
              <div>
                <strong>
                  {t(
                    translations,
                    "wedding_gift.venmo_username",
                    "Venmo Username",
                  )}
                  :
                </strong>{" "}
                {data.venmo_username}
              </div>
            )}
          </div>
        )}
        {hasGiftlist && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              🎁{" "}
              {t(translations, "wedding_gift.giftlist", "Gift Registry/List")}
            </div>
            <UnderlinedLink
              href={data.giftlist_url!}
              className="text-neutral-700"
              ariaLabel={`Giftlist/Registry`}
              thicknessClass="h-0.5"
              external
            >
              {t(
                translations,
                "wedding_gift.giftlist.url",
                "Giftlist/Registry URL",
              )}
            </UnderlinedLink>
          </div>
        )}
        {hasHoneymoon && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              🌴 {t(translations, "wedding_gift.honeymoon", "Honeymoon Fund")}
            </div>
            <UnderlinedLink
              href={data.honeymoon_fund_url!}
              className="text-neutral-700"
              ariaLabel="Honeymoon Fund"
              thicknessClass="h-0.5"
              external
            >
              {t(
                translations,
                "wedding_gift.honeymoon.url",
                "Honeymoon Fund URL",
              )}
            </UnderlinedLink>
          </div>
        )}
        {hasOther && (
          <div className="p-4 bg-white/80 rounded-lg shadow-sm border">
            <div className="font-semibold mb-1 text-blue-800 flex items-center gap-2">
              ✨ {t(translations, "wedding_gift.other", "Other Options")}
            </div>
            {data.other_method_url && (
              <div>
                <UnderlinedLink
                  href={data.other_method_url!}
                  className="text-neutral-700"
                  ariaLabel="Other contribution option"
                  thicknessClass="h-0.5"
                  external
                >
                  {t(translations, "wedding_gift.other.url", "Option URL")}
                </UnderlinedLink>
              </div>
            )}
            {data.other_method_desc && (
              <div>
                <strong>
                  {t(
                    translations,
                    "wedding_gift.other.descfield",
                    "Option Description",
                  )}
                  :
                </strong>{" "}
                {data.other_method_desc}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
