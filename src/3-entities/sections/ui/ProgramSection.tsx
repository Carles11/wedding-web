import type { ProgramSection } from "@/4-shared/types";
import { getTextForLang } from "@/4-shared/lib/getTextForLang";

type ProgramSectionProps = {
  program: ProgramSection;
  lang: string;
};

export function ProgramSectionComponent({
  program,
  lang,
}: ProgramSectionProps) {
  const headline = getTextForLang(program.content.headline, lang, "ca");
  const when = getTextForLang(program.content.when, lang, "ca");
  const whereWedding = getTextForLang(
    program.content.where?.wedding,
    lang,
    "ca"
  );
  const whereBanquet = getTextForLang(
    program.content.where?.banquet,
    lang,
    "ca"
  );
  const wear = getTextForLang(program.content.wear, lang, "ca");
  console.log("ProgramSection LANG:", lang, program.content);
  return (
    <section className="relative w-full h-1/4 flex justify-center -mt-16 md:-mt-20 z-30">
      <div
        className="
        max-w-4xl w-full
        bg-[#f8f6f1] bg-opacity-90
        rounded-2xl
        shadow-lg
        border border-neutral-200
        px-6 md:px-12 py-10 md:py-16
        flex flex-col items-center
        "
      >
        <span
          className="
          font-sans text-2xl md:text-sm uppercase tracking-wider
          text-neutral-700 font-semibold text-center mb-10
          letter-spacing-wide
        "
        >
          {headline}
        </span>
        <div
          className="
          grid grid-cols-3 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x
          divide-neutral-200
          w-full text-center
        "
        >
          <div className="pb-6 md:pb-0 md:pr-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              When
            </div>
            <div className="font-serif text-lg font-light">{when}</div>
          </div>
          <div className="py-6 md:py-0 md:px-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              Where
            </div>
            <div className="font-serif text-lg font-light">{whereWedding}</div>
            <div className="text-sm mt-1 text-neutral-500">{whereBanquet}</div>
          </div>
          <div className="pt-6 md:pt-0 md:pl-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              Wear
            </div>
            <div className="font-serif text-lg font-light">{wear}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
