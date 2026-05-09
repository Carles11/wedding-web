"use client";

import type { RsvpAnalyticsBreakdownItem } from "@/3-entities/rsvp/model/types";
import { t } from "@/4-shared/helpers/t";
import type { PlanType } from "@/4-shared/types";
import { BuilderButton, UpgradeCTAModal } from "@/4-shared/ui/builder";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useRsvpAnalytics } from "./useRsvpAnalytics";

type Props = {
  siteId: string;
  lang: string;
  planType: PlanType;
  translations: Record<string, string>;
};

function BreakdownChart({
  items,
  title,
  emptyLabel,
  tableLabel,
  tableKeyLabel,
  tableCountLabel,
  tablePercentageLabel,
}: {
  items: RsvpAnalyticsBreakdownItem[];
  title: string;
  emptyLabel: string;
  tableLabel: string;
  tableKeyLabel: string;
  tableCountLabel: string;
  tablePercentageLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-(--builder-color-border) bg-white p-4">
        <h3 className="text-base font-semibold text-(--builder-color-text)">
          {title}
        </h3>
        <p className="text-sm text-(--builder-color-text-muted)">
          {emptyLabel}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4 rounded-lg border border-(--builder-color-border) bg-white p-4">
      <h3 className="text-base font-semibold text-(--builder-color-text)">
        {title}
      </h3>

      <div className="space-y-2" role="img" aria-label={tableLabel}>
        {items.map((item) => (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-(--builder-color-text-muted)">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-(--builder-color-muted-surface)">
              <div
                className="h-full rounded-full bg-(--builder-color-primary)"
                style={{
                  width: `${Math.max(0, Math.min(100, item.percentage))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <caption className="sr-only">{tableLabel}</caption>
          <thead className="text-xs uppercase tracking-wide text-(--builder-color-text-muted)">
            <tr>
              <th className="px-3 py-2 text-left">{tableKeyLabel}</th>
              <th className="px-3 py-2 text-center">{tableCountLabel}</th>
              <th className="px-3 py-2 text-right">{tablePercentageLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--builder-color-border)">
            {items.map((item) => (
              <tr key={`${item.key}-row`}>
                <td className="px-3 py-2 text-(--builder-color-text)">
                  {item.label}
                </td>
                <td className="px-3 py-2 text-center text-(--builder-color-text)">
                  {item.count}
                </td>
                <td className="px-3 py-2 text-right text-(--builder-color-text-muted)">
                  {item.percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-(--builder-color-border) bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-(--builder-color-text-muted)">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-(--builder-color-text)">
        {value}
      </p>
    </div>
  );
}

export function RsvpAnalyticsTab({
  siteId,
  lang,
  planType,
  translations,
}: Props) {
  const router = useRouter();
  const isPremium = planType === "premium";
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const { data, loading, error } = useRsvpAnalytics(siteId, {
    enabled: isPremium,
  });

  const loadingCards = useMemo(
    () =>
      Array.from({ length: 3 }, (_, idx) => (
        <div
          key={`analytics-loading-${idx}`}
          className="h-23 animate-pulse rounded-lg border border-(--builder-color-border) bg-(--builder-color-muted-surface)"
        />
      )),
    [],
  );

  if (!isPremium) {
    return (
      <>
        <div className="space-y-4 rounded-lg border border-(--builder-color-border) bg-white p-6">
          <h3 className="text-lg font-semibold text-(--builder-color-text)">
            {t(
              translations,
              "builder.rsvp.analytics.locked.title",
              "Analytics is a Premium feature",
            )}
          </h3>
          <p className="text-sm text-(--builder-color-text-muted)">
            {t(
              translations,
              "builder.rsvp.analytics.locked.description",
              "Upgrade to Premium to view RSVP analytics and guest insights.",
            )}
          </p>
          <div>
            <BuilderButton
              variant="primary"
              size="sm"
              onClick={() => setUpgradeModalOpen(true)}
            >
              {t(
                translations,
                "builder.rsvp.analytics.locked.cta",
                "Upgrade to Premium",
              )}
            </BuilderButton>
          </div>
        </div>

        <UpgradeCTAModal
          open={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onUpgrade={() => router.push(`/${lang || "en"}/pricing`)}
          title={t(
            translations,
            "builder.rsvp.analytics.locked.title",
            "Analytics is a Premium feature",
          )}
          description={t(
            translations,
            "builder.rsvp.analytics.locked.description",
            "Upgrade to Premium to view RSVP analytics and guest insights.",
          )}
          cancelLabel={t(translations, "common.cancel", "Cancel")}
          upgradeLabel={t(
            translations,
            "builder.upgrade.cta",
            "Upgrade to Premium",
          )}
        />
      </>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-(--builder-color-text)">
          {t(translations, "builder.rsvp.analytics.title", "RSVP Analytics")}
        </h2>
        <p className="mt-1 text-sm text-(--builder-color-text-muted)">
          {t(
            translations,
            "builder.rsvp.analytics.subtitle",
            "Track invitations, responses, attendance, and guest insights.",
          )}
        </p>
      </header>

      {loading && (
        <div className="grid gap-3 sm:grid-cols-3">{loadingCards}</div>
      )}

      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ||
            t(
              translations,
              "builder.rsvp.analytics.error",
              "Failed to load analytics.",
            )}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label={t(
                translations,
                "builder.rsvp.analytics.summary.invitations_sent",
                "Invitations sent",
              )}
              value={data.summary.invitations_sent}
            />
            <SummaryCard
              label={t(
                translations,
                "builder.rsvp.analytics.summary.rsvps_received",
                "RSVPs received",
              )}
              value={data.summary.rsvps_received}
            />
            <SummaryCard
              label={t(
                translations,
                "builder.rsvp.analytics.summary.attendance_rate",
                "Attendance rate",
              )}
              value={`${data.summary.attendance_rate.toFixed(1)}%`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BreakdownChart
              items={data.languages}
              title={t(
                translations,
                "builder.rsvp.analytics.languages.title",
                "Language breakdown",
              )}
              emptyLabel={t(
                translations,
                "builder.rsvp.analytics.languages.empty",
                "No language data yet.",
              )}
              tableLabel={t(
                translations,
                "builder.rsvp.analytics.languages.table_label",
                "Language breakdown table",
              )}
              tableKeyLabel={t(
                translations,
                "builder.rsvp.analytics.table.language",
                "Language",
              )}
              tableCountLabel={t(
                translations,
                "builder.rsvp.analytics.table.count",
                "Count",
              )}
              tablePercentageLabel={t(
                translations,
                "builder.rsvp.analytics.table.percentage",
                "Percentage",
              )}
            />

            <BreakdownChart
              items={data.dietary}
              title={t(
                translations,
                "builder.rsvp.analytics.dietary.title",
                "Dietary and meal restrictions",
              )}
              emptyLabel={t(
                translations,
                "builder.rsvp.analytics.dietary.empty",
                "No restrictions reported yet.",
              )}
              tableLabel={t(
                translations,
                "builder.rsvp.analytics.dietary.table_label",
                "Dietary restrictions table",
              )}
              tableKeyLabel={t(
                translations,
                "builder.rsvp.analytics.table.restriction",
                "Restriction",
              )}
              tableCountLabel={t(
                translations,
                "builder.rsvp.analytics.table.count",
                "Count",
              )}
              tablePercentageLabel={t(
                translations,
                "builder.rsvp.analytics.table.percentage",
                "Percentage",
              )}
            />
          </div>
        </>
      )}

      {!loading && !error && !data && (
        <div className="rounded-lg border border-(--builder-color-border) bg-white p-4 text-sm text-(--builder-color-text-muted)">
          {t(
            translations,
            "builder.rsvp.analytics.empty",
            "No analytics data yet.",
          )}
        </div>
      )}
    </section>
  );
}
