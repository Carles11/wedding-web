import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import { Languages } from "lucide-react";

export const MultiLangInputsBanner = ({
  translations,
  languages = [],
  defaultLang = "English",
}: {
  translations: any;
  languages?: string[];
  defaultLang?: string;
}) => {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
      {/* Lucide Icon for consistency */}
      <div className="w-8 h-8 shrink-0 bg-teal-600 rounded-lg flex items-center justify-center">
        <Languages className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-emerald-900 leading-none mb-0.5">
          {t(
            translations,
            "builder.program_events.form.multi_language",
            "Multi-language fields",
          )}
        </p>
        <p className="text-xs text-emerald-700 leading-snug">
          {interpolate(
            t(
              translations,
              "builder.program_events.form.languages.info",
              "The default language ({defaultLang}) is mandatory for title and location.",
            ),
            { defaultLang },
          )}
        </p>
      </div>

      {/* Language Count Badge */}
      <span className="shrink-0 text-[11px] font-medium text-teal-700 bg-white border border-teal-300 rounded-full px-2.5 py-1 whitespace-nowrap">
        {languages.length}{" "}
        {languages.length === 1
          ? t(
              translations,
              "builder.program_events.form.language_singular",
              "language",
            )
          : t(
              translations,
              "builder.program_events.form.language_plural",
              "languages",
            )}
      </span>
    </div>
  );
};
