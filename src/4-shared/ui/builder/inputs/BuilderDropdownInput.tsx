import { ChevronDown } from "lucide-react";

interface Option {
  key: string;
  label: string;
}

interface BuilderDropdownInputProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  prominent?: boolean;
}

export const BuilderDropdownInput = ({
  label,
  value,
  options = [],
  onChange,
  className = "",
  prominent = false,
}: BuilderDropdownInputProps) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          className={`text-xs font-medium ${
            prominent ? "text-teal-700 dark:text-teal-400" : "text-(--builder-color-text-muted)"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full cursor-pointer appearance-none
            rounded-(--builder-radius)
            px-3 py-2.5 pr-9
            focus:outline-none
            focus:ring-2
            transition-colors
            font-medium text-sm
            ${
              prominent
                ? `bg-teal-50 border border-teal-300
                 text-teal-900
                 focus:border-teal-500
                 focus:ring-teal-100 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-100`
                : `bg-(--builder-color-surface)
                 border border-(--builder-color-border)
                 text-(--builder-color-text)
                 shadow-(--builder-shadow)
                 focus:border-(--builder-color-primary)
                 focus:ring-(--builder-color-primary)`
            }
          `}
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${
            prominent ? "text-teal-500 dark:text-teal-400" : "text-(--builder-color-text-muted)"
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
};
