import type { SupportedLanguage } from "@/4-shared/config/i18n";

export type DefaultLanguageValue = SupportedLanguage | "";

export function isSelectedDefaultLanguage(
  defaultLang: DefaultLanguageValue,
  languages: SupportedLanguage[],
): defaultLang is SupportedLanguage {
  return defaultLang !== "" && languages.includes(defaultLang);
}

export function getEffectiveBuilderLanguage(
  languages: SupportedLanguage[],
  defaultLang: DefaultLanguageValue,
  fallback: SupportedLanguage = "en",
): SupportedLanguage {
  if (isSelectedDefaultLanguage(defaultLang, languages)) {
    return defaultLang;
  }

  return languages[0] ?? fallback;
}

export function clearDefaultLanguageIfRemoved(
  removedLang: SupportedLanguage,
  currentDefault: DefaultLanguageValue,
): DefaultLanguageValue {
  return currentDefault === removedLang ? "" : currentDefault;
}
