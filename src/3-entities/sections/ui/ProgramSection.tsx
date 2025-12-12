import type { ProgramSection } from "@/4-shared/types";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";
import type { TranslationDictionary } from "@/4-shared/lib/i18n";

type ProgramSectionProps = {
  program: ProgramSection;
  lang: string;
  translations?: TranslationDictionary | null;
};

export default function ProgramSectionComponent({
  program,
  lang,
  translations,
}: ProgramSectionProps) {
  const headline = getTextForLang(program.content?.headline, lang, "ca");
  const when = getTextForLang(program.content?.when, lang, "ca");
  const whereWedding = getTextForLang(
    program.content?.where?.wedding,
    lang,
    "ca"
  );
  const whereBanquet = getTextForLang(
    program.content?.where?.banquet,
    lang,
    "ca"
  );
  const wear = getTextForLang(program.content?.wear, lang, "ca");

  const whenLabel = translations?.["when"] ?? "When";
  const whereLabel = translations?.["where"] ?? "Where";
  const dresscodeLabel = translations?.["dresscode"] ?? "Dresscode";

  return (
    <section
      className="relative w-full h-1/4 flex justify-center mt-0 md:mt-20 z-30"
      aria-labelledby="program-headline"
    >
      <div
        className="
        max-w-4xl w-full
        rounded-2xl
        shadow-lg
        px-6 md:px-22 py-10 md:py-16 mb-12 md:mb-22
        flex flex-col items-center
        "
      >
        <span
          id="program-headline"
          className="
          text-2xl md:text-md  tracking-wider
          text-neutral-700 font-semibold text-center mb-10
          letter-spacing-wide
        "
        >
          <h2>{headline}</h2>
        </span>

        <div
          className="
          grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x
          divide-neutral-200
          w-full text-center
        "
        >
          <div className="pb-6 md:pb-0 md:pr-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              {whenLabel}
            </div>
            <div className=" text-lg font-light">{when}</div>
          </div>

          <div className="py-6 md:py-0 md:px-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              {whereLabel}
            </div>
            <div className="text-lg font-light">{whereWedding}</div>
          </div>

          <div className="pt-6 md:pt-0 md:pl-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              {dresscodeLabel}
            </div>
            <div className=" text-lg font-light">{wear}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
