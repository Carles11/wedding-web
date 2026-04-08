import { toApexDomain } from "@/4-shared/helpers/domains/toApexDomain";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { addDomainToVercelProject } from "@/4-shared/lib/vercel/vercel-domains";

// Accepts: siteId, domain string
export async function addCustomDomain(siteId: string, domain: string) {
  const cleanDomain = toApexDomain(domain);

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(cleanDomain)) {
    throw new Error("Invalid domain format");
  }

  const supabase = await createSupabaseSSRClient();

  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select(
      "pending_custom_domains, domain_statuses, domains, domain_provider_api_url",
    )
    .eq("id", siteId)
    .maybeSingle();
  if (fetchError || !site) throw new Error("Site not found");

  if (
    site.domains?.includes(cleanDomain) ||
    site.pending_custom_domains?.includes(cleanDomain) ||
    (site.domain_statuses && site.domain_statuses[cleanDomain])
  ) {
    throw new Error("Domain already exists for this site");
  }

  let providerUrl: string | null = site.domain_provider_api_url ?? null;

  try {
    console.log("🚀 ATTEMPTING DISCOVERY FOR:", cleanDomain);
    const { data: discoveryData, error: discoveryError } =
      await supabase.functions.invoke("discover-provider-url", {
        body: { domain: cleanDomain },
      });

    if (discoveryError) {
      console.error("❌ EDGE FUNCTION ERROR:", discoveryError); // Changed to console.error
    } else {
      console.log("✅ EDGE FUNCTION RESULT:", discoveryData);
    }

    if (discoveryError) {
      console.warn("Domain Connect discovery failed:", discoveryError.message);
    } else if (
      discoveryData &&
      typeof discoveryData.providerUrl === "string" &&
      discoveryData.providerUrl.trim()
    ) {
      providerUrl = discoveryData.providerUrl.trim();
    }
  } catch (error) {
    console.warn("Domain Connect discovery failed:", error);
  }

  // Append to pending in DB first (so UI updates immediately)
  const pending_custom_domains = [
    ...(site.pending_custom_domains || []),
    cleanDomain,
  ];
  const domain_statuses = {
    ...(site.domain_statuses || {}),
    [cleanDomain]: "pending",
  };

  // Save to DB before starting Vercel API call (*UX improvement)
  await supabase
    .from("sites")
    .update({
      pending_custom_domains,
      domain_statuses,
      domain_provider_api_url: providerUrl,
    })
    .eq("id", siteId);

  // Now actually add domain to Vercel
  const vercelResult = await addDomainToVercelProject(cleanDomain);

  // If error, update domain status accordingly for UI/UX
  if (vercelResult.status === "error") {
    domain_statuses[cleanDomain] = "error";
    await supabase.from("sites").update({ domain_statuses }).eq("id", siteId);
    throw new Error(vercelResult.error || "Failed to add domain to Vercel");
  }

  // Vercel now takes over; polling/verification status will be used next
  return { success: true, domain: cleanDomain };
}
