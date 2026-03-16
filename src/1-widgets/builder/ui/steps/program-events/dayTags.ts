import {
  SUPPORTED_LANGUAGE_LABELS,
  type SupportedLanguage,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import type { ProgramEvent } from "@/4-shared/types";

export type DayTagOption = {
  key: ProgramEvent["day_tag"];
  label: string;
};

export function getLanguageDisplay(lang: string): string {
  const label = SUPPORTED_LANGUAGE_LABELS[lang as SupportedLanguage];
  return label ? `${label} (${lang})` : lang;
}

export function getDayTags(
  translations: Record<string, string>,
): DayTagOption[] {
  return [
    {
      key: "day_before",
      label: t(
        translations,
        "builder.program_events.day_before",
        "Before Wedding Day",
      ),
    },
    {
      key: "wedding_day",
      label: t(
        translations,
        "builder.program_events.wedding_day",
        "Wedding Day",
      ),
    },
    {
      key: "day_after",
      label: t(
        translations,
        "builder.program_events.day_after",
        "After Wedding Day",
      ),
    },
  ];
}
