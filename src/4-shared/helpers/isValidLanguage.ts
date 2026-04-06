import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";

export function isValidLanguage(
  lang: string | undefined,
): lang is SupportedLanguage {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}
