"use server";

import { SEOService } from "@/4-shared/api/seo/seoService";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Server action to trigger IndexNow SEO sync for a site.
 * Callable from both server-side code and client components (via RPC).
 * Fetches fresh site data to ensure accuracy and respects seo_enabled.
 */
export async function triggerSeoSync(siteId: string): Promise<void> {
  try {
    const { data: site } = await supabaseAdmin
      .from("sites")
      .select("domains, domain_statuses, seo_enabled, languages")
      .eq("id", siteId)
      .maybeSingle();

    if (!site?.seo_enabled) return;

    await SEOService.syncWithSearchEngines(
      site.domains ?? [],
      site.domain_statuses ?? null,
      site.seo_enabled,
      site.languages ?? [],
    );
  } catch (e) {
    console.error("[SEO] triggerSeoSync failed:", e);
  }
}
