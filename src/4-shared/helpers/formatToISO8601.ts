/**
 * Helper to convert various date strings to ISO 8601 format
 * required by schema.org (e.g., 2026-06-20T17:00:00)
 */
function formatToISO8601(dateStr: string): string | null {
  if (!dateStr) return null;

  try {
    // Standardize: Replace spaces with 'T' if a time exists
    // Handles "2026-06-20 17:00" -> "2026-06-20T17:00"
    let standardized = dateStr.trim().replace(/\s+/g, "T");

    // If it's just a date (YYYY-MM-DD), it's already valid ISO 8601 for a date
    const dateObj = new Date(standardized);

    if (isNaN(dateObj.getTime())) return null;

    // Return the ISO string (but remove milliseconds/Z if you want to stay in local time)
    return standardized;
  } catch (e) {
    return null;
  }
}

export { formatToISO8601 };
