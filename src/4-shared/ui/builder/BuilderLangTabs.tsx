type BuilderLangTabsProps = {
  languages: string[];
  activeLang: string;
  onChange: (lang: string) => void;
  getLabel?: (lang: string) => string;
};

export function BuilderLangTabs({
  languages,
  activeLang,
  onChange,
  getLabel,
}: BuilderLangTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {languages.map((lang) => (
        <button
          type="button"
          key={lang}
          className={`px-3 py-1.5 rounded text-sm border ${
            activeLang === lang
              ? "builder-lang-tab-active"
              : "builder-lang-tab-idle"
          }`}
          onClick={() => onChange(lang)}
        >
          {getLabel ? getLabel(lang) : lang}
        </button>
      ))}
    </div>
  );
}
