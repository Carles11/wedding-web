import {
  SUPPORTED_LANGUAGE_LABELS,
  type SupportedLanguage,
} from "@/4-shared/config/i18n";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import type { PlanType, ProgramEvent } from "@/4-shared/types";
import { BuilderFormCard, BuilderLangTabs } from "@/4-shared/ui/builder";
import { MultiLangInputsBanner } from "@/4-shared/ui/builder/BuilderLangMultilangInputsBanner";
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
import { getLanguageDisplay, type DayTagOption } from "./dayTags";

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

export function ProgramEventForm({
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
}: ProgramEventFormProps) {
  // URL validation for location_url
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

  return (
    <div ref={formRef}>
      <BuilderFormCard title={formTitle} error={error}>
        {/* Responsive row for Day, Date, Time */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          {/* Day select */}
          <div className="flex-1 min-w-0 flex flex-col">
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
          {/* Date input */}
          <div className="flex-1 min-w-0 flex flex-col">
            <label className="block text-xs text-gray-600 mb-1">
              {dateLabel} *
            </label>
            <DateInput
              value={form.date ?? ""}
              onChange={(newDate: string) => onUpdateFormField("date", newDate)}
              required
            />
            {form.day_tag === "wedding_day" &&
              weddingDayReferenceDate &&
              form.date &&
              form.date !== weddingDayReferenceDate && (
                <p className="mt-1 text-xs text-amber-600">
                  {t(
                    translations,
                    "builder.program_events.hint.date_will_update_all",
                    "Saving will update all Wedding Day events to this date.",
                  )}
                </p>
              )}
          </div>
          {/* Time input */}
          <div className="flex-1 min-w-0 flex flex-col">
            <label className="block text-xs text-gray-600 mb-1">
              {t(translations, "builder.program_events.field.time", "Time")} *
            </label>
            <TimeInput
              value={form.time ?? ""}
              onChange={(newTime: string) => onUpdateFormField("time", newTime)}
              required
            />
          </div>
        </div>

        {/* All other fields below the row */}

        {form.day_tag === "wedding_day" && weddingDayReferenceDate && (
          <p className="text-xs text-gray-500 mt-2">
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

        <div className="mt-2 md:w-1/2">
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
          <div>
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
            <div className="mt-1 text-xs text-gray-500">
              {t(
                translations,
                "builder.program_events.main.info",
                "Only one main event can be set for Wedding Day.",
              )}
            </div>
          </div>
        )}

        <div>
          {/* <BuilderLangPills
            languages={languages}
            planType={planType}
            onToggle={() => undefined}
            onLockedClick={() => undefined}
            readOnly
            translations={translations}
          /> */}

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

          <MultiLangInputsBanner
            translations={translations}
            languages={languages}
            defaultLang={defaultLang}
          />

          <section
            role="tabpanel"
            id={`program-lang-panel-${activeLang}`}
            aria-label={getLanguageDisplay(activeLang)}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-2">
              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.title", "Title")}${activeLang === defaultLang ? ` ${t(translations, "builder.form.required", "(required)")}` : ""}`}
                value={
                  (form.title as Record<string, string> | undefined)?.[
                    activeLang
                  ] ?? ""
                }
                onChange={(v) => onUpdateI18nField("title", activeLang, v)}
              />

              <BuilderTextInput
                label={`${t(translations, "builder.program_events.field.location", "Location")}${activeLang === defaultLang ? ` ${t(translations, "builder.form.required", "(required)")}` : ""}`}
                value={
                  (form.location as Record<string, string> | undefined)?.[
                    activeLang
                  ] ?? ""
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
                  (form.description as Record<string, string> | undefined)?.[
                    activeLang
                  ] ?? ""
                }
                onChange={(v) =>
                  onUpdateI18nField("description", activeLang, v)
                }
              />
            </div>
          </section>
        </div>
      </BuilderFormCard>
    </div>
  );
}
