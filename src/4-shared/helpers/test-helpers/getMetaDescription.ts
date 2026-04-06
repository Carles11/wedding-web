export function getMetaDesc(meta: any): string {
  if (typeof meta?.description === "string") return meta.description;
  if (meta?.description?.absolute) return meta.description.absolute;
  if (meta?.description?.default) return meta.description.default;
  return "";
}
