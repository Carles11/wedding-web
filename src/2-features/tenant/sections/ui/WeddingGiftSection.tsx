import type { TranslationDictionary, WeddingGift } from "@/4-shared/types";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";
import Heading from "@/4-shared/ui/commons/typography/Heading";
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

  const isPaypalEmail =
    data.paypal_url?.includes("@") && !data.paypal_url?.includes("/");

  return (
    <SectionContainer
      id="gifts"
      heading={t(
        translations,
        "wedding_gift_section.heading",
        "Wedding Registry",
      )}
      subtitle={t(
        translations,
        "wedding_gift_section.subtitle",
        "Your presence is the greatest gift, but should you wish to contribute, here are a few ways to do so.",
      )}
      variant="muted"
      withDivider
      dividerMotive="flower2"
      dividerClassName="w-36 h-auto opacity-10"
      dividerSize={120}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
        {/* BANK TRANSFER */}
        {hasBank && (
          <div className="flex flex-col space-y-3 p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400"
            >
              {t(translations, "wedding_gift.bank", "Bank Transfer")}
            </Heading>
            <div className="text-neutral-800 space-y-1">
              {data.bank_account_holder && (
                <p className="font-medium text-lg">
                  {data.bank_account_holder}
                </p>
              )}
              {data.bank_name && (
                <p className="text-sm opacity-70 italic">{data.bank_name}</p>
              )}
              <div className="pt-2 space-y-1 text-sm   tracking-tight">
                {data.bank_account_iban && (
                  <p>
                    <span className="block text-[10px] uppercase opacity-50 font-sans mb-0.5 tracking-normal">
                      {t(translations, "wedding_gift.iban", "IBAN")}
                    </span>
                    {data.bank_account_iban}
                  </p>
                )}
                {data.bank_account_swift && (
                  <p>
                    <span className="block text-[10px] uppercase opacity-50 font-sans mb-0.5 tracking-normal">
                      {t(translations, "wedding_gift.swift", "SWIFT / BIC")}
                    </span>
                    {data.bank_account_swift}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAYPAL */}
        {hasPaypal && (
          <div className="flex flex-col justify-center p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3"
            >
              {t(translations, "wedding_gift.paypal", "PayPal")}
            </Heading>
            {isPaypalEmail ? (
              <div className="space-y-1">
                <p className="text-xs opacity-60">
                  {t(
                    translations,
                    "wedding_gift.paypal.send_to",
                    "Send contributions to",
                  )}
                  :
                </p>
                <a
                  // Construct a real payment URL instead of just the email
                  href={`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(data.paypal_url ?? "")}&currency_code=EUR`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-neutral-800 hover:text-neutral-500 transition-colors"
                >
                  {/* We still show the email as the label so they know who they are paying */}
                  {data.paypal_url}
                </a>
              </div>
            ) : (
              <UnderlinedLink
                // Ensure the link has https://
                href={
                  data.paypal_url?.startsWith("http")
                    ? data.paypal_url
                    : `https://${data.paypal_url}`
                }
                className="text-neutral-800 text-lg font-medium"
                ariaLabel="PayPal link"
                thicknessClass="h-[1px]"
                external
              >
                {t(translations, "wedding_gift.paypal.cta", "Go to PayPal")}
              </UnderlinedLink>
            )}
          </div>
        )}

        {/* MOBILE PAYMENTS */}
        {(hasBizum || hasVenmo) && (
          <div className="flex flex-col justify-center p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4"
            >
              {t(translations, "wedding_gift.mobile", "Mobile Transfer")}
            </Heading>

            <div className="space-y-5">
              {hasBizum && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    {t(translations, "wedding_gift.bizum_phone", "Bizum")}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-neutral-800">
                      {data.bizum_phone}
                    </p>
                  </div>
                </div>
              )}

              {hasVenmo && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-50 mb-1">
                    {t(translations, "wedding_gift.venmo_username", "Venmo")}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-neutral-800">
                      @{data.venmo_username?.replace("@", "")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTRY / GIFTLIST */}
        {hasGiftlist && (
          <div className="flex flex-col justify-center p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3"
            >
              {t(translations, "wedding_gift.giftlist", "Registry")}
            </Heading>
            <UnderlinedLink
              href={data.giftlist_url!}
              className="text-neutral-800 text-lg font-medium"
              ariaLabel="Gift Registry"
              thicknessClass="h-[1px]"
              external
            >
              {t(translations, "wedding_gift.giftlist.cta", "View Gift List")}
            </UnderlinedLink>
          </div>
        )}

        {/* HONEYMOON */}
        {hasHoneymoon && (
          <div className="flex flex-col justify-center p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3"
            >
              {t(translations, "wedding_gift.honeymoon", "Honeymoon Fund")}
            </Heading>
            <UnderlinedLink
              href={data.honeymoon_fund_url!}
              className="text-neutral-800 text-lg font-medium"
              ariaLabel="Honeymoon Fund"
              thicknessClass="h-[1px]"
              external
            >
              {t(
                translations,
                "wedding_gift.honeymoon.cta",
                "Contribute to our trip",
              )}
            </UnderlinedLink>
          </div>
        )}

        {/* OTHER OPTIONS */}
        {hasOther && (
          <div className="flex flex-col justify-center p-6 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md md:col-span-2">
            <Heading
              as="h3"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3"
            >
              {t(translations, "wedding_gift.other", "Other Information")}
            </Heading>
            <div className="space-y-2">
              {data.other_method_desc && (
                <p className="text-neutral-700 leading-relaxed italic">
                  {data.other_method_desc}
                </p>
              )}
              {data.other_method_url && (
                <UnderlinedLink
                  href={data.other_method_url!}
                  className="text-neutral-800 font-medium"
                  ariaLabel="Other contribution option"
                  thicknessClass="h-[1px]"
                  external
                >
                  {t(
                    translations,
                    "wedding_gift.other.cta",
                    "More Information",
                  )}
                </UnderlinedLink>
              )}
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
