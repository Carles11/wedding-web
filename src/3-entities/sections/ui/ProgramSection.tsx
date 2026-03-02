import { formatEventDate } from "@/4-shared/helpers/formatEventDate";
import { formatWhereWedding } from "@/4-shared/helpers/formatWhereWedding";
import { ProgramEvent } from "@/4-shared/types";

type Props = {
  mainEvent: ProgramEvent | null;
  lang: string;
  translations: Record<string, string>;
};

export default function ProgramSectionComponent({
  mainEvent,
  translations,
  lang,
}: Props) {
  // Title from translations table (not per event)
  const mainTitle = translations["program.event.main-title"] ?? "Main event";
  const whenLabel = translations["when"] ?? "When";
  const whereLabel = translations["where"] ?? "Where";

  // WHEN: format from mainEvent's date + time
  const when =
    mainEvent && mainEvent.date
      ? formatEventDate(
          mainEvent.date ?? undefined,
          mainEvent.time ?? undefined,
          lang,
        )
      : "";

  // WHERE: translation from program.event.location.{mainEvent.id}
  const whereWedding =
    mainEvent && mainEvent.id
      ? formatWhereWedding(mainEvent.id, translations)
      : "";

  // Optional: description (if you want to show it here as well)
  // const description =
  //   mainEvent && mainEvent.id
  //     ? translations[`program.event.description.${mainEvent.id}`] ?? ""
  //     : "";

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
          <h2>{mainTitle}</h2>
        </span>

        <div
          className="
          grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x
          divide-neutral-200
          w-full text-center
        "
        >
          <div className="pb-6 md:pb-0 md:pr-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              {whenLabel}
            </div>
            <div className="text-lg font-light">{when}</div>
          </div>

          <div className="py-6 md:py-0 md:px-8">
            <div className="text-xs uppercase mb-2 tracking-wider text-neutral-600 font-bold">
              {whereLabel}
            </div>
            <div className="text-lg font-light whitespace-pre-line">
              {whereWedding}
            </div>
          </div>
        </div>

        {/* Uncomment if you wish to show the event description here */}
        {/* {description && (
          <div className="mt-2 text-base text-neutral-600 text-center">
            {description}
          </div>
        )} */}
      </div>
    </section>
  );
}
