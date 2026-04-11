type BuilderLangTabsProps = {
  languages: string[];
  activeLang: string;
  defaultLang: string;
  onChange: (lang: string) => void;
  onSetDefault: (lang: string) => void;
  getLabel?: (lang: string) => string;
  translations: Record<string, string>;
};

export function BuilderLangTabs({
  languages,
  activeLang,
  defaultLang,
  onChange,
  onSetDefault,
  getLabel,
  translations,
}: BuilderLangTabsProps) {
  // if (languages.length <= 1) return null;
  return (
    <>
      <p className=" pt-6 pb-3 text-gray-500">
        {translations["builder.languages.tabs.edit_selection"] ??
          "Select to edit the fields for each language:"}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 rounded-xl w-fit border border-gray-100">
        {languages.map((lang) => {
          const isActive = activeLang === lang;
          const isDefault = defaultLang === lang;
          const label = getLabel ? getLabel(lang) : lang;

          return (
            <button
              type="button"
              key={lang}
              onClick={() => {
                if (isActive && !isDefault) {
                  onSetDefault(lang);
                } else if (!isActive) {
                  onChange(lang);
                }
              }}
              className={`
    group relative flex flex-col items-center gap-0.5 cursor-pointer
    transition-all duration-200 px-4 py-1.5 rounded-lg
    text-[11px] font-semibold uppercase tracking-wider min-w-[72px]
    ${
      isActive
        ? "bg-white text-gray-900 shadow-sm"
        : "bg-transparent text-gray-400 hover:bg-white hover:text-gray-700"
    }
  `}
            >
              <span className="flex items-center gap-1">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                )}
                {label}
              </span>

              {/* Always reserve the same space to avoid layout shift */}
              <span
                className={`
  text-[9px] font-medium normal-case tracking-normal leading-none
  transition-opacity duration-150
  ${
    isDefault
      ? "text-teal-600 opacity-100"
      : isActive
        ? "text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        : "opacity-0"
  }
`}
              >
                {isDefault ? "Default" : "Set as default"}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
