export function toApexDomain(domainInput: string): string {
  return domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "")
    .replace(/^www\./, "");
}
