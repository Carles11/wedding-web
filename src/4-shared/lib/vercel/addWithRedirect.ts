import { addDomainToVercelProject } from "./vercel-domains";
import { patchDomainToRedirect } from "./patchDomainToRedirect";

/**
 * Adds the user-entered domain and its alternate (www/non-www), then
 * sets up a platform redirect so all traffic is routed to the canonical preferred domain.
 *
 * @param domainInput The user-entered domain (may start with www. or not)
 */
export async function addDomainWithChainedRedirect(domainInput: string) {
  const normalized = domainInput.toLowerCase().replace(/^www\./, "");
  const rootDomain = normalized;
  const wwwDomain = `www.${normalized}`;

  // 1. Add the first (input) domain
  const firstResult = await addDomainToVercelProject(domainInput);

  if (firstResult.status === "error") {
    throw new Error(firstResult.error ?? "Error adding domain");
  }
  // 2. Add the alternate variant (addDomainToVercelProject is idempotent: 'already exists' is fine)
  const alternate = domainInput.startsWith("www.") ? rootDomain : wwwDomain;
  const secondResult = await addDomainToVercelProject(alternate);

  if (secondResult.status === "error") {
    throw new Error(secondResult.error ?? "Error adding alternate domain");
  }

  // 3. Set up redirect
  // If user entered www, root should redirect to www; else, www redirects to root
  if (domainInput.startsWith("www.")) {
    await patchDomainToRedirect(rootDomain, wwwDomain);
  } else {
    await patchDomainToRedirect(wwwDomain, rootDomain);
  }
}
