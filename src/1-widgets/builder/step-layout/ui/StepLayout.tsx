"use client";

import StickyMobileBar from "@/4-shared/ui/mobileBars/StickyMobileBar";
import { ReactNode } from "react";

type StepLayoutProps = {
  children: ReactNode;

  // actions
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLoading?: boolean;
  // visibility
  showActions?: boolean;

  // optional custom labels
  nextLabel?: string;
  backLabel?: string;
};

export function StepLayout({
  children,
  onNext,
  onBack,
  nextDisabled,
  backDisabled,
  nextLoading,
  showActions = true,
  nextLabel = "Next",
  backLabel = "Back",
}: StepLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* CONTENT */}
      <main
        className="
          flex-1
          pb-28
          md:pb-8
        "
      >
        {children}
      </main>

      {/* DESKTOP ACTIONS */}
      {showActions && (
        <div
          className="
            hidden md:flex
            items-center
            justify-start
            gap-3
            border-t
            bg-white
            px-6
            py-4
          "
        >
          <button
            onClick={onBack}
            disabled={backDisabled}
            className="
              rounded-lg
              border
              px-4
              py-2
              text-sm
              font-medium
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            {backLabel}
          </button>

          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="
              rounded-lg
              bg-green-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            {nextLabel}
          </button>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {showActions && (
        <div className="md:hidden">
          <StickyMobileBar
            primaryLabel={nextLabel ?? "Save"}
            onPrimary={onNext}
            primaryDisabled={nextDisabled}
            primaryLoading={nextLoading}
            secondaryLabel={onBack ? (backLabel ?? "Back") : undefined}
            onSecondary={onBack}
          />
        </div>
      )}
    </div>
  );
}
