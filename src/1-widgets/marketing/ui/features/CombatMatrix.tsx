import { t } from "@/4-shared/helpers/t";
import type { MarketingTranslations } from "@/4-shared/types/marketingPage";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { Check, Globe, History, Shield, X, Zap } from "lucide-react";

type Props = {
  translations: MarketingTranslations;
};

export default function CombatMatrix({ translations }: Props) {
  const comparisons = [
    {
      feature: t(
        translations,
        "marketing.combat.privacy.title",
        "Your Guests' Privacy",
      ),
      desc: t(
        translations,
        "marketing.combat.privacy.desc",
        "Who protects—or profits from—your family's data?",
      ),
      weddweb: {
        label: t(
          translations,
          "marketing.combat.privacy.weddweb",
          "Private & Encrypted",
        ),
      },
      giants: {
        label: t(
          translations,
          "marketing.combat.privacy.giants",
          "Sold to Advertisers",
        ),
      },
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
    },
    {
      feature: t(
        translations,
        "marketing.combat.lang.title",
        "Global Connection",
      ),
      desc: t(
        translations,
        "marketing.combat.lang.desc",
        "Can every guest read it in their own script?",
      ),
      weddweb: {
        label: t(
          translations,
          "marketing.combat.lang.weddweb",
          "11 Native Languages",
        ),
      },
      giants: {
        label: t(translations, "marketing.combat.lang.giants", "English Only"),
      },
      icon: <Globe className="w-5 h-5 text-blue-500" />,
    },
    {
      feature: t(
        translations,
        "marketing.combat.speed.title",
        "Speed & Accessibility",
      ),
      desc: t(
        translations,
        "marketing.combat.speed.desc",
        "Does it load for a guest in rural India on 4G?",
      ),
      weddweb: {
        label: t(
          translations,
          "marketing.combat.speed.weddweb",
          "Sub-second, globally",
        ),
      },
      giants: {
        label: t(translations, "marketing.combat.speed.giants", "Heavy & Slow"),
      },
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      feature: t(
        translations,
        "marketing.combat.longevity.title",
        "Your Digital Legacy",
      ),
      desc: t(
        translations,
        "marketing.combat.longevity.desc",
        "Will it exist when your children ask to see it?",
      ),
      weddweb: {
        label: t(
          translations,
          "marketing.combat.longevity.weddweb",
          "Online Forever",
        ),
      },
      giants: {
        label: t(
          translations,
          "marketing.combat.longevity.giants",
          "Deleted After 12 Months",
        ),
      },
      icon: <History className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6 border-t border-b border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* --- 1. THE BIG STATEMENT --- */}
        <div className="mb-12 md:mb-16 text-center">
          <Heading
            as="h2"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900"
          >
            {t(
              translations,
              "marketing.combat.slogan.part1",
              "The giants lease you a page;",
            )}
            <span className="block text-emerald-600">
              {t(
                translations,
                "marketing.combat.slogan.part2",
                "WeddWeb gives you a home.",
              )}
            </span>
          </Heading>
          <div className="w-12 md:w-16 h-1 bg-emerald-500 mx-auto mb-8 rounded-full" />
          <Heading
            as="h3"
            className="text-lg md:text-xl font-medium text-gray-600 pb-4"
          >
            {t(translations, "marketing.combat.title", 'The Price of "Free"')}
          </Heading>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            {t(
              translations,
              "marketing.combat.subtitle",
              "What they don't tell you when you sign up.",
            )}
          </p>
        </div>

        {/* --- 2. THE DATA MATRIX (Responsive Grid) --- */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop Header Row - Hidden on Mobile */}
          <div className="hidden md:grid grid-cols-12 bg-gray-50/50 border-b border-gray-200 font-semibold text-sm text-gray-900">
            <div className="col-span-6 p-6">
              {t(
                translations,
                "marketing.combat.table.feature",
                "What matters to you",
              )}
            </div>
            <div className="col-span-3 p-6 text-center bg-emerald-50/30 text-emerald-900">
              WeddWeb
            </div>
            <div className="col-span-3 p-6 text-center text-gray-400">
              {t(
                translations,
                "'marketing.combat.table.title.giants'",
                "The Giants",
              )}
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-gray-100">
            {comparisons.map((item, i) => (
              <div
                key={i}
                className="md:grid md:grid-cols-12 md:items-center hover:bg-gray-50/30 transition-colors"
              >
                {/* Feature Header */}
                <div className="col-span-6 p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm leading-tight">
                        {item.feature}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: Dueling Pills Side-by-Side */}
                <div className="md:hidden grid grid-cols-2 gap-3 px-4 pb-4">
                  {/* WeddWeb pill */}
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
                      WeddWeb
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-[11px] font-semibold text-emerald-800 leading-tight">
                        {item.weddweb.label}
                      </span>
                    </div>
                  </div>

                  {/* Giants pill */}
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      The Giants
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      <span className="text-[11px] font-semibold text-gray-500 leading-tight">
                        {item.giants.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop: Original Column Layout */}
                <div className="hidden md:flex col-span-3 p-6 bg-emerald-50/10 justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {item.weddweb.label}
                  </div>
                </div>

                <div className="hidden md:flex col-span-3 p-6 justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium uppercase tracking-wider">
                    <X className="w-3.5 h-3.5 shrink-0" />
                    {item.giants.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 3. THE FOOTNOTE --- */}
        <div className="mt-8 md:mt-12 text-center px-4">
          <p className="text-xs md:text-sm text-gray-400 italic">
            {t(
              translations,
              "marketing.combat.footer",
              "* Based on 2026 performance benchmarks.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
