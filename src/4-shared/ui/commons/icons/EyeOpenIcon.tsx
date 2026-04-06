import React from "react";

export const EyeOpenIcon: React.FC<{
  className?: string;
  ariaLabel?: string;
}> = ({ className = "w-5 h-5", ariaLabel = "Show password" }) => (
  <svg
    className={className}
    aria-label={ariaLabel}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
