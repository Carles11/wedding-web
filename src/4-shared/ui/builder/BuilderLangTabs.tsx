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
  if (languages.length <= 1) return null; // No need for tabs if only one language

  return (
    <div className="flex flex-wrap gap-1.5 mb-6 p-1 bg-gray-50 rounded-xl w-fit border border-gray-100">
      {languages.map((lang) => {
        const isActive = activeLang === lang;
        return (
          <button
            type="button"
            key={lang}
            className={`
              transition-all duration-200 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider
              ${
                isActive
                  ? "builder-lang-tab-active shadow-sm"
                  : "builder-lang-tab-idle hover:bg-white"
              }
            `}
            onClick={() => onChange(lang)}
          >
            {getLabel ? getLabel(lang) : lang}
          </button>
        );
      })}
    </div>
  );
}
