import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function parseIsoDateToLocalDate(value?: string): Date | null {
  if (!value) return null;

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  // Use local noon to avoid timezone and DST boundary shifts.
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatLocalDateToIso(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const dateObj = parseIsoDateToLocalDate(value);
  const minDate = parseIsoDateToLocalDate(min);
  const maxDate = parseIsoDateToLocalDate(max);

  return (
    <div className="w-fit">
      {label && (
        <label className="block text-xs text-gray-600 mb-1">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <DatePicker
        selected={dateObj}
        onChange={(dt: Date | null) =>
          dt ? onChange(formatLocalDateToIso(dt)) : onChange("")
        }
        dateFormat="yyyy-MM-dd"
        className="w-full border px-3 py-2 rounded mb-2"
        minDate={minDate ?? undefined}
        maxDate={maxDate ?? undefined}
        required={required}
        placeholderText="YYYY-MM-DD"
      />
    </div>
  );
}
