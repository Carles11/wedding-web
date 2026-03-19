import { EyeClosedIcon } from "@/4-shared/ui/commons/icons/EyeClosedIcon";
import { EyeOpenIcon } from "@/4-shared/ui/commons/icons/EyeOpenIcon";
import { useState } from "react";

type BuilderTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  error?: string;
  showPasswordToggle?: boolean;
};

export function BuilderTextInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  disabled,
  autoComplete,
  error,
  showPasswordToggle,
}: BuilderTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType =
    isPassword && showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="relative">
      <label className="block text-xs text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500"> *</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className={`mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500${error ? " border-red-500" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
            tabIndex={0}
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        )}
      </div>
      {error && (
        <div
          id={`${label}-error`}
          className="text-xs text-(--builder-color-danger) mt-1"
        >
          {error}
        </div>
      )}
    </div>
  );
}
