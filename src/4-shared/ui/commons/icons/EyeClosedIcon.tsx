import React from "react";

export const EyeClosedIcon: React.FC<{
  className?: string;
  ariaLabel?: string;
}> = ({ className = "w-5 h-5", ariaLabel = "Hide password" }) => (
  <svg
    className={className}
    aria-label={ariaLabel}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.53 9.53A3 3 0 0 0 12 15c1.66 0 3-1.34 3-3 0-.47-.11-.92-.29-1.32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
