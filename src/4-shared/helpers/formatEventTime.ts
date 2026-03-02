// Helper to format time as HH:mm (with h), handling empty/null
export function formatEventTime(time?: string | null) {
  if (!time) return "";
  const [hour, min] = time.split(":");
  return `${hour.padStart(2, "0")}:${min.padStart(2, "0")}h`;
}
