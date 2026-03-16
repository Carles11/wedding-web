type BuilderTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
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
}: BuilderTextInputProps) {
  return (
    <div>
      <label className="block text-xs text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
