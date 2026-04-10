"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BuilderButton } from "./BuilderButton";

type UpgradeCTAModalProps = {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  upgradeLabel?: string;
};

export function UpgradeCTAModal({
  open,
  onClose,
  onUpgrade,
  title,
  description,
  cancelLabel = "Cancel",
  upgradeLabel = "Upgrade to Premium",
}: UpgradeCTAModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="builder-theme fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 to-teal-600" />

        <div className="p-6">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-teal-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2 py-6">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{description}</p>

          {/* Actions — stacked on mobile, row on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <BuilderButton type="button" variant="primary" onClick={onClose}>
              {cancelLabel}
            </BuilderButton>
            <BuilderButton
              type="button"
              variant="secondary"
              onClick={onUpgrade}
            >
              {upgradeLabel}
            </BuilderButton>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
