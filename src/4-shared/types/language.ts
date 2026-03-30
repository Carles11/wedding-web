export type LanguageToggleProps = {
  activeLang: string;
  availableLangs: string[]; // e.g. ['es', 'ca']
  basePath?: string; // e.g. "", "/program", etc - defaults to ""
  className?: string;
};

/**
 * Props for LanguageSelector
 */
export interface LanguageSelectorProps {
  currentLang: string;
  label?: string;
  onLanguageChange: (lang: string) => void;
  preferencesTab?: boolean; // prop to indicate if we're in the preferences tab
}
