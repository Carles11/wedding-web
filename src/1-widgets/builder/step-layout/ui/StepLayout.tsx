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
  fullHeight?: boolean;
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
  fullHeight = true,
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
  const mobilePrimaryLabel = onNext ? resolvedSave : resolvedBack;
  const mobilePrimaryAction = onNext || onBack;
  const mobilePrimaryDisabled = onNext ? nextDisabled : backDisabled;

  return (
    <div
      className={`builder-theme flex flex-col ${fullHeight ? "min-h-screen" : ""}`}
    >
      {/* CONTENT */}
      <main className="flex-1 pb-28 md:pb-8">{children}</main>

      {/* DESKTOP ACTIONS */}
      {showActions && (onBack || onNext) && (
        <div className="hidden items-center justify-start gap-3 border-t builder-muted-surface px-6 py-4 md:flex">
          {onBack && (
            <BuilderButton
              variant="secondary"
              onClick={onBack}
              disabled={backDisabled}
            >
              {resolvedBack}
            </BuilderButton>
          )}

          {onNext && (
            <BuilderButton
              onClick={onNext}
              disabled={nextDisabled}
              loading={nextLoading}
              loadingLabel={
                translations["builder.actions.saving"] || "Saving..."
              }
            >
              {resolvedNext}
            </BuilderButton>
          )}
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {showActions && mobilePrimaryAction && (
        <div className="md:hidden">
          <StickyMobileBar
            primaryLabel={mobilePrimaryLabel}
            onPrimary={mobilePrimaryAction}
            primaryDisabled={mobilePrimaryDisabled}
            primaryLoading={onNext ? nextLoading : false}
            secondaryLabel={onNext && onBack ? resolvedBack : undefined}
            onSecondary={onNext ? onBack : undefined}
            secondaryDisabled={backDisabled}
          />
        </div>
      )}
    </div>
  );
}
