"use client";

import { StepLayout } from "@/1-widgets/builder/step-layout";
import {
  createWeddingGiftBySite,
  deleteWeddingGiftBySite,
  fetchWeddingGiftBySite,
  updateWeddingGiftBySite,
} from "@/3-entities/wedding_gifts/api/";
import { countWeddingGiftMethods } from "@/4-shared/helpers/billing/countWeddingGiftMethods";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  PlanType,
  Site,
  TranslationDictionary,
  WeddingGift,
} from "@/4-shared/types";
import {
  GiftMethodCard,
  PlanLimitNotice,
  UpgradeCTAModal,
} from "@/4-shared/ui/builder";
import { BuilderTextInput } from "@/4-shared/ui/builder/inputs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  site: Site;
  refresh?: () => void;
  lang: string;
  translations: TranslationDictionary;
  planType: PlanType;
  /** Fired when at least one payment method is saved (or cleared). */
  setHasData?: (hasData: boolean) => void;
};
export default function WeddingGiftBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setHasData,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const [gift, setGift] = useState<Partial<WeddingGift> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const giftMethodLimit = getPlanLimit(planType, "weddingGiftMethods");

  function goToPricing() {
    router.push(`/marketing/pricing?lang=${lang || "en"}`);
  }

  function giftSignature(row: Partial<WeddingGift> | null | undefined): string {
    if (!row) return "empty";

    return [
      row.id ?? "",
      row.updated_at ?? "",
      row.created_at ?? "",
      row.paypal_url ?? "",
      row.bank_account_iban ?? "",
      row.bank_account_swift ?? "",
      row.bank_account_holder ?? "",
      row.bank_name ?? "",
      row.bizum_phone ?? "",
      row.venmo_username ?? "",
      row.giftlist_url ?? "",
      row.honeymoon_fund_url ?? "",
      row.other_method_url ?? "",
      row.other_method_desc ?? "",
    ].join("|");
  }

  async function reconcileGift(
    requestId: number,
    baselineGift: Partial<WeddingGift> | null,
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = giftSignature(baselineGift);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextGift = await fetchWeddingGiftBySite(site.id);
      const safeNextGift = nextGift ?? null;
      const nextSignature = giftSignature(safeNextGift);

      if (nextSignature !== baselineSignature) {
        setGift(safeNextGift);
        baselineSignature = nextSignature;
      }
    }
  }

  useEffect(() => {
    if (!site?.id) return;
    let mounted = true;
    const requestId = ++fetchCounterRef.current;

    const load = async () => {
      setLoading(true);

      try {
        const row = await fetchWeddingGiftBySite(site.id);
        if (!mounted || fetchCounterRef.current !== requestId) return;

        const safeRow = row ?? null;
        setGift(safeRow);
        await reconcileGift(requestId, safeRow);
      } catch (err) {
        if (mounted && fetchCounterRef.current === requestId) {
          notify.error((err as Error).message);
        }
      } finally {
        if (mounted && fetchCounterRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [site?.id]);

  // Notify parent whether any payment method is configured
  useEffect(() => {
    if (gift === null) return; // not yet loaded
    setHasData?.(
      !!(
        gift.paypal_url ||
        gift.bank_account_iban ||
        gift.bizum_phone ||
        gift.venmo_username ||
        gift.giftlist_url ||
        gift.honeymoon_fund_url ||
        gift.other_method_url
      ),
    );
  }, [gift, setHasData]);

  function updateField(
    field: keyof WeddingGift,
    value: WeddingGift[keyof WeddingGift],
  ) {
    setGift((g) => ({ ...(g ?? {}), [field]: value }));
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const draftGift = gift ?? {};
    const methodsCount = countWeddingGiftMethods(draftGift);
    if (giftMethodLimit !== -1 && methodsCount > giftMethodLimit) {
      notify.error(
        interpolate(
          t(
            translations,
            "builder.gift.error.method_limit",
            "Free plan supports up to {limit} gift method. Upgrade to add more.",
          ),
          {
            limit: giftMethodLimit,
            FREE_WEDDING_GIFT_METHODS_LIMIT: giftMethodLimit,
          },
        ),
      );
      setShowUpgradeCTA(true);
      return;
    }

    setSaving(true);

    try {
      if (gift?.id) {
        // Update existing
        await updateWeddingGiftBySite(site.id, { data: gift ?? {} }, planType);
        setGift({ ...gift }); // Keep the updated object
      } else {
        // Create new
        const created = await createWeddingGiftBySite(
          site.id,
          gift ?? {},
          planType,
        );
        setGift(created); // Set the new object
      }
      notify.success(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );
    } catch (err) {
      notify.error((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!site?.id) return;
    const ok = await confirmDelete({
      title: t(translations, "builder.actions.delete", "Delete"),
      message: t(
        translations,
        "builder.gift.delete_confirm",
        "Delete wedding gift information for this site? This action cannot be undone.",
      ),
      confirmLabel: t(translations, "builder.actions.delete", "Delete"),
      cancelLabel: t(translations, "builder.actions.cancel", "Cancel"),
      tone: "danger",
    });
    if (!ok) return;

    setSaving(true);
    try {
      await deleteWeddingGiftBySite(site.id);
      setGift(null); // Clear the UI
      notify.success(
        translations["common.delete_success"] || "Deleted successfully.",
      );
    } catch (err) {
      notify.error((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  const hasPersistedGift = !!gift?.id;

  return (
    <StepLayout
      onNext={!loading ? handleSave : undefined}
      onBack={!loading ? handleDelete : undefined}
      nextDisabled={saving || loading}
      backDisabled={saving || loading || !hasPersistedGift}
      nextLoading={saving}
      nextLabel={t(translations, "builder.common.save", "Save")}
      backLabel={t(translations, "builder.gift.clear_all", "Clear all data")}
    >
      <div className="mb-4 text-md text-gray-600">
        {t(
          translations,
          "builder.gift.desc",
          "Let guests know how to make a contribution: fill out one or several options.",
        )}
      </div>
      {giftMethodLimit !== -1 && (
        <PlanLimitNotice
          message={interpolate(
            t(
              translations,
              "builder.gift.limit_info",
              "Free plan supports up to {limit} gift method.",
            ),
            {
              limit: giftMethodLimit,
              FREE_WEDDING_GIFT_METHODS_LIMIT: giftMethodLimit,
            },
          )}
          upgradeLabel={t(
            translations,
            "builder.general.form.upgrade",
            "Upgrade",
          )}
          onUpgrade={goToPricing}
        />
      )}
      {loading ? (
        <div>{t(translations, "builder.what_to_see.loading", "Loading…")}</div>
      ) : (
        <form
          className="max-w-2xl bg-gray-50 rounded-xl border p-6 space-y-5"
          onSubmit={handleSave}
        >
          {/* ---- BANK TRANSFER GROUP ---- */}
          <GiftMethodCard
            icon="🏦"
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
                value={gift?.bank_account_iban ?? ""}
                onChange={(v) => updateField("bank_account_iban", v)}
                placeholder="DE00 0000 0000 0000 0000 00"
                autoComplete="off"
              />
              <BuilderTextInput
                label={t(translations, "builder.gift.swift", "SWIFT/BIC")}
                value={gift?.bank_account_swift ?? ""}
                onChange={(v) => updateField("bank_account_swift", v)}
                placeholder="SWIFT/BIC code"
                autoComplete="off"
              />
              <BuilderTextInput
                label={t(translations, "builder.gift.holder", "Account Holder")}
                value={gift?.bank_account_holder ?? ""}
                onChange={(v) => updateField("bank_account_holder", v)}
                placeholder={t(
                  translations,
                  "builder.gift.holder",
                  "Account holder name",
                )}
                autoComplete="off"
              />
              <BuilderTextInput
                label={t(translations, "builder.gift.bankname", "Bank Name")}
                value={gift?.bank_name ?? ""}
                onChange={(v) => updateField("bank_name", v)}
                placeholder={t(
                  translations,
                  "builder.gift.bankname",
                  "Deutsche Kreditbank",
                )}
                autoComplete="off"
              />
            </div>
          </GiftMethodCard>
          {/* ---- PAYPAL ---- */}
          <GiftMethodCard
            icon="💸"
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
              value={gift?.paypal_url ?? ""}
              onChange={(v) => updateField("paypal_url", v)}
              placeholder="https://paypal.me/guestgift"
              autoComplete="off"
            />
          </GiftMethodCard>
          {/* ---- BIZUM & VENMO ---- */}
          <GiftMethodCard
            icon="📱"
            title={t(translations, "builder.gift.mobile", "Bizum / Venmo")}
            description={t(
              translations,
              "builder.gift.mobile.desc",
              "Modern money transfer options for Spain (Bizum) or the US (Venmo).",
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BuilderTextInput
                label={t(
                  translations,
                  "builder.gift.bizum_phone",
                  "Bizum Phone",
                )}
                value={gift?.bizum_phone ?? ""}
                onChange={(v) => updateField("bizum_phone", v)}
                placeholder="e.g. +34 611 222 333"
                autoComplete="off"
              />
              <BuilderTextInput
                label={t(
                  translations,
                  "builder.gift.venmo_username",
                  "Venmo Username",
                )}
                value={gift?.venmo_username ?? ""}
                onChange={(v) => updateField("venmo_username", v)}
                placeholder="@username"
                autoComplete="off"
              />
            </div>
          </GiftMethodCard>
          {/* ---- GIFTLIST/REGISTRY ---- */}
          <GiftMethodCard
            icon="🎁"
            title={t(
              translations,
              "builder.gift.giftlist",
              "Gift Registry/List",
            )}
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
              value={gift?.giftlist_url ?? ""}
              onChange={(v) => updateField("giftlist_url", v)}
              placeholder="https://yourregistry.com"
              autoComplete="off"
            />
          </GiftMethodCard>
          {/* ---- HONEYMOON FUND ---- */}
          <GiftMethodCard
            icon="🌴"
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
              value={gift?.honeymoon_fund_url ?? ""}
              onChange={(v) => updateField("honeymoon_fund_url", v)}
              placeholder="https://your-honeymoonfund.com"
              autoComplete="off"
            />
          </GiftMethodCard>
          {/* ---- OTHER OPTIONS ---- */}
          <GiftMethodCard
            icon="✨"
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
                value={gift?.other_method_url ?? ""}
                onChange={(v) => updateField("other_method_url", v)}
                placeholder="Other online contribution link"
                autoComplete="off"
              />
              <BuilderTextInput
                label={t(
                  translations,
                  "builder.gift.other.descfield",
                  "Option Description",
                )}
                value={gift?.other_method_desc ?? ""}
                onChange={(v) => updateField("other_method_desc", v)}
                placeholder="E.g. Donate to charity, bring cash, etc"
                autoComplete="off"
              />
            </div>
          </GiftMethodCard>
        </form>
      )}

      <UpgradeCTAModal
        open={showUpgradeCTA && planType === "free"}
        title={t(
          translations,
          "builder.gift.upgrade_title",
          "Unlock more gift methods",
        )}
        description={interpolate(
          t(
            translations,
            "builder.gift.upgrade_description",
            "Your current plan allows up to {limit} gift method. Upgrade to Premium to add multiple payment methods.",
          ),
          {
            limit: giftMethodLimit,
            FREE_WEDDING_GIFT_METHODS_LIMIT: giftMethodLimit,
          },
        )}
        cancelLabel={t(translations, "builder.general.form.cancel", "Cancel")}
        upgradeLabel={t(
          translations,
          "builder.general.form.upgrade",
          "Upgrade",
        )}
        onClose={() => setShowUpgradeCTA(false)}
        onUpgrade={goToPricing}
      />
      {confirmDialog}
    </StepLayout>
  );
}
