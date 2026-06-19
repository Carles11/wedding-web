import { useEffect, useState } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function TimeInput({
  value,
  onChange,
  label,
  required,
}: TimeInputProps) {
  const [hh, setHh] = useState("");
  const [mm, setMm] = useState("");

  useEffect(() => {
    const [nextHh = "", nextMm = ""] = value ? value.split(":") : ["", ""];
    setHh(nextHh);
    setMm(nextMm);
  }, [value]);

  const handleChange = (newHh: string, newMm: string) => {
    setHh(newHh);
    setMm(newMm);

    if (!newHh && !newMm) {
      onChange("");
      return;
    }

    if (newHh && newMm) {
      onChange(`${newHh}:${newMm}`);
    }
  };

  const selectClass = `
    appearance-none cursor-pointer w-16 text-center
    border border-(--builder-color-border) rounded-lg
    px-2 py-2 text-sm bg-(--builder-color-surface)
    text-(--builder-color-text)
    focus:outline-none focus:border-(--builder-color-primary)
    focus:ring-2 focus:ring-(--builder-color-primary)/20
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-600 mb-1 dark:text-gray-400">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <div className="flex items-center gap-1.5">
        <select
          value={hh}
          onChange={(e) => handleChange(e.target.value, mm)}
          className={selectClass}
        >
          <option value="">--</option>
          {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(
            (h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ),
          )}
        </select>
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500">:</span>
        <select
          value={mm}
          onChange={(e) => handleChange(hh, e.target.value)}
          className={selectClass}
        >
          <option value="">--</option>
          {[
            "00",
            "05",
            "10",
            "15",
            "20",
            "25",
            "30",
            "35",
            "40",
            "45",
            "50",
            "55",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
