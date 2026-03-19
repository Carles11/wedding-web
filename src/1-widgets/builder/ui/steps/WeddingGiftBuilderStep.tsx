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
import { PlanLimitNotice, UpgradeCTAModal } from "@/4-shared/ui/builder";
import {
  isValidIBAN,
  isValidPhone,
  isValidSWIFT,
  isValidURL,
  isValidVenmoUsername,
} from "@/4-shared/utils/validations/weddingGift";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  WeddingGiftForm,
  WeddingGiftFormErrors,
} from "./wedding-gifts/WeddingGiftForm";

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

  const [errors, setErrors] = useState<WeddingGiftFormErrors>({});

  const giftMethodLimit = getPlanLimit(planType, "weddingGiftMethods");

  function goToPricing() {
    // Use language-prefixed routing, not query param
    router.push(`/${lang || "en"}/pricing`);
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
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateGift(gift: Partial<WeddingGift>): WeddingGiftFormErrors {
    const errs: WeddingGiftFormErrors = {};
    // IBAN
    if (gift.bank_account_iban && !isValidIBAN(gift.bank_account_iban)) {
      errs.bank_account_iban = t(
        translations,
        "builder.gift.error.iban",
        "Invalid IBAN",
      );
    }
    // SWIFT
    if (gift.bank_account_swift && !isValidSWIFT(gift.bank_account_swift)) {
      errs.bank_account_swift = t(
        translations,
        "builder.gift.error.swift",
        "Invalid SWIFT/BIC",
      );
    }
    // PayPal URL
    if (gift.paypal_url && !isValidURL(gift.paypal_url)) {
      errs.paypal_url = t(
        translations,
        "builder.gift.error.url",
        "Invalid URL",
      );
    }
    // Bizum phone
    if (gift.bizum_phone && !isValidPhone(gift.bizum_phone)) {
      errs.bizum_phone = t(
        translations,
        "builder.gift.error.phone",
        "Invalid phone number",
      );
    }
    // Venmo username
    if (gift.venmo_username && !isValidVenmoUsername(gift.venmo_username)) {
      errs.venmo_username = t(
        translations,
        "builder.gift.error.venmo",
        "Invalid Venmo username",
      );
    }
    // Giftlist URL
    if (gift.giftlist_url && !isValidURL(gift.giftlist_url)) {
      errs.giftlist_url = t(
        translations,
        "builder.gift.error.url",
        "Invalid URL",
      );
    }
    // Honeymoon fund URL
    if (gift.honeymoon_fund_url && !isValidURL(gift.honeymoon_fund_url)) {
      errs.honeymoon_fund_url = t(
        translations,
        "builder.gift.error.url",
        "Invalid URL",
      );
    }
    // Other method URL
    if (gift.other_method_url && !isValidURL(gift.other_method_url)) {
      errs.other_method_url = t(
        translations,
        "builder.gift.error.url",
        "Invalid URL",
      );
    }
    return errs;
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const draftGift = gift ?? {};
    const validationErrors = validateGift(draftGift);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      notify.error(
        t(
          translations,
          "builder.general.form.error",
          "Please fix the errors above.",
        ),
      );
      return;
    }

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
          className="max-w-2xl bg-(--builder-color-muted-surface) p-6 space-y-5"
          onSubmit={handleSave}
        >
          <WeddingGiftForm
            gift={gift ?? {}}
            errors={errors}
            translations={translations}
            onChange={updateField}
            disabled={saving}
          />
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
