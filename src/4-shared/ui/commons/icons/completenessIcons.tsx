export const GreenCheckIcon = () => {
  return (
    <svg
      className="inline mr-2 text-green-500"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="#e6fbe6"
      />
      <path
        d="M5 8.5l2 2l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const RedDotIcon = () => {
  return (
    <svg
      className="inline mr-2 text-red-500"
      width={12}
      height={12}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="5" fill="#ef4444" />
    </svg>
  );
};
