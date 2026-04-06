export function formatWhereWedding(
  mainEventId: string,
  translations: Record<string, string>,
): string {
  const title = translations[`program.event.title.${mainEventId}`] ?? "";
  const location = translations[`program.event.location.${mainEventId}`] ?? "";
  const description =
    translations[`program.event.description.${mainEventId}`] ?? "";

  // Only include line if it has content
  return [title, location, description].filter(Boolean).join("\n");
}
