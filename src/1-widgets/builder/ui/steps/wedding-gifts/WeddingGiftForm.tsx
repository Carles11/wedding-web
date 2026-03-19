import { t } from "@/4-shared/helpers/t";
import type { TranslationDictionary, WeddingGift } from "@/4-shared/types";
import { GiftMethodCard } from "@/4-shared/ui/builder";
import {
  BankIcon,
  GiftlistIcon,
  HoneymoonIcon,
  MobileIcon,
  OtherIcon,
  PaypalIcon,
} from "@/4-shared/ui/builder/icons/GiftMethodIcons";
import { BuilderTextInput } from "@/4-shared/ui/builder/inputs";

export type WeddingGiftFormErrors = Partial<Record<keyof WeddingGift, string>>;

export type WeddingGiftFormProps = {
  gift: Partial<WeddingGift>;
  errors: WeddingGiftFormErrors;
  translations: TranslationDictionary;
  onChange: (field: keyof WeddingGift, value: string) => void;
  disabled?: boolean;
};

export function WeddingGiftForm({
  gift,
  errors,
  translations,
  onChange,
  disabled,
}: WeddingGiftFormProps) {
  return (
    <>
      {/* ---- BANK TRANSFER GROUP ---- */}
      <GiftMethodCard
        icon={
          <BankIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.bank", "Bank Transfer") + " icon"
            }
          />
        }
        title={t(translations, "builder.gift.bank", "Bank Transfer")}
        description={t(
          translations,
          "builder.gift.bank.desc",
          "For classic bank transfers (SEPA, IBAN, SWIFT): guests will see these bank details.",
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BuilderTextInput
            label={t(translations, "builder.gift.iban", "IBAN")}
            value={gift.bank_account_iban ?? ""}
            onChange={(v) => onChange("bank_account_iban", v)}
            placeholder="DE00 0000 0000 0000 0000 00"
            autoComplete="off"
            error={errors.bank_account_iban}
            disabled={disabled}
          />
          <BuilderTextInput
            label={t(translations, "builder.gift.swift", "SWIFT/BIC")}
            value={gift.bank_account_swift ?? ""}
            onChange={(v) => onChange("bank_account_swift", v)}
            placeholder="SWIFT/BIC code"
            autoComplete="off"
            error={errors.bank_account_swift}
            disabled={disabled}
          />
          <BuilderTextInput
            label={t(translations, "builder.gift.holder", "Account Holder")}
            value={gift.bank_account_holder ?? ""}
            onChange={(v) => onChange("bank_account_holder", v)}
            placeholder={t(
              translations,
              "builder.gift.holder",
              "Account holder name",
            )}
            autoComplete="off"
            error={errors.bank_account_holder}
            disabled={disabled}
          />
          <BuilderTextInput
            label={t(translations, "builder.gift.bankname", "Bank Name")}
            value={gift.bank_name ?? ""}
            onChange={(v) => onChange("bank_name", v)}
            placeholder={t(
              translations,
              "builder.gift.bankname",
              "Deutsche Kreditbank",
            )}
            autoComplete="off"
            error={errors.bank_name}
            disabled={disabled}
          />
        </div>
      </GiftMethodCard>
      {/* ---- PAYPAL ---- */}
      <GiftMethodCard
        icon={
          <PaypalIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.paypal", "PayPal") + " icon"
            }
          />
        }
        title={t(translations, "builder.gift.paypal", "PayPal")}
        description={t(
          translations,
          "builder.gift.paypal.desc",
          "Guests can contribute with PayPal or payment card at this URL.",
        )}
      >
        <BuilderTextInput
          label={t(translations, "builder.gift.paypal.url", "PayPal URL")}
          type="url"
          value={gift.paypal_url ?? ""}
          onChange={(v) => onChange("paypal_url", v)}
          placeholder="https://paypal.me/guestgift"
          autoComplete="off"
          error={errors.paypal_url}
          disabled={disabled}
        />
      </GiftMethodCard>
      {/* ---- BIZUM & VENMO ---- */}
      <GiftMethodCard
        icon={
          <MobileIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.mobile", "Bizum / Venmo") + " icon"
            }
          />
        }
        title={t(translations, "builder.gift.mobile", "Bizum / Venmo")}
        description={t(
          translations,
          "builder.gift.mobile.desc",
          "Modern money transfer options for Spain (Bizum) or the US (Venmo).",
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BuilderTextInput
            label={t(translations, "builder.gift.bizum_phone", "Bizum Phone")}
            value={gift.bizum_phone ?? ""}
            onChange={(v) => onChange("bizum_phone", v)}
            placeholder="e.g. +34 611 222 333"
            autoComplete="off"
            error={errors.bizum_phone}
            disabled={disabled}
          />
          <BuilderTextInput
            label={t(
              translations,
              "builder.gift.venmo_username",
              "Venmo Username",
            )}
            value={gift.venmo_username ?? ""}
            onChange={(v) => onChange("venmo_username", v)}
            placeholder="@username"
            autoComplete="off"
            error={errors.venmo_username}
            disabled={disabled}
          />
        </div>
      </GiftMethodCard>
      {/* ---- GIFTLIST/REGISTRY ---- */}
      <GiftMethodCard
        icon={
          <GiftlistIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.giftlist", "Gift Registry/List") +
              " icon"
            }
          />
        }
        title={t(translations, "builder.gift.giftlist", "Gift Registry/List")}
        description={t(
          translations,
          "builder.gift.giftlist.desc",
          "Paste a URL from your preferred wedding registry (Amazon, El Corte Inglés, Etsy, etc).",
        )}
      >
        <BuilderTextInput
          label={t(
            translations,
            "builder.gift.giftlist.url",
            "Giftlist/Registry URL",
          )}
          type="url"
          value={gift.giftlist_url ?? ""}
          onChange={(v) => onChange("giftlist_url", v)}
          placeholder="https://yourregistry.com"
          autoComplete="off"
          error={errors.giftlist_url}
          disabled={disabled}
        />
      </GiftMethodCard>
      {/* ---- HONEYMOON FUND ---- */}
      <GiftMethodCard
        icon={
          <HoneymoonIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.honeymoon", "Honeymoon Fund") +
              " icon"
            }
          />
        }
        title={t(translations, "builder.gift.honeymoon", "Honeymoon Fund")}
        description={t(
          translations,
          "builder.gift.honeymoon.desc",
          "Link to a honeymoon fund platform (Zankyou, Honeyfund, etc) or detail your custom contribution page.",
        )}
      >
        <BuilderTextInput
          label={t(
            translations,
            "builder.gift.honeymoon.url",
            "Honeymoon Fund URL",
          )}
          type="url"
          value={gift.honeymoon_fund_url ?? ""}
          onChange={(v) => onChange("honeymoon_fund_url", v)}
          placeholder="https://your-honeymoonfund.com"
          autoComplete="off"
          error={errors.honeymoon_fund_url}
          disabled={disabled}
        />
      </GiftMethodCard>
      {/* ---- OTHER OPTIONS ---- */}
      <GiftMethodCard
        icon={
          <OtherIcon
            className="text-blue-700"
            aria-label={
              t(translations, "builder.gift.other", "Other Options") + " icon"
            }
          />
        }
        title={t(translations, "builder.gift.other", "Other Options")}
        description={t(
          translations,
          "builder.gift.other.desc",
          "Link to any other gift/contribution method, or describe alternatives here (e.g. charity, bring cash...).",
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BuilderTextInput
            label={t(translations, "builder.gift.other.url", "Option URL")}
            type="url"
            value={gift.other_method_url ?? ""}
            onChange={(v) => onChange("other_method_url", v)}
            placeholder="Other online contribution link"
            autoComplete="off"
            error={errors.other_method_url}
            disabled={disabled}
          />
          <BuilderTextInput
            label={t(
              translations,
              "builder.gift.other.descfield",
              "Option Description",
            )}
            value={gift.other_method_desc ?? ""}
            onChange={(v) => onChange("other_method_desc", v)}
            placeholder="E.g. Donate to charity, bring cash, etc"
            autoComplete="off"
            error={errors.other_method_desc}
            disabled={disabled}
          />
        </div>
      </GiftMethodCard>
    </>
  );
}
