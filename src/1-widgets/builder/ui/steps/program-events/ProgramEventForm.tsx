import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import type { ProgramEvent } from "@/4-shared/types";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { DateInput } from "@/4-shared/ui/builder/inputs/DateInput";
import { TimeInput } from "@/4-shared/ui/builder/inputs/TimeInput";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import type { RefObject } from "react";
import { getLanguageDisplay, type DayTagOption } from "./dayTags";

type ProgramEventFormProps = {
  editingId: string | null;
  form: Partial<ProgramEvent>;
  formRef: RefObject<HTMLDivElement | null>;
  translations: Record<string, string>;
  dayTags: DayTagOption[];
  defaultLang: string;
  languages: string[];
  weddingDayReferenceDate: string;
  saving: boolean;
  error: string | null;
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

export function ProgramEventForm({
  editingId,
  form,
  formRef,
  translations,
  dayTags,
  defaultLang,
  languages,
  weddingDayReferenceDate,
  saving,
  error,
  onUpdateFormField,
  onUpdateI18nField,
  onToggleFormMain,
}: ProgramEventFormProps) {
  return (
    <div ref={formRef} className="mt-4 border rounded p-4 bg-gray-50">
      <h4 className="font-medium">
        {editingId
          ? t(translations, "builder.program_events.form.edit", "Edit event")
          : t(
              translations,
              "builder.program_events.form.create",
              "Create event",
            )}
      </h4>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <label className="block text-xs text-gray-600">
            {t(translations, "builder.program_events.field.day", "Day")}
          </label>
          <div className="relative mt-1">
            <select
              value={form.day_tag ?? "wedding_day"}
              onChange={(e) =>
                onUpdateFormField(
                  "day_tag",
                  e.target.value as ProgramEvent["day_tag"],
                )
              }
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {dayTags.map((d) => (
                <option key={d.key ?? "wedding_day"} value={d.key ?? ""}>
                  {d.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              ▾
            </span>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[18rem_10rem] md:justify-end">
            <DateInput
              value={form.date ?? ""}
              onChange={(newDate: string) => onUpdateFormField("date", newDate)}
              label={t(
                translations,
                "builder.program_events.field.day",
                "Date",
              )}
              required
            />

            <TimeInput
              value={form.time ?? ""}
              onChange={(newTime: string) => onUpdateFormField("time", newTime)}
              label={t(
                translations,
                "builder.program_events.field.time",
                "Time",
              )}
              required
            />
          </div>
        </div>

        {form.day_tag === "wedding_day" && weddingDayReferenceDate && (
          <p className="text-xs text-gray-500 md:col-span-12">
            {interpolate(
              t(
                translations,
                "builder.program_events.hint.wedding_day_same_date",
                "Wedding Day events share one date. Use {date} for this event.",
              ),
              { date: weddingDayReferenceDate },
            )}
          </p>
        )}

        <div className="md:col-span-6">
          <BuilderTextInput
            label={t(
              translations,
              "builder.program_events.field.location_url",
              "Location URL (optional)",
            )}
            value={form.location_url ?? ""}
            onChange={(v) => onUpdateFormField("location_url", v)}
          />
        </div>
      </div>

      {form.day_tag === "wedding_day" && (
        <div className="mt-4">
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
            aria-label={t(
              translations,
              "builder.program_events.main_aria",
              "Mark as main event",
            )}
          />
          <div className="text-xs text-gray-500 mt-1">
            {t(
              translations,
              "builder.program_events.main.info",
              "Only one main event can be set for Wedding Day.",
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="font-medium">
          {t(
            translations,
            "builder.program_events.form.multi_language",
            "Multi-language fields",
          )}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {interpolate(
            t(
              translations,
              "builder.program_events.form.languages.info",
              "Fill fields for each site language. Default language ({defaultLang}) is required for Title and Location.",
            ),
            { defaultLang },
          )}
        </div>

        {languages.map((locale) => (
          <div key={locale} className="mt-2 border rounded p-3 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="font-semibold text-gray-800">
                {interpolate(
                  t(
                    translations,
                    "builder.program_events.form.language_fields_for",
                    "Fields for {language}",
                  ),
                  { language: getLanguageDisplay(locale) },
                )}
              </div>
              {locale === defaultLang && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {t(
                    translations,
                    "builder.program_events.form.default_language_badge",
                    "Default language",
                  )}
                </span>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2">
              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.title", "Title")}${locale === defaultLang ? ` ${t(translations, "builder.form.required", "(required)")}` : ""}`}
                value={
                  (form.title as Record<string, string> | undefined)?.[
                    locale
                  ] ?? ""
                }
                onChange={(v) => onUpdateI18nField("title", locale, v)}
              />

              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.location", "Location")}${locale === defaultLang ? ` ${t(translations, "builder.form.required", "(required)")}` : ""}`}
                value={
                  (form.location as Record<string, string> | undefined)?.[
                    locale
                  ] ?? ""
                }
                onChange={(v) => onUpdateI18nField("location", locale, v)}
              />

              <BuilderTextarea
                label={t(
                  translations,
                  "builder.program_events.field.description",
                  "Description (optional)",
                )}
                value={
                  (form.description as Record<string, string> | undefined)?.[
                    locale
                  ] ?? ""
                }
                onChange={(v) => onUpdateI18nField("description", locale, v)}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
