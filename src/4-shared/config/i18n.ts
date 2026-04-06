export const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
  "ca",
  "ar",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const SUPPORTED_LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  zh: "中文",
  hi: "हिन्दी",
  es: "Español",
  ca: "Català",
  ar: "العربية",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ru: "Русский",
  it: "Italiano",
};

export const LANGUAGES_SELECTOR: {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag?: string;
}[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ca", name: "Català", nativeName: "Català", flag: "🇦🇩" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
];

export const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  ca: "ca_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  pt: "pt_PT",
  ru: "ru_RU",
  zh: "zh_CN",
  ar: "ar_AR",
  hi: "hi_IN",
};
/**
 * Maps simple ISO language codes to the full locale format required by OpenGraph.
 */
export function getOGLocale(lang: string): string {
  return OG_LOCALE_MAP[lang] || `${lang}_${lang.toUpperCase()}`;
}
