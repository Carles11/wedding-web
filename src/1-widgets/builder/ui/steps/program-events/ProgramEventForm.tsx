"use client";

import {
  SUPPORTED_LANGUAGE_LABELS,
  type SupportedLanguage,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType, ProgramEvent } from "@/4-shared/types";
import { BuilderFormCard, BuilderLangTabs } from "@/4-shared/ui/builder";
import { MultiLangInputsBanner } from "@/4-shared/ui/builder/BuilderLangMultilangInputsBanner";
import { MagicAIButton } from "@/4-shared/ui/builder/buttons/MagicAIButton";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { BuilderDropdownInput } from "@/4-shared/ui/builder/inputs/BuilderDropdownInput";
import { DateInput } from "@/4-shared/ui/builder/inputs/DateInput";
import { TimeInput } from "@/4-shared/ui/builder/inputs/TimeInput";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import { isValidURL } from "@/4-shared/utils/validations";
import type { RefObject } from "react";
import { type DayTagOption } from "./dayTags";

type ProgramEventFormProps = {
  editingId: string | null;
  form: Partial<ProgramEvent>;
  formRef: RefObject<HTMLDivElement | null>;
  translations: Record<string, string>;
  dayTags: DayTagOption[];
  defaultLang: SupportedLanguage;
  activeLang: SupportedLanguage;
  languages: SupportedLanguage[];
  planType: PlanType;
  siteId: string;
  weddingDayReferenceDate: string;
  saving: boolean;
  error: string | null;
  onChangeActiveLang: (lang: SupportedLanguage) => void;
  onUpdateFormField: <K extends keyof ProgramEvent>(
    key: K,
    value: ProgramEvent[K],
  ) => void;
  onUpdateI18nField: (
    field: keyof ProgramEvent,
    locale: string,
    value: string,
  ) => void;
  onToggleFormMain: (checked: boolean) => void;
};

export function ProgramEventForm(props: ProgramEventFormProps) {
  const {
    editingId,
    form,
    formRef,
    translations,
    dayTags,
    defaultLang,
    activeLang,
    languages,
    planType,
    weddingDayReferenceDate,
    saving,
    error,
    onChangeActiveLang,
    onUpdateFormField,
    onUpdateI18nField,
    onToggleFormMain,
    siteId,
  } = props;

  const locationUrl = form.location_url ?? "";
  const locationUrlError =
    locationUrl && !isValidURL(locationUrl)
      ? t(translations, "builder.program_events.error.url", "Invalid URL")
      : undefined;

  const formTitle = editingId
    ? t(translations, "builder.program_events.form.edit", "Edit event")
    : t(translations, "builder.program_events.form.create", "Create event");

  const dayLabel = t(translations, "builder.program_events.field.day", "Day");
  const dateLabel = t(
    translations,
    "builder.program_events.field.date",
    "Date",
  );

  const handleAIApply = (aiData: any) => {
    try {
      if (!aiData) return;
      Object.entries(aiData).forEach(([lang, fields]) => {
        if (!languages.includes(lang as SupportedLanguage)) return;
        if (typeof fields !== "object" || !fields) return;
        ["title", "location", "description"].forEach((field) => {
          const value = (fields as Record<string, string>)[field];
          if (value) {
            onUpdateI18nField(field as any, lang, value);
          }
        });
      });
      notify.success(
        translations["ai.content_applied"] ||
          "Content generated! Don't forget to save your changes.",
      );
    } catch (e) {
      notify.error("Failed to apply AI content");
    }
  };

  const currentContent = {
    title: form.title || {},
    location: form.location || {},
    description: form.description || {},
  };

  return (
    <div ref={formRef} className="mt-8">
      <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">{formTitle}</span>

      <BuilderFormCard title="" error={error}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex-1">
              <BuilderDropdownInput
                label={dayLabel}
                value={form.day_tag ?? "wedding_day"}
                options={dayTags.map((d) => ({
                  key: d.key ?? "wedding_day",
                  label: d.label,
                }))}
                onChange={(v) =>
                  onUpdateFormField("day_tag", v as ProgramEvent["day_tag"])
                }
                prominent
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {dateLabel} *
              </label>
              <DateInput
                value={form.date ?? ""}
                onChange={(newDate: string) =>
                  onUpdateFormField("date", newDate)
                }
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t(translations, "builder.program_events.field.time", "Time")} *
              </label>
              <TimeInput
                value={form.time ?? ""}
                onChange={(newTime: string) =>
                  onUpdateFormField("time", newTime)
                }
                required
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <BuilderTextInput
              label={t(
                translations,
                "builder.program_events.field.location_url",
                "Location URL (optional)",
              )}
              value={locationUrl}
              onChange={(v) => onUpdateFormField("location_url", v)}
              error={locationUrlError}
            />
          </div>

          {form.day_tag === "wedding_day" && (
            <div className="py-2 border-y border-gray-100 dark:border-gray-700">
              <Toggle
                checked={!!form.is_main_event}
                label={t(
                  translations,
                  "builder.program_events.main_event.label",
                  "Main event",
                )}
                id="main-event-toggle-form"
                disabled={saving}
                onChange={onToggleFormMain}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <BuilderLangTabs
                  languages={languages}
                  activeLang={activeLang}
                  defaultLang={defaultLang}
                  onChange={(langCode) =>
                    onChangeActiveLang(langCode as SupportedLanguage)
                  }
                  onSetDefault={() => undefined}
                  getLabel={(langCode) =>
                    SUPPORTED_LANGUAGE_LABELS[langCode as SupportedLanguage]
                  }
                  translations={translations}
                  programStep={true}
                />
              </div>
              <MagicAIButton
                siteId={siteId}
                planType={planType}
                languages={languages}
                currentValues={currentContent}
                context="Wedding Event Details"
                onApply={handleAIApply}
                translations={translations}
                lang={defaultLang}
              />
            </div>
            <MultiLangInputsBanner
              translations={translations}
              languages={languages}
              defaultLang={defaultLang}
            />

            <section className="grid grid-cols-1 gap-4">
              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.title", "Title")}${activeLang === defaultLang ? " *" : ""}`}
                value={
                  (form.title as Record<string, string>)?.[activeLang] ?? ""
                }
                onChange={(v) => onUpdateI18nField("title", activeLang, v)}
              />

              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.location", "Location")}${activeLang === defaultLang ? " *" : ""}`}
                value={
                  (form.location as Record<string, string>)?.[activeLang] ?? ""
                }
                onChange={(v) => onUpdateI18nField("location", activeLang, v)}
              />

              <BuilderTextarea
                label={t(
                  translations,
                  "builder.program_events.field.description",
                  "Description (optional)",
                )}
                value={
                  (form.description as Record<string, string>)?.[activeLang] ??
                  ""
                }
                onChange={(v) =>
                  onUpdateI18nField("description", activeLang, v)
                }
              />
            </section>
          </div>
        </div>
      </BuilderFormCard>
    </div>
  );
}
