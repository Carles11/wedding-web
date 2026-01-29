export type TranslationDictionary = Record<string, string>;

export interface TranslationRow {
  key: string;
  value: string;
}

export interface GlobalTranslationRow {
  key: string;
  locale: string;
  value: string;
}
