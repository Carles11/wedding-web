import StickyMobileBar from "@/4-shared/ui/mobileBars/StickyMobileBar";
import { ReactNode } from "react";

type StepLayoutProps = {
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLoading?: boolean;
  showActions?: boolean;
  nextLabel?: string;
  backLabel?: string;
  translations?: Record<string, string>;
};

export function StepLayout({
  children,
  onNext,
  onBack,
  nextDisabled,
  backDisabled,
  nextLoading,
  showActions = true,
  nextLabel,
  backLabel,
  translations = {},
}: StepLayoutProps) {
  // Resolve labels using translations first, then prop, then fallback
  const resolvedNext =
    translations["builder.actions.save"] ||
    translations["builder.actions.next"] ||
    nextLabel ||
    "Next";
  const resolvedBack =
    translations["builder.actions.discard"] ||
    translations["builder.actions.back"] ||
    backLabel ||
    "Back";
  const resolvedSave =
    translations["builder.actions.save"] || nextLabel || "Save";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* CONTENT */}
      <main className="flex-1 pb-28 md:pb-8">{children}</main>

      {/* DESKTOP ACTIONS */}
      {showActions && (
        <div className="hidden md:flex items-center justify-start gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={onBack}
            disabled={backDisabled}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {resolvedBack}
          </button>

          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {resolvedNext}
          </button>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {showActions && (
        <div className="md:hidden">
          <StickyMobileBar
            primaryLabel={resolvedSave}
            onPrimary={onNext}
            primaryDisabled={nextDisabled}
            primaryLoading={nextLoading}
            secondaryLabel={onBack ? resolvedBack : undefined}
            onSecondary={onBack}
          />
        </div>
      )}
    </div>
  );
}
