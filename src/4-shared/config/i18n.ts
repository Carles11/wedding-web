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
