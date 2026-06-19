import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import Link from "next/link";

type Props = {
  translations: MarketingTranslations;
  lang: string;
};

export default function GlobalLegacyBridge({ translations, lang }: Props) {
  return (
    <section className="w-full py-20 px-6 bg-emerald-50/30 dark:bg-emerald-950/20 border-y border-emerald-100/50 dark:border-emerald-900/30">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: The "Logic" & Authority */}
        <div className="flex-1 text-center md:text-left">
          <Heading
            as="h2"
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-5 tracking-tight pb-6"
          >
            {t(
              translations,
              "marketing.home.bridge.title",
              "Your Love Story Isn't a Subscription. It's a Legacy.",
            )}
          </Heading>
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg">
            {t(
              translations,
              "marketing.home.bridge.body",
              "While industry giants archive your memories after 12 months, WeddWeb keeps your story alive forever—in 11 native scripts, for every guest worldwide. Because the day you said 'I do' wasn't a temporary event. It was the first page of your shared history.",
            )}
          </p>
          <Link
            href={`/${lang}/features/multilingual-wedding-website`}
            className="group inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {t(
              translations,
              "marketing.home.bridge.link",
              "Discover Our Global Language Engine",
            )}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Right Side: The "Philosophy" (The Mic Drop) */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-900/5 overflow-hidden">
            {/* Subtle decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/50 rounded-full opacity-50" />

            <p className="relative z-10 font-serif text-2xl italic text-slate-700 dark:text-slate-300 mb-4 leading-tight">
              {t(
                translations,
                "marketing.combat.slogan.part1",
                "The giants lease you a page;",
              )}
            </p>
            <p className="relative z-10 font-bold text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400 leading-tight">
              {t(
                translations,
                "marketing.combat.slogan.part2",
                "WeddWeb gives you a home.",
              )}
            </p>

            <div className="mt-8 w-12 h-1 bg-emerald-500/30 dark:bg-emerald-400/30 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
