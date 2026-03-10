import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateInputProps = {
  value: string; // ISO: "YYYY-MM-DD"
  onChange: (newDate: string) => void;
  label?: string;
  required?: boolean;
  min?: string;
  max?: string;
};

export function DateInput({
  value,
  onChange,
  label,
  required,
  min,
  max,
}: DateInputProps) {
  const dateObj = value ? new Date(value) : null;
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 mb-1">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <DatePicker
        selected={dateObj}
        onChange={(dt: Date | null) =>
          dt ? onChange(dt.toISOString().slice(0, 10)) : onChange("")
        }
        dateFormat="yyyy-MM-dd"
        className="w-full border px-3 py-2 rounded"
        minDate={min ? new Date(min) : undefined}
        maxDate={max ? new Date(max) : undefined}
        required={required}
        placeholderText="YYYY-MM-DD"
      />
    </div>
  );
}
