import { toApexDomain } from "./toApexDomain";

export function getDomainVariants(domainInput: string): {
  apex: string;
  www: string;
} {
  const apex = toApexDomain(domainInput);
  return { apex, www: `www.${apex}` };
}
