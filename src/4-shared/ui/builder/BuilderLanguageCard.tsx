import type { ReactNode } from "react";

type BuilderLanguageCardProps = {
  languageCode: string;
  title?: string;
  isDefault?: boolean;
  defaultBadgeLabel?: string;
  children: ReactNode;
};

export function BuilderLanguageCard({
  languageCode,
  title,
  isDefault = false,
  defaultBadgeLabel,
  children,
}: BuilderLanguageCardProps) {
  return (
    <section
      className={`rounded-xl border bg-white p-4 shadow-sm transition sm:p-5 ${
        isDefault ? "ring-2 ring-blue-600/10" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-normal text-xs text-slate-800">{title}</span>
          <span className="uppercase text-xs tracking-widest text-blue-500">
            ({languageCode})
          </span>
        </div>

        {isDefault && defaultBadgeLabel && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {defaultBadgeLabel}
          </span>
        )}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}
