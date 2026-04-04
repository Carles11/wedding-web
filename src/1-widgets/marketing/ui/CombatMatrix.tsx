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
        "Data Privacy",
      ),
      desc: t(
        translations,
        "marketing.combat.privacy.desc",
        "Who owns your guest data?",
      ),
      weddweb: {
        status: "best",
        label: t(
          translations,
          "marketing.combat.privacy.weddweb",
          "Private & Encrypted",
        ),
      },
      giants: {
        status: "bad",
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
        "International Reach",
      ),
      desc: t(
        translations,
        "marketing.combat.lang.desc",
        "Native script support (RTL/Devanagari)",
      ),
      weddweb: {
        status: "best",
        label: t(
          translations,
          "marketing.combat.lang.weddweb",
          "11 Native Languages",
        ),
      },
      giants: {
        status: "bad",
        label: t(
          translations,
          "marketing.combat.lang.giants",
          "English-Locked",
        ),
      },
      icon: <Globe className="w-5 h-5 text-blue-500" />,
    },
    {
      feature: t(translations, "marketing.combat.speed.title", "Performance"),
      desc: t(
        translations,
        "marketing.combat.speed.desc",
        "Page load on 4G/Mobile",
      ),
      weddweb: {
        status: "best",
        label: t(
          translations,
          "marketing.combat.speed.weddweb",
          "Sub-second (Edge)",
        ),
      },
      giants: {
        status: "bad",
        label: t(
          translations,
          "marketing.combat.speed.giants",
          "Bloated & Slow",
        ),
      },
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      feature: t(
        translations,
        "marketing.combat.longevity.title",
        "Digital Legacy",
      ),
      desc: t(
        translations,
        "marketing.combat.longevity.desc",
        "Does the site stay online?",
      ),
      weddweb: {
        status: "best",
        label: t(
          translations,
          "marketing.combat.longevity.weddweb",
          "Lifetime Access",
        ),
      },
      giants: {
        status: "bad",
        label: t(
          translations,
          "marketing.combat.longevity.giants",
          "Deleted after the wedding",
        ),
      },
      icon: <History className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <section className="w-full py-24 px-6 border-t border-b border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto">
        <Heading
          as="h2"
          className="text-3xl font-bold text-center mb-4 tracking-tight pb-6"
        >
          {t(
            translations,
            "marketing.combat.title",
            'The Hidden Cost of "Free"',
          )}
        </Heading>
        <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
          {t(
            translations,
            "marketing.combat.subtitle",
            "A comparison of WeddWeb vs. the Giants on key factors that matter to international modern couples and their families.",
          )}
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-sm font-semibold text-gray-900 border-b border-gray-200">
                  {t(translations, "marketing.combat.table.feature", "Feature")}
                </th>
                <th className="p-6 text-sm font-bold text-center border-b border-gray-200 bg-emerald-50/30 text-emerald-900">
                  {t(translations, "marketing.combat.table.weddweb", "WeddWeb")}
                </th>
                <th className="p-6 text-sm font-semibold text-center border-b border-gray-200 text-gray-400">
                  {t(
                    translations,
                    "marketing.combat.table.giants",
                    'The "Giants"',
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparisons.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.feature}
                        </div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center bg-emerald-50/10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      {item.weddweb.label}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium uppercase tracking-wider">
                      <X className="w-3.5 h-3.5" />
                      {item.giants.label}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gray-50 border border-gray-200 text-center">
          <p className="text-sm text-gray-600 italic">
            {t(
              translations,
              "marketing.combat.footer",
              "* Based on 2026 performance benchmarks and platform TOS audits.",
            )}
          </p>
        </div>
        <Heading
          as="h3"
          className="text-3xl font-bold text-center mb-4 tracking-tight pt-8"
        >
          {t(
            translations,
            "marketing.combat.slogan",
            "The 'Giants' rent you a site; WeddWeb gives you a home.",
          )}
        </Heading>
      </div>
    </section>
  );
}
