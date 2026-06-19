import type { ReactNode } from "react";

type BuilderFormCardProps = {
  title: string;
  description?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
};

export function BuilderFormCard({
  title,
  description,
  error,
  children,
  className,
}: BuilderFormCardProps) {
  return (
    <section
      className={`mt-5 rounded-xl border border-slate-300 bg-slate-50 p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900 ${className ?? ""}`.trim()}
      aria-label={title}
    >
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      {description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
      {error && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}
    </section>
  );
}
