export function formatTime(t?: string | null) {
  if (!t) return "";
  // handles "13:00:00" and "13:00"
  return t.slice(0, 5);
}

export function timeToMinutes(t?: string | null) {
  if (!t) return Number.POSITIVE_INFINITY;

  // supports "13:00" and "13:00:00"
  const [h, m] = t.split(":");
  const hh = Number(h);
  const mm = Number(m);

  if (Number.isNaN(hh) || Number.isNaN(mm)) {
    return Number.POSITIVE_INFINITY;
  }

  return hh * 60 + mm;
}
