import { t } from "@/4-shared/helpers/t";
import CopyButton from "@/4-shared/ui/commons/buttons/CopyButton";

export const DnsRecord = ({
  step,
  type,
  name,
  value,
  copyLabel,
  typeColor,
  translations,
}: {
  step: number;
  type: string;
  name: string;
  value: string;
  copyLabel: string;
  typeColor: { bg: string; border: string; text: string };
  translations: Record<string, string>;
}) => (
  <div className="rounded-xl p-4 mb-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-bold rounded-md px-2 py-0.5 bg-neutral-100 dark:bg-gray-700 border border-neutral-300 dark:border-gray-600 text-neutral-500 dark:text-neutral-400">
        {t(translations, "builder.domain.dns_modal.step", "Step")} {step}
      </span>
      <span
        className={`text-xs font-semibold rounded-md px-2 py-0.5 ${typeColor.bg} ${typeColor.text} border ${typeColor.border}`}
      >
        {type}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-xs mb-1.5 text-neutral-400 dark:text-neutral-500 font-medium font-sans">
          {t(translations, "builder.domain.dns_modal.name_host", "Name / Host")}
        </div>
        <div className="rounded-lg px-3 py-2 text-xs bg-neutral-50 dark:bg-gray-900 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-neutral-300 break-all">
          {name}
        </div>
      </div>
      <div>
        <div className="text-xs mb-1.5 text-neutral-400 dark:text-neutral-500 font-medium font-sans">
          {t(
            translations,
            "builder.domain.dns_modal.points_to_value",
            "Points to / Value",
          )}
        </div>
        <div className="rounded-lg px-3 py-2 text-xs flex items-center justify-between gap-2 bg-neutral-50 dark:bg-gray-900 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-neutral-300 break-all">
          <span className="min-w-0 break-all">{value}</span>
          <CopyButton text={value} label={copyLabel} className="shrink-0" />
        </div>
      </div>
    </div>
  </div>
);
