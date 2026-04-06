export async function removeCustomDomainClient(siteId: string, domain: string) {
  const res = await fetch(`/api/sites/${siteId}/remove-domain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => {});
    throw new Error(data?.error || "Failed to remove domain");
  }
  return await res.json();
}
