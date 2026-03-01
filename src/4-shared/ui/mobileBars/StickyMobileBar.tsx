"use client";

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
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t p-3 flex gap-2">
      <button
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {primaryLoading ? "Saving…" : primaryLabel}
      </button>
      {secondaryLabel && onSecondary && (
        <button
          onClick={onSecondary}
          disabled={secondaryDisabled}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}
