export function getMetaTitle(meta: any): string {
  if (typeof meta?.title === "string") return meta.title;
  // Next.js "absolute" or "default" title object support
  if (meta?.title?.absolute) return meta.title.absolute;
  if (meta?.title?.default) return meta.title.default;
  return "";
}
