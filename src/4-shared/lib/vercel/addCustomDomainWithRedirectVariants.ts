import { addCustomDomain } from "@/2-features/custom-domain/api/addCustomDomain";
import { patchDomainToRedirect } from "@/4-shared/lib/vercel/patchDomainToRedirect";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function addCustomDomainWithRedirectVariants(
  siteId: string,
  domainInput: string,
) {
  const normalized = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  const rootDomain = normalized;
  const wwwDomain = `www.${normalized}`;

  // 1. Add **canonical** domain to DB/ pending/statuses/ Vercel
  await addCustomDomain(siteId, domainInput);

  // 2. Wait 5 seconds (Vercel propagation)
  await delay(5000);

  // 3. Add variant (if input was www, add root; else, add www)
  const alternate = domainInput.startsWith("www.") ? rootDomain : wwwDomain;
  await addCustomDomain(siteId, alternate);

  // 4. Wait again before redirect patch
  await delay(5000);

  // 5. Patch canonical redirect
  if (domainInput.startsWith("www.")) {
    await patchDomainToRedirect(rootDomain, wwwDomain);
  } else {
    await patchDomainToRedirect(wwwDomain, rootDomain);
  }

  return { success: true, domains: [rootDomain, wwwDomain] };
}
