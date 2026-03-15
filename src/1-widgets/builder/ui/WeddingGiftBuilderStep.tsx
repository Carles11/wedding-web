"use client";

import {
  createWeddingGiftBySite,
  deleteWeddingGiftBySite,
  fetchWeddingGiftBySite,
  updateWeddingGiftBySite,
} from "@/3-entities/wedding_gifts/api/";
import { countWeddingGiftMethods } from "@/4-shared/helpers/billing/countWeddingGiftMethods";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import type {
  PlanType,
  Site,
  TranslationDictionary,
  WeddingGift,
} from "@/4-shared/types";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
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
function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

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
      setError(null);

      try {
        const row = await fetchWeddingGiftBySite(site.id);
        if (!mounted || fetchCounterRef.current !== requestId) return;

        const safeRow = row ?? null;
        setGift(safeRow);
        await reconcileGift(requestId, safeRow);
      } catch (err) {
        if (mounted && fetchCounterRef.current === requestId) {
          setError((err as Error).message);
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
      setError(
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
    setError(null);
    setSuccess(false);

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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
    } catch (err) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!site?.id) return;
    const ok = window.confirm(
      t(
        translations,
        "builder.gift.delete_confirm",
        "Delete wedding gift information for this site? This action cannot be undone.",
      ),
    );
    if (!ok) return;

    setSaving(true);
    setError(null);
    try {
      await deleteWeddingGiftBySite(site.id);
      setGift(null); // Clear the UI
      setSuccess(false);
    } catch (err) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">
        {t(translations, "builder.nav.step.wedding_gift", "Wedding Gift")}
      </h3>
      <div className="mb-4 text-sm text-gray-600">
        {t(
          translations,
          "builder.gift.desc",
          "Let guests know how to make a contribution: fill out one or several options.",
        )}
      </div>
      {giftMethodLimit !== -1 && (
        <div className="mb-4 text-sm text-gray-600">
          {interpolate(
            t(
              translations,
              "builder.gift.limit_info",
              "Free plan supports up to {limit} gift method.",
            ),
            {
              limit: giftMethodLimit,
              FREE_WEDDING_GIFT_METHODS_LIMIT: giftMethodLimit,
            },
          )}{" "}
          <button className="underline text-blue-600" onClick={goToPricing}>
            {t(translations, "builder.general.form.upgrade", "Upgrade")}
          </button>
        </div>
      )}
      {loading ? (
        <div>{t(translations, "builder.what_to_see.loading", "Loading…")}</div>
      ) : (
        <form
          className="max-w-2xl bg-gray-50 rounded-xl border p-6 space-y-5"
          onSubmit={handleSave}
        >
          {/* ---- BANK TRANSFER GROUP ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🏦 {t(translations, "builder.gift.bank", "Bank Transfer")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.bank.desc",
                "For classic bank transfers (SEPA, IBAN, SWIFT): guests will see these bank details.",
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.iban", "IBAN")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.bank_account_iban ?? ""}
                  onChange={(e) =>
                    updateField("bank_account_iban", e.target.value)
                  }
                  placeholder="DE00 0000 0000 0000 0000 00"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.swift", "SWIFT/BIC")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.bank_account_swift ?? ""}
                  onChange={(e) =>
                    updateField("bank_account_swift", e.target.value)
                  }
                  placeholder="SWIFT/BIC code"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.holder", "Account Holder")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.bank_account_holder ?? ""}
                  onChange={(e) =>
                    updateField("bank_account_holder", e.target.value)
                  }
                  placeholder={t(
                    translations,
                    "builder.gift.holder",
                    "Account holder name",
                  )}
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.bankname", "Bank Name")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.bank_name ?? ""}
                  onChange={(e) => updateField("bank_name", e.target.value)}
                  placeholder={t(
                    translations,
                    "builder.gift.bankname",
                    "Deutsche Kreditbank",
                  )}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {/* ---- PAYPAL ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              💸 {t(translations, "builder.gift.paypal", "PayPal")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.paypal.desc",
                "Guests can contribute with PayPal or payment card at this URL.",
              )}
            </div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t(translations, "builder.gift.paypal.url", "PayPal URL")}
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              type="url"
              value={gift?.paypal_url ?? ""}
              onChange={(e) => updateField("paypal_url", e.target.value)}
              placeholder="https://paypal.me/guestgift"
              autoComplete="off"
            />
          </div>
          {/* ---- BIZUM & VENMO ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              📱 {t(translations, "builder.gift.mobile", "Bizum / Venmo")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.mobile.desc",
                "Modern money transfer options for Spain (Bizum) or the US (Venmo).",
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.bizum_phone", "Bizum Phone")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.bizum_phone ?? ""}
                  onChange={(e) => updateField("bizum_phone", e.target.value)}
                  placeholder="e.g. +34 611 222 333"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(
                    translations,
                    "builder.gift.venmo_username",
                    "Venmo Username",
                  )}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.venmo_username ?? ""}
                  onChange={(e) =>
                    updateField("venmo_username", e.target.value)
                  }
                  placeholder="@username"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {/* ---- GIFTLIST/REGISTRY ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🎁{t(translations, "builder.gift.giftlist", "Gift Registry/List")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.giftlist.desc",
                "Paste a URL from your preferred wedding registry (Amazon, El Corte Inglés, Etsy, etc).",
              )}
            </div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t(
                translations,
                "builder.gift.giftlist.url",
                "Giftlist/Registry URL",
              )}
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              type="url"
              value={gift?.giftlist_url ?? ""}
              onChange={(e) => updateField("giftlist_url", e.target.value)}
              placeholder="https://yourregistry.com"
              autoComplete="off"
            />
          </div>
          {/* ---- HONEYMOON FUND ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🌴 {t(translations, "builder.gift.honeymoon", "Honeymoon Fund")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.honeymoon.desc",
                "Link to a honeymoon fund platform (Zankyou, Honeyfund, etc) or detail your custom contribution page.",
              )}
            </div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t(
                translations,
                "builder.gift.honeymoon.url",
                "Honeymoon Fund URL",
              )}
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              type="url"
              value={gift?.honeymoon_fund_url ?? ""}
              onChange={(e) =>
                updateField("honeymoon_fund_url", e.target.value)
              }
              placeholder="https://your-honeymoonfund.com"
              autoComplete="off"
            />
          </div>
          {/* ---- OTHER OPTIONS ---- */}
          <div className="bg-white border p-4 rounded-xl shadow-xs mb-3">
            <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              ✨ {t(translations, "builder.gift.other", "Other Options")}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {t(
                translations,
                "builder.gift.other.desc",
                "Link to any other gift/contribution method, or describe alternatives here (e.g. charity, bring cash...).",
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(translations, "builder.gift.other.url", "Option URL")}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  type="url"
                  value={gift?.other_method_url ?? ""}
                  onChange={(e) =>
                    updateField("other_method_url", e.target.value)
                  }
                  placeholder="Other online contribution link"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t(
                    translations,
                    "builder.gift.other.descfield",
                    "Option Description",
                  )}
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={gift?.other_method_desc ?? ""}
                  onChange={(e) =>
                    updateField("other_method_desc", e.target.value)
                  }
                  placeholder="E.g. Donate to charity, bring cash, etc"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Error/Success */}
          {error && (
            <div className="text-red-600 py-2 italic text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-700 py-2 italic text-sm">✔ Saved!</div>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold ${
                saving ? "opacity-50 cursor-wait" : "hover:bg-blue-700"
              }`}
            >
              {saving
                ? t(translations, "builder.common.saving", "Saving…")
                : t(translations, "builder.common.save", "Save")}
            </button>
            <button
              type="button"
              disabled={saving}
              className={`px-4 py-2 rounded bg-red-100 text-red-700 text-sm font-semibold border border-red-300 ${
                saving ? "opacity-50 cursor-wait" : "hover:bg-red-200"
              }`}
              onClick={() => {
                if (
                  window.confirm(
                    t(
                      translations,
                      "builder.gift.delete_confirm",
                      "Delete wedding gift information for this site? This action cannot be undone.",
                    ),
                  )
                ) {
                  handleDelete();
                }
              }}
            >
              {t(translations, "builder.gift.clear_all", "Clear all data")}
            </button>
          </div>
        </form>
      )}

      <MainModal
        open={showUpgradeCTA && planType === "free"}
        title={t(
          translations,
          "builder.gift.upgrade_title",
          "Unlock more gift methods",
        )}
        onClose={() => setShowUpgradeCTA(false)}
      >
        <p className="text-sm text-gray-700 mb-5">
          {interpolate(
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
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            onClick={() => setShowUpgradeCTA(false)}
          >
            {t(translations, "builder.general.form.cancel", "Cancel")}
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
            onClick={goToPricing}
          >
            {t(translations, "builder.general.form.upgrade", "Upgrade")}
          </button>
        </div>
      </MainModal>
    </div>
  );
}
