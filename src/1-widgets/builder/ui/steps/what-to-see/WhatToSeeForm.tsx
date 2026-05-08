"use client";

import { AIPromptModal } from "@/2-features/builder/ai-orchestrator/ui/AIPromptModal";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGE_LABELS } from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType, WhatToSeeEntryFull } from "@/4-shared/types";
import { BuilderButton, BuilderLangTabs } from "@/4-shared/ui/builder";
import { MultiLangInputsBanner } from "@/4-shared/ui/builder/BuilderLangMultilangInputsBanner";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { isValidURL } from "@/4-shared/utils/validations";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export type WhatToSeeFormErrors = Partial<Record<string, string>>;

export type WhatToSeeFormProps = {
  form: Partial<WhatToSeeEntryFull>;
  errors: WhatToSeeFormErrors;
  languages: string[];
  defaultLang: string;
  activeLang: SupportedLanguage;
  onChangeActiveLang: (lang: SupportedLanguage) => void;
  translations: Record<string, string>;
  onChange: (field: keyof WhatToSeeEntryFull, value: any) => void;
  onChangeI18n: (
    field: keyof WhatToSeeEntryFull,
    lang: string,
    value: string,
  ) => void;
  disabled?: boolean;
  siteId: string;
  planType: PlanType;
};

export function WhatToSeeForm({
  form,
  errors,
  languages,
  defaultLang,
  activeLang,
  onChangeActiveLang,
  translations,
  onChange,
  onChangeI18n,
  disabled,
  siteId,
  planType,
}: WhatToSeeFormProps) {
  const [showAIModal, setShowAIModal] = useState(false);

  // AI Assist handler
  const handleAIApply = (aiData: any) => {
    try {
      if (!aiData) return;

      Object.entries(aiData).forEach(([lang, fields]) => {
        // Ensure we only apply translations to languages currently enabled for this site
        if (!languages.includes(lang)) return;

        if (typeof fields !== "object" || !fields) return;

        // Map AI keys to form fields (Title in AI = Name in Form)
        const fieldMapping: Record<string, string> = {
          title: "name",
          description: "description",
          notes: "notes",
        };

        Object.entries(fieldMapping).forEach(([aiKey, formKey]) => {
          if ((fields as any)[aiKey]) {
            onChangeI18n(
              formKey as keyof WhatToSeeEntryFull,
              lang,
              (fields as any)[aiKey],
            );
          }
        });
      });

      notify.success(
        translations["ai.content_applied"] || "AI content applied!",
      );
    } catch (e) {
      console.error("AI Apply Error:", e);
      notify.error("Failed to apply AI content");
    }
    setShowAIModal(false);
  };

  const currentContent = {
    title: form.name || {}, // WhatToSee uses 'name' in state but 'title' in DB/AI
    description: form.description || {},
    notes: form.notes || {},
  };

  const locationUrlError =
    form.location_url && !isValidURL(form.location_url)
      ? t(translations, "builder.what_to_see.error.url", "Invalid URL")
      : errors.location_url;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg text-gray-700">
          {t(translations, "builder.what_to_see.form.details", "Place Details")}
        </span>
        <BuilderButton
          size="sm"
          variant="secondary"
          onClick={() => {
            if (planType === "free") {
              notify.info("Upgrade your plan to use AI Assist.");
              return;
            }
            setShowAIModal(true);
          }}
          disabled={disabled}
        >
          <Sparkles className="w-4 h-4 mr-1 text-emerald-500" /> AI Assist
        </BuilderButton>
      </div>

      <BuilderLangTabs
        languages={languages as SupportedLanguage[]}
        activeLang={activeLang}
        defaultLang={defaultLang as SupportedLanguage}
        onChange={(langCode) =>
          onChangeActiveLang(langCode as SupportedLanguage)
        }
        onSetDefault={() => undefined}
        getLabel={(langCode) =>
          SUPPORTED_LANGUAGE_LABELS[langCode as SupportedLanguage] ?? langCode
        }
        translations={translations}
      />

      <MultiLangInputsBanner
        translations={translations}
        languages={languages as SupportedLanguage[]}
        defaultLang={defaultLang as SupportedLanguage}
      />

      <section className="space-y-4 mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BuilderTextInput
            label={`${t(translations, "builder.what_to_see.field.name", "Name")}${activeLang === defaultLang ? " *" : ""}`}
            value={(form.name as Record<string, string>)?.[activeLang] ?? ""}
            onChange={(v) => onChangeI18n("name", activeLang, v)}
            error={errors.name}
            disabled={disabled}
          />

          <BuilderTextarea
            label={t(
              translations,
              "builder.what_to_see.field.description",
              "Description",
            )}
            value={
              (form.description as Record<string, string>)?.[activeLang] ?? ""
            }
            onChange={(v) => onChangeI18n("description", activeLang, v)}
            rows={2}
            disabled={disabled}
          />

          <div className="sm:col-span-2">
            <BuilderTextarea
              label={t(
                translations,
                "builder.what_to_see.field.notes",
                "Notes",
              )}
              value={(form.notes as Record<string, string>)?.[activeLang] ?? ""}
              onChange={(v) => onChangeI18n("notes", activeLang, v)}
              rows={2}
              disabled={disabled}
            />
          </div>
        </div>

        <BuilderTextInput
          label={t(
            translations,
            "builder.what_to_see.field.location_url",
            "Location URL (Google Maps)",
          )}
          value={form.location_url ?? ""}
          onChange={(v) => onChange("location_url", v)}
          placeholder="https://maps.google.com/..."
          error={locationUrlError}
          disabled={disabled}
        />
      </section>

      {showAIModal && (
        <AIPromptModal
          siteId={siteId}
          languages={languages as SupportedLanguage[]}
          currentContent={currentContent}
          context="Tourist recommendation for wedding guests"
          onClose={() => setShowAIModal(false)}
          onSuccess={handleAIApply}
          translations={translations}
        />
      )}
    </>
  );
}
