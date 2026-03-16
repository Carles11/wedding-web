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
      <label className="block text-xs text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
