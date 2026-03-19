import { BuilderButton } from "@/4-shared/ui/builder";
import StickyMobileBar from "@/4-shared/ui/builder/StickyMobileBar";
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
    <div className="flex min-h-screen flex-col">
      {/* CONTENT */}
      <main className="flex-1 pb-28 md:pb-8">{children}</main>

      {/* DESKTOP ACTIONS */}
      {showActions && (
        <div className="hidden md:flex items-center justify-start gap-3 border-t builder-muted-surface px-6 py-4">
          <BuilderButton
            variant="secondary"
            onClick={onBack}
            disabled={backDisabled}
          >
            {resolvedBack}
          </BuilderButton>

          <BuilderButton
            onClick={onNext}
            disabled={nextDisabled}
            loading={nextLoading}
            loadingLabel={translations["builder.actions.saving"] || "Saving..."}
          >
            {resolvedNext}
          </BuilderButton>
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
