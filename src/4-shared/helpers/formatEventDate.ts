export function formatEventDate(
  date?: string,
  time?: string,
  lang: string = "en",
): string {
  if (!date) return "";
  // Combine time with date if present
  let dateObj: Date;
  if (time) {
    // Some DBs store time as HH:mm:ss, but Intl.DateTimeFormat prefers HH:mm
    const dateTime = `${date}T${time.slice(0, 5)}`;
    dateObj = new Date(dateTime);
  } else {
    dateObj = new Date(date);
  }

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
