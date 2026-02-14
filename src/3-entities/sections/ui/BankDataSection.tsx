import Image from "next/image";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import SectionContainer from "@/4-shared/ui/section/SectionContainer";
import UnderlinedLink from "@/4-shared/ui/link/UnderlinedLink";
import type { TranslationDictionary } from "@/4-shared/types";

interface BankAccount {
  iban?: string;
  swift?: string;
  holder?: string;
  bank_name?: string;
}

interface BankDataContent {
  bank_account?: BankAccount;
  paypal?: string;
  bizum?: string;
  other?: string;
}

interface BankDataSectionData {
  title?: string | Record<string, string>;
  subtitle?: string | Record<string, string>;
  content?: BankDataContent;
  background?:
    | {
        url?: string;
        alt?: string;
      }
    | string;
}

type BankDataSectionProps = {
  data: BankDataSectionData | null;
  lang: string;
  translations?: TranslationDictionary | null;
};

function normalizeBackground(raw?: BankDataSectionData["background"]) {
  if (!raw) return undefined;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as { url?: string; alt?: string };
    } catch {
      return undefined;
    }
  }
  return raw as { url?: string; alt?: string };
}

export default function BankDataSection({
  data,
  lang,
  translations,
}: BankDataSectionProps) {
  if (!data) return null;

  const title = getTextForLang(
    data.title as Record<string, string> | undefined,
    lang,
    translations?.["bank_details_title"] ?? "Bank Details",
  );

  const subtitle = getTextForLang(
    data.subtitle as Record<string, string> | undefined,
    lang,
    "",
  );

  const content = data.content ?? {};

  // Defensive parse of background
  const bg = normalizeBackground(data.background);
  const bgUrl = bg?.url;
  const bgAlt = bg?.alt ?? "";

  return (
    <div className="relative">
      {/* Background area */}
      {bgUrl ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute inset-0 w-screen h-full left-1/2 -translate-x-1/2 md:w-2/5 md:left-auto md:right-0 md:translate-x-0">
            <Image
              src={bgUrl}
              alt={bgAlt}
              fill
              sizes="100vw"
              className="object-cover object-center md:object-right"
              priority={false}
            />
            <div className="absolute inset-0 bg-white/75 md:bg-white/44" />
          </div>
        </div>
      ) : null}

      <SectionContainer
        id="bank-data"
        heading={title}
        headingId="bank-data-heading"
        subtitle={subtitle}
        variant="muted"
        imageBackground
        withDivider
        dividerMotive="flower2"
        dividerClassName="w-36 h-auto"
        dividerSize={120}
        dividerOpacity={0.055}
      >
        <div className="relative z-10">
          <div className="grid gap-4 md:grid-cols-1 max-w-md mx-auto">
            {content.bank_account && (
              <div className="p-4 bg-white/80 dark:bg-neutral-900/70 rounded-lg shadow-sm border">
                <div className="text-sm text-neutral-600 space-y-1">
                  {content.bank_account.holder && (
                    <div>{content.bank_account.holder}</div>
                  )}
                  {content.bank_account.bank_name && (
                    <div>{content.bank_account.bank_name}</div>
                  )}

                  {content.bank_account.iban && (
                    <div>
                      <strong>{translations?.["iban_label"] ?? "IBAN"}:</strong>{" "}
                      {content.bank_account.iban}
                    </div>
                  )}
                  {content.bank_account.swift && (
                    <div>
                      <strong>
                        {translations?.["swift_label"] ?? "SWIFT"}:
                      </strong>{" "}
                      {content.bank_account.swift}
                    </div>
                  )}
                </div>
              </div>
            )}
            {content.paypal && (
              <div className="p-4 bg-white/80 dark:bg-neutral-900/70 rounded-lg shadow-sm border">
                <div className="text-sm text-neutral-600">
                  <UnderlinedLink
                    href={content.paypal}
                    className="text-neutral-700"
                    ariaLabel={`PayPal link`}
                    thicknessClass="h-0.5"
                    external
                  >
                    <strong>
                      {translations?.["paypal_label"] ?? "PayPal"}
                    </strong>{" "}
                  </UnderlinedLink>
                </div>
              </div>
            )}
            {content.bizum && (
              <div className="p-4 bg-white/80 dark:bg-neutral-900/70 rounded-lg shadow-sm border">
                <div className="text-sm text-neutral-600">
                  <strong>{translations?.["bizum_label"] ?? "Bizum"}:</strong>{" "}
                  {content.bizum}
                </div>
              </div>
            )}
            {content.other && (
              <div className="p-4 bg-white/80 dark:bg-neutral-900/70 rounded-lg shadow-sm border">
                <div className="text-sm text-neutral-600">
                  <strong>{translations?.["other_label"] ?? "Other"}:</strong>{" "}
                  {content.other}
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
