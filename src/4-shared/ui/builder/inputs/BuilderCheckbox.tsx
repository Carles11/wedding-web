import React from "react";

type BuilderCheckboxProps = {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function BuilderCheckbox({
  id,
  label,
  checked,
  onChange,
  error,
}: BuilderCheckboxProps) {
  return (
    <div className="group mt-2">
      <label
        htmlFor={id}
        className="flex items-start cursor-pointer select-none gap-3"
      >
        <div className="relative flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          {/* Custom Checkbox Box */}
          <div
            className={`
              w-5 h-5 border rounded transition-all duration-200 flex items-center justify-center
              ${
                checked
                  ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                  : error
                    ? "border-red-500 bg-red-50 dark:border-red-800/50 dark:bg-red-950/30"
                    : "border-gray-300 bg-white group-hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:group-hover:border-blue-400"
              }
            `}
          >
            {/* Checkmark Icon */}
            <svg
              className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${
                checked ? "opacity-100" : "opacity-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Label Text */}
        <span className="text-sm text-gray-700 leading-tight dark:text-gray-300">{label}</span>
      </label>

      {/* Error Message - Matches BuilderTextInput logic */}
      {error && (
        <div className="text-xs text-(--builder-color-danger) mt-1.5 ml-8">
          {error}
        </div>
      )}
    </div>
  );
}
