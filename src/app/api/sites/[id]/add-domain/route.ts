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

    const result = await addCustomDomainWithRedirectVariants(id, domain);
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
