import React, { useId } from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean | undefined;
  className?: string;
  "aria-label"?: string;
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}) => {
  const generatedId = useId();
  const toggleId = id || `toggle-${generatedId}`;
  return (
    <div className={`flex items-center gap-2 ${className} `}>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || "Toggle"}
        className={`cursor-pointer 
          w-10 h-6 rounded-full transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)
          ${checked ? "bg-(--builder-color-primary)" : "bg-(--builder-color-text-muted)"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          relative
        `}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        tabIndex={0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        <span
          className={`
            block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform duration-200 dark:bg-gray-300
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
      {label && (
        <label
          htmlFor={toggleId}
          className={`select-none text-sm ${disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};
