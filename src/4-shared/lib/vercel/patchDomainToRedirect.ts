import {
  addDomainToVercelProject,
  getVercelProjectDomain,
  removeDomainFromVercelProject,
} from "@/4-shared/lib/vercel/vercel-domains";

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

export async function patchDomainToRedirect(
  fromDomain: string,
  destinationDomain: string,
) {
  const source = normalizeDomain(fromDomain);
  const destination = normalizeDomain(destinationDomain);

  if (source === destination) {
    throw new Error("A domain cannot redirect to itself");
  }

  const existing = await getVercelProjectDomain(source);
  if (existing?.redirect === destination) {
    return;
  }

  if (existing) {
    const removeResult = await removeDomainFromVercelProject(source);
    if (removeResult.status === "error") {
      throw new Error(removeResult.error || "Failed to replace redirect domain");
    }
  }

  const addResult = await addDomainToVercelProject(source, {
    redirect: destination,
    redirectStatusCode: 308,
  });

  if (addResult.status === "error") {
    throw new Error(addResult.error || "Redirect failed");
  }
}
