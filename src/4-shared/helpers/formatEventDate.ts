function parseEventDateAsLocal(date?: string, time?: string): Date | null {
  if (!date) return null;

  const [yearStr, monthStr, dayStr] = date.split("-");
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

  if (time) {
    const [hourStr, minuteStr] = time.slice(0, 5).split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isInteger(hour) && Number.isInteger(minute)) {
      return new Date(year, month - 1, day, hour, minute, 0, 0);
    }
  }

  // Use local noon for date-only display to prevent timezone day shifts.
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatEventDate(
  date?: string,
  time?: string,
  lang: string = "en",
): string {
  if (!date) return "";
  const dateObj = parseEventDateAsLocal(date, time);
  if (!dateObj || Number.isNaN(dateObj.getTime())) return "";

  // Catalan/Spanish/English formatting logic; add more as needed
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  let formattedDate = dateObj.toLocaleDateString(lang, options);

  // Capitalize only the first letter
  formattedDate =
    formattedDate.charAt(0).toLocaleUpperCase(lang) + formattedDate.slice(1);

  // Format HH:mm, removing seconds
  let formattedTime = "";
  if (time) {
    // Pad zeros to hour/minute if needed, and add "h" suffix
    const [hour, min] = time.split(":");
    formattedTime = `, ${hour.padStart(2, "0")}:${min.padStart(2, "0")}h`;
  }

  return `${formattedDate}${formattedTime}`;
}

export function formatCompactEventDate(
  date?: string | null,
  lang: string = "en",
): string {
  if (!date) return "";

  const dateObj = parseEventDateAsLocal(date);
  if (!dateObj || Number.isNaN(dateObj.getTime())) return "";

  try {
    return new Intl.DateTimeFormat(lang, { dateStyle: "short" }).format(
      dateObj,
    );
  } catch {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(dateObj);
  }
}
