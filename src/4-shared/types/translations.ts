export type TranslationDictionary = Record<string, string>;

export interface TranslationRow {
  key: string;
  value: string;
}

export interface GlobalTranslationRow {
  site_id?: string; // optional for global translations
  key: string;
  locale: string;
  value: string;
}
