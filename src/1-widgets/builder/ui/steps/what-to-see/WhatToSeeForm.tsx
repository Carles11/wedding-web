import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGE_LABELS } from "@/4-shared/config/i18n";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import type { WhatToSeeEntryFull } from "@/4-shared/types";
import { BuilderLanguageCard } from "@/4-shared/ui/builder";
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
      {languages.map((locale) => (
        <BuilderLanguageCard
          key={locale}
          languageCode={
            SUPPORTED_LANGUAGE_LABELS[locale as SupportedLanguage] ?? locale
          }
          title={interpolate(
            t(
              translations,
              "builder.general.form.language_fields_for",
              "Fields for {language}",
            ),
            {
              language:
                SUPPORTED_LANGUAGE_LABELS[locale as SupportedLanguage] ??
                locale,
            },
          )}
          isDefault={locale === defaultLang}
          defaultBadgeLabel={t(
            translations,
            "builder.what_to_see.badge.default",
            "Default",
          )}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BuilderTextInput
              label={`${t(translations, "builder.what_to_see.field.name", "Name")}${locale === defaultLang ? " *" : ""}`}
              value={
                (form.name as Record<string, string> | undefined)?.[locale] ??
                ""
              }
              onChange={(v) => onChangeI18n("name", locale, v)}
              autoComplete="off"
            />

            <BuilderTextarea
              label={t(
                translations,
                "builder.what_to_see.field.description",
                "Description",
              )}
              value={
                (form.description as Record<string, string> | undefined)?.[
                  locale
                ] ?? ""
              }
              onChange={(v) => onChangeI18n("description", locale, v)}
              rows={2}
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
                    locale
                  ] ?? ""
                }
                onChange={(v) => onChangeI18n("notes", locale, v)}
                rows={2}
              />
            </div>
          </div>
        </BuilderLanguageCard>
      ))}

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
