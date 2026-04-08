// features/builder/custom-domain/lib/domain-connect-helper.ts

export const buildMagicLink = (
  providerApiUrl: string, // Retrieved via DNS TXT lookup
  userDomain: string,
  // Use Vercel's IDs which are already white-listed globally
  serviceId: string = "vercel.com",
  templateId: string = "dns",
) => {
  if (!providerApiUrl) return null;

  // 1. Ensure the provider URL doesn't have a trailing slash
  const baseUrl = providerApiUrl
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .replace(/\/v2$/i, "");

  // 2. Construct the params
  const params = new URLSearchParams({
    domain: userDomain,
    // After success, they come back to your app
    redirect_uri: `https://app.weddweb.com/builder/domain/callback`,
  });

  // 3. The Gold Standard path
  return `https://${baseUrl}/v2/domainTemplates/providers/${serviceId}/services/${templateId}/apply?${params.toString()}`;
};
