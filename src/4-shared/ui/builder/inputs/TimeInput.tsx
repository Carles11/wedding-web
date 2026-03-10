type TimeInputProps = {
  value: string; // "HH:mm"
  onChange: (newTime: string) => void;
  label?: string;
  required?: boolean;
};

export function TimeInput({
  value,
  onChange,
  label,
  required,
}: TimeInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 mb-1">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <input
        type="time"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border px-3 py-2 rounded"
        placeholder="HH:mm"
      />
    </div>
  );
}
