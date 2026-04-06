export async function addCustomDomainClient(siteId: string, domain: string) {
  const res = await fetch(`/api/sites/${siteId}/add-domain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => {});
    throw new Error(data?.error || "Failed to add domain");
  }
  return await res.json();
}
