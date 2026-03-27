"use client";

import { BuilderButton } from "./BuilderButton";

type Props = {
  primaryLabel: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;

  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;
};

export default function StickyMobileBar({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryLoading,
  secondaryLabel,
  onSecondary,
  secondaryDisabled,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex gap-2">
      {" "}
      <BuilderButton
        onClick={onPrimary}
        disabled={primaryDisabled}
        fullWidth
        loading={primaryLoading}
        loadingLabel="Saving..."
      >
        {primaryLabel}
      </BuilderButton>
      {secondaryLabel && onSecondary && (
        <BuilderButton
          onClick={onSecondary}
          disabled={secondaryDisabled}
          variant="secondary"
        >
          {secondaryLabel}
        </BuilderButton>
      )}
    </div>
  );
}
