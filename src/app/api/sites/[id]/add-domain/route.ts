import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { getParams, RouteContext } from "@/4-shared/lib/route-context";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import {
  addCustomDomainWithRedirectVariants,
  DomainFlowError,
} from "@/4-shared/lib/vercel/addCustomDomainWithRedirectVariants";
import { NextRequest, NextResponse } from "next/server";

// Helper to select the language (default fallback 'en' if not specified/requested)
function getLang(req: NextRequest): string {
  return (
    req.headers.get("accept-language")?.split(",")[0].split("-")[0] || "en"
  );
}

export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>,
) {
  try {
    const lang = getLang(req);
    const supabase = await createSupabaseSSRClient();
    const translations = await fetchBuilderTranslations(supabase, lang, "en");

    const { id } = await getParams(context);
    const { domain } = await req.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        {
          error:
            translations["builder.domain.invalid_domain"] || "Invalid domain",
        },
        { status: 400 },
      );
    }
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          error:
            translations["builder.domain.invalid_site_id"] || "Invalid site id",
        },
        { status: 400 },
      );
    }

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status },
      );
    }

    const subscription = await getCurrentUserSubscription(access.user.id);
    if (subscription?.plan_type !== "premium") {
      return NextResponse.json(
        {
          error:
            translations["builder.domain.custom_domain_locked"] ||
            "Custom domains are available only on Premium plan.",
        },
        { status: 403 },
      );
    }

    // 0. Get the previous custom domain, if any
    const { data: site, error: fetchError } = await supabase
      .from("sites")
      .select("domains")
      .eq("id", id)
      .maybeSingle();

    const PLATFORM_SUFFIXES = [".localhost:3000", ".weddweb.com"];

    // Returns true if platform domain
    const isPlatformDomain = (d: string) =>
      PLATFORM_SUFFIXES.some(
        (suffix) => d.endsWith(suffix) || d.endsWith(`www.${suffix}`),
      );

    let oldDomain: string | null = null;
    if (site && Array.isArray(site.domains)) {
      oldDomain =
        site.domains.find((d: string) => !isPlatformDomain(d)) || null;
    }

    // 1. Actually add the custom domain (your business logic)
    const result = await addCustomDomainWithRedirectVariants(id, domain);

    // 2. Log the action in your audit table
    try {
      // Sanitize the domain (your add function should ensure this is safe already)
      const cleanDomain = domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "");
      await supabase.from("domain_change_logs").insert([
        {
          site_id: id,
          user_id: access.user.id,
          old_domain: oldDomain,
          new_domain: cleanDomain, // as before
          event: "add",
        },
      ]);
    } catch (logError) {
      // Don't block main flow on logging error, but log for server investigation
      // In production, use your logger service here
      // eslint-disable-next-line no-console
      console.error("Failed to log domain change action:", logError);
    }

    // 3. Respond to client as usual
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof DomainFlowError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    const supabase = await createSupabaseSSRClient();
    const lang = getLang(req);

    // Conservative: error messages may not be in translations, fallback ALWAYS in English
    return NextResponse.json(
      {
        error:
          (await fetchBuilderTranslations(supabase, lang, "en"))[
            "builder.domain.server_error"
          ] || "Server error",
      },
      { status: 500 },
    );
  }
}
