"use client";

import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import type {
  PlanType,
  Site,
  WhatToSeeEntryFull,
  WhatToSeeTranslation,
} from "@/4-shared/types";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  createWhatToSeeEntry,
  deleteWhatToSeeEntry,
  fetchWhatToSeeEntries,
  updateWhatToSeeEntry,
} from "@/3-entities/what_to_see/api";
import {
  canUseQuota,
  getPlanLimit,
} from "@/4-shared/helpers/billing/entitlements";
import { t } from "@/4-shared/helpers/t";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { getEffectiveBuilderLanguage } from "@/4-shared/lib/builder-language/defaultLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
import {
  BuilderButton,
  BuilderFormCard,
  PlanLimitNotice,
  UpgradeCTAModal,
} from "@/4-shared/ui/builder";
import { useRouter } from "next/navigation";
import { StepLayout } from "../../step-layout";
import { WhatToSeeForm } from "./what-to-see/WhatToSeeForm";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  setItemCount?: (count: number) => void;
};

export default function WhatToSeeBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setItemCount,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const [items, setItems] = useState<WhatToSeeEntryFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

  const whatToSeeLimit = getPlanLimit(planType, "whatToSee");

  // Logic for languages
  const languages = useMemo<SupportedLanguage[]>(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? (site.languages as SupportedLanguage[])
      : [(site.default_lang as SupportedLanguage | null) ?? "en"];
  }, [site?.default_lang, site?.languages]);

  const defaultLang = useMemo(() => {
    const candidate =
      site?.default_lang &&
      languages.includes(site.default_lang as SupportedLanguage)
        ? (site.default_lang as SupportedLanguage)
        : "";
    return getEffectiveBuilderLanguage(languages, candidate);
  }, [languages, site?.default_lang]);

  const [activeLang, setActiveLang] = useState<SupportedLanguage>(defaultLang);

  // Sync logic
  function itemsSignature(rows: WhatToSeeEntryFull[]): string {
    return rows
      .map(
        (row) => `${row.id}:${row.sort_order ?? ""}:${row.location_url ?? ""}`,
      )
      .join("|");
  }

  async function reconcileItems(
    requestId: number,
    baselineRows: WhatToSeeEntryFull[],
    maxAttempts = 3,
  ) {
    if (!site?.id) return;
    let baselineSignature = itemsSignature(baselineRows);
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;
      const nextRows = await fetchWhatToSeeEntries(site.id);
      const safeNextRows = nextRows ?? [];
      const nextSignature = itemsSignature(safeNextRows);
      if (nextSignature !== baselineSignature) {
        setItems(safeNextRows);
        baselineSignature = nextSignature;
      }
    }
  }

  useEffect(() => {
    if (!site?.id) return;
    let mounted = true;
    const requestId = ++fetchCounterRef.current;
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await fetchWhatToSeeEntries(site.id);
        if (!mounted || fetchCounterRef.current !== requestId) return;
        const safeRows = rows ?? [];
        setItems(safeRows);
        await reconcileItems(requestId, safeRows);
      } catch (err: unknown) {
        if (mounted && fetchCounterRef.current === requestId) {
          setError((err as Error)?.message ?? String(err));
        }
      } finally {
        if (mounted && fetchCounterRef.current === requestId) {
          setLoading(false);
        }
      }
    };
    loadInitial();
    return () => {
      mounted = false;
    };
  }, [site?.id, defaultLang, languages.join("|")]);

  useEffect(() => {
    setItemCount?.(items.length);
  }, [items.length, setItemCount]);

  function canAddMore() {
    return canUseQuota(planType, "whatToSee", items.length);
  }

  function goToPricing() {
    router.push(`/${lang || "en"}/pricing`);
  }

  const [form, setForm] = useState<Partial<WhatToSeeEntryFull>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function startCreate() {
    setEditingId(null);
    setForm({ name: {}, description: {}, notes: {}, location_url: "" });
    setActiveLang(getEffectiveBuilderLanguage(languages, defaultLang));
    setCollapsed(true);
    scrollToForm();
  }

  function startEdit(it: WhatToSeeEntryFull) {
    setEditingId(it.id);
    setForm({ ...it });
    setActiveLang(getEffectiveBuilderLanguage(languages, defaultLang));
    setCollapsed(true);
    scrollToForm();
  }

  function updateI18n(
    field: keyof WhatToSeeEntryFull,
    lang: string,
    value: string,
  ) {
    setForm((s) => {
      const prev = (s?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...s,
        [field]: { ...prev, [lang]: value },
      } as Partial<WhatToSeeEntryFull>;
    });
  }

  function updateField(field: keyof WhatToSeeEntryFull, value: any) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function handleSave() {
    if (!site?.id) return;
    setSaving(true);
    setError(null);
    try {
      const i18nFields = [
        { formKey: "name", dbKey: "title" },
        { formKey: "description", dbKey: "description" },
        { formKey: "notes", dbKey: "notes" },
      ] as const;

      const translationsDB: WhatToSeeTranslation[] = i18nFields.flatMap(
        ({ formKey, dbKey }) =>
          Object.entries((form[formKey] as Record<string, string>) ?? {}).map(
            ([locale, value]) => ({
              key: dbKey,
              locale,
              value,
            }),
          ),
      );

      if (editingId) {
        const updated = await updateWhatToSeeEntry(
          site.id,
          editingId,
          { location_url: form.location_url },
          translationsDB,
        );
        if (updated) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === updated.id
                ? {
                    ...updated,
                    name: form.name ?? {},
                    description: form.description ?? {},
                    notes: form.notes ?? {},
                  }
                : it,
            ),
          );
          notify.success(
            translations["builder.general.form.save_success"] ||
              "Saved successfully.",
          );
        }
      } else {
        const created = await createWhatToSeeEntry(
          { site_id: site.id, location_url: form.location_url ?? null },
          translationsDB,
        );
        if (created) {
          setItems((prev) => [
            ...prev,
            {
              ...created,
              name: form.name ?? {},
              description: form.description ?? {},
              notes: form.notes ?? {},
            },
          ]);
          notify.success(
            translations["builder.general.form.save_success"] ||
              "Saved successfully.",
          );
        }
      }
      setForm({});
      setEditingId(null);
      setCollapsed(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirmDelete({
      title: t(translations, "builder.actions.delete", "Delete"),
      message: t(
        translations,
        "builder.what_to_see.confirm.delete",
        "Delete this entry?",
      ),
      confirmLabel: t(translations, "builder.actions.delete", "Delete"),
      cancelLabel: t(translations, "builder.actions.cancel", "Cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setSaving(true);
    const success = await deleteWhatToSeeEntry(site?.id ?? "", id);
    if (success) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      notify.success(
        translations["common.delete_success"] || "Deleted successfully.",
      );
    }
    setSaving(false);
  }

  const isUnlimited = whatToSeeLimit === -1;

  return (
    <StepLayout
      translations={translations}
      onNext={
        editingId !== null || Object.keys(form).length > 0
          ? handleSave
          : undefined
      }
      nextLoading={saving}
      nextDisabled={saving}
      nextLabel={t(translations, "builder.what_to_see.save_button", "Save")}
      onBack={
        editingId !== null || Object.keys(form).length > 0
          ? () => {
              setForm({});
              setEditingId(null);
              setCollapsed(false);
            }
          : undefined
      }
      backLabel={t(translations, "builder.what_to_see.cancel_button", "Cancel")}
    >
      <div className="mb-3 flex items-center justify-end">
        <BuilderButton
          variant="primary"
          size="sm"
          onClick={() =>
            !canAddMore()
              ? planType === "free" && setShowUpgradeCTA(true)
              : startCreate()
          }
          disabled={!canAddMore()}
        >
          {t(translations, "builder.what_to_see.add_button", "+ Add place")}
        </BuilderButton>
      </div>

      <div className="text-gray-600 dark:text-gray-400 mb-4">
        {isUnlimited
          ? translations["builder.what_to_see.limit_info_unlimited"] ||
            "With your Premium plan, add as many as you like."
          : interpolate(
              translations["builder.what_to_see.limit_info"] ||
                "Add up to {limit} places.",
              { limit: whatToSeeLimit },
            )}
      </div>

      {!collapsed && items.length > 0 && (
        <div className="space-y-2 mb-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="border rounded-lg p-3 flex justify-between items-start bg-white dark:bg-gray-800"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {(typeof it.name === "string"
                    ? it.name
                    : it.name?.[defaultLang]) || "(no name)"}
                </div>
              </div>
              <div className="flex gap-2">
                <BuilderButton
                  variant="secondary"
                  size="sm"
                  onClick={() => startEdit(it)}
                >
                  Edit
                </BuilderButton>
                <BuilderButton
                  variant="secondary"
                  tone="danger"
                  size="sm"
                  onClick={() => handleDelete(it.id)}
                >
                  Delete
                </BuilderButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editingId !== null || Object.keys(form).length > 0) && (
        <div ref={formRef}>
          <BuilderFormCard
            title={
              editingId
                ? t(translations, "builder.what_to_see.form.edit", "Edit place")
                : t(
                    translations,
                    "builder.what_to_see.form.create",
                    "Create place",
                  )
            }
            error={error}
          >
            <WhatToSeeForm
              form={form}
              errors={formErrors}
              languages={languages}
              defaultLang={defaultLang}
              activeLang={activeLang}
              onChangeActiveLang={setActiveLang}
              translations={translations}
              onChange={updateField}
              onChangeI18n={updateI18n}
              disabled={saving}
              siteId={site?.id || ""}
              planType={planType}
            />
          </BuilderFormCard>
        </div>
      )}

      {!canAddMore() && (
        <PlanLimitNotice
          message={interpolate(
            t(
              translations,
              "builder.what_to_see.limit_reached",
              `Free plan limit reached (${whatToSeeLimit}).`,
            ),
            { limit: whatToSeeLimit },
          )}
          upgradeLabel="Upgrade"
          onUpgrade={goToPricing}
        />
      )}

      <UpgradeCTAModal
        open={showUpgradeCTA && planType === "free"}
        title={
          translations["builder.what_to_see.upgrade_title"] ||
          "Need to add more places?"
        }
        description={
          translations["builder.what_to_see.upgrade_description"] ||
          "Upgrade to Premium to add as many as you like."
        }
        onClose={() => setShowUpgradeCTA(false)}
        onUpgrade={goToPricing}
      />
      {confirmDialog}
    </StepLayout>
  );
}
