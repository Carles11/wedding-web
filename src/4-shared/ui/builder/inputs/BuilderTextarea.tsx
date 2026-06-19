type BuilderTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
};

export function BuilderTextarea({
  label,
  value,
  onChange,
  required,
  placeholder,
  rows = 3,
  disabled,
}: BuilderTextareaProps) {
  return (
    <div>
      <label className="block text-xs text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="ml-0.5 text-red-500 dark:text-red-400"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
      />
    </div>
  );
}
