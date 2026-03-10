export async function verifyCustomDomainClient(siteId: string, domain: string) {
  const res = await fetch(`/api/sites/${siteId}/verify-domain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Failed to verify domain");
  }
  return await res.json();
}
