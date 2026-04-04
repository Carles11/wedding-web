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
    <section className="w-full py-20 px-6 bg-emerald-50/30 border-y border-emerald-100/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: The "Logic" & Authority */}
        <div className="flex-1 text-center md:text-left">
          <Heading
            as="h2"
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-5 tracking-tight pb-6"
          >
            {t(
              translations,
              "marketing.home.bridge.title",
              "Built for Families, Not for Data.",
            )}
          </Heading>
          <p className="text-slate-600 mb-8 leading-relaxed text-lg">
            {t(
              translations,
              "marketing.home.bridge.body",
              "WeddWeb is the only platform that supports 11 native scripts and guarantees your wedding website stays online forever. Because a wedding isn't a temporary event—it's the start of your history.",
            )}
          </p>
          <Link
            href={`/${lang}/features/multilingual-wedding-website`}
            className="group inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
          >
            {t(
              translations,
              "marketing.home.bridge.link",
              "Explore our Global Engine",
            )}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Right Side: The "Philosophy" (The Mic Drop) */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative p-10 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
            {/* Subtle decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50" />

            <p className="relative z-10 font-serif text-2xl italic text-slate-700 mb-4 leading-tight">
              {t(
                translations,
                "marketing.combat.slogan.part1",
                "The 'Giants' rent you a site;",
              )}
            </p>
            <p className="relative z-10 font-bold text-3xl md:text-4xl text-emerald-600 leading-tight">
              {t(
                translations,
                "marketing.combat.slogan.part2",
                "WeddWeb gives you a home.",
              )}
            </p>

            <div className="mt-8 w-12 h-1 bg-emerald-500/30 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
