import React, { ReactNode, useEffect } from "react";

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const MainModal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  // Prevent body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm px-0 sm:px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/*
        Mobile:  sheet that slides up from bottom, rounded top corners only,
                 max 90dvh so it never covers the full screen
        Desktop: centered card, max-w-lg, fully rounded
      */}
      <div
        className="
        relative w-full
        rounded-t-2xl sm:rounded-2xl
        bg-white border border-gray-300 shadow-2xl dark:bg-gray-800 dark:border-gray-600
        flex flex-col
        max-h-[90dvh] sm:max-h-[85vh]
        sm:max-w-lg
        overflow-hidden
        transition-all
      "
      >
        {/* Top color accent */}
        <div className="h-1 w-full flex-shrink-0 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-200" />

        {/* Header — fixed, never scrolls */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50">
              <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900 text-base tracking-tight font-sans dark:text-gray-100">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Close"
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable, takes remaining height */}
        <div className="flex-1 overflow-y-auto px-6 py-5 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainModal;
