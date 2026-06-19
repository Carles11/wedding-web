import type { KeyboardEvent } from "react";

type BuilderLangTabsProps = {
  languages: string[];
  activeLang: string;
  defaultLang: string;
  onChange: (lang: string) => void;
  onSetDefault: (lang: string) => void;
  getLabel?: (lang: string) => string;
  translations: Record<string, string>;
  programStep?: boolean;
};

export function BuilderLangTabs({
  languages,
  activeLang,
  defaultLang,
  onChange,
  onSetDefault,
  getLabel,
  translations,
  programStep = false,
}: BuilderLangTabsProps) {
  // if (languages.length <= 1) return null;

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (!languages.length) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % languages.length;
      onChange(languages[nextIndex]);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex =
        (currentIndex - 1 + languages.length) % languages.length;
      onChange(languages[nextIndex]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      onChange(languages[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      onChange(languages[languages.length - 1]);
    }
  };

  return (
    <>
      <p className=" pt-6 pb-3 text-gray-500 dark:text-gray-400">
        {translations["builder.languages.tabs.edit_selection"] ??
          "Select to edit the fields for each language:"}
      </p>
      <div
        role="tablist"
        aria-label={
          translations["builder.languages.tabs.edit_selection"] ??
          "Select to edit the fields for each language"
        }
        className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 rounded-xl w-fit border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      >
        {languages.map((lang, index) => {
          const isActive = activeLang === lang;
          const isDefault = defaultLang === lang;
          const label = getLabel ? getLabel(lang) : lang;

          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              aria-label={`${label}${isDefault ? ", default language" : ""}`}
              key={lang}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
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
        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
        : "bg-transparent text-gray-400 hover:bg-white hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    }
  `}
            >
              <span className="flex items-center gap-1">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block dark:bg-teal-400" />
                )}
                {label}
              </span>

              {/* Always reserve the same space to avoid layout shift */}
              {!programStep && (
                <span
                  className={`
  text-[9px] font-medium normal-case tracking-normal leading-none
  transition-opacity duration-150
  ${
    isDefault
      ? "text-teal-600 opacity-100 dark:text-teal-400"
      : isActive
        ? "text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 dark:text-gray-500"
        : "opacity-0"
  }
`}
                >
                  {isDefault ? "Default" : "Set as default"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
