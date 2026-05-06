import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGE_LABELS } from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import type { WhatToSeeEntryFull } from "@/4-shared/types";
import { BuilderLangTabs } from "@/4-shared/ui/builder";
import { MultiLangInputsBanner } from "@/4-shared/ui/builder/BuilderLangMultilangInputsBanner";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { isValidURL } from "@/4-shared/utils/validations";

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
}: WhatToSeeFormProps) {
  const locationUrlError =
    form.location_url && !isValidURL(form.location_url)
      ? t(translations, "builder.what_to_see.error.url", "Invalid URL")
      : errors.location_url;

  return (
    <>
      <BuilderLangTabs
        languages={languages}
        activeLang={activeLang}
        defaultLang={defaultLang}
        onChange={(langCode) => onChangeActiveLang(langCode as SupportedLanguage)}
        onSetDefault={() => undefined}
        getLabel={(langCode) =>
          SUPPORTED_LANGUAGE_LABELS[langCode as SupportedLanguage] ?? langCode
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
        id={`whattosee-lang-panel-${activeLang}`}
        aria-label={SUPPORTED_LANGUAGE_LABELS[activeLang] ?? activeLang}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BuilderTextInput
            label={`${t(translations, "builder.what_to_see.field.name", "Name")}${activeLang === defaultLang ? " *" : ""}`}
            value={
              (form.name as Record<string, string> | undefined)?.[activeLang] ??
              ""
            }
            onChange={(v) => onChangeI18n("name", activeLang, v)}
            error={errors.name}
            autoComplete="off"
            disabled={disabled}
          />

          <BuilderTextarea
            label={t(
              translations,
              "builder.what_to_see.field.description",
              "Description",
            )}
            value={
              (form.description as Record<string, string> | undefined)?.[
                activeLang
              ] ?? ""
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
              value={
                (form.notes as Record<string, string> | undefined)?.[
                  activeLang
                ] ?? ""
              }
              onChange={(v) => onChangeI18n("notes", activeLang, v)}
              rows={2}
              disabled={disabled}
            />
          </div>
        </div>
      </section>

      <BuilderTextInput
        label={t(
          translations,
          "builder.what_to_see.field.location_url",
          "Location URL (Google Maps, etc)",
        )}
        value={form.location_url ?? ""}
        onChange={(v) => onChange("location_url", v)}
        placeholder="https://maps.example.com/location"
        autoComplete="off"
        error={locationUrlError}
        disabled={disabled}
      />
    </>
  );
}
