import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import type { PlanType } from "@/4-shared/types";

type BuilderLangPillsProps = {
  languages: SupportedLanguage[];
  planType: PlanType;
  onToggle: (lang: SupportedLanguage) => void;
  onLockedClick: () => void;
};

export const BuilderLangPills = ({
  languages,
  planType,
  onToggle,
  onLockedClick,
}: BuilderLangPillsProps) => {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {SUPPORTED_LANGUAGES.map((langCode) => {
        const isSelected = languages.includes(langCode);
        const isLocked =
          planType === "free" && !isSelected && languages.length >= 1;

        return (
          <label
            key={langCode}
            className={`
              builder-chip
              ${isSelected ? "builder-chip-active" : "builder-chip-idle"}
              ${isLocked ? "builder-chip-locked" : ""}
            `}
            onClick={(e) => {
              if (isLocked) {
                e.preventDefault();
                onLockedClick();
              }
            }}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={isSelected}
              onChange={() => !isLocked && onToggle(langCode)}
              disabled={isLocked}
            />

            <span
              className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-gray-300"}`}
            />

            {SUPPORTED_LANGUAGE_LABELS[langCode]}

            {isLocked && (
              <svg
                className="h-3 w-3 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
            )}
          </label>
        );
      })}
    </div>
  );
};
