import { NextRequest, NextResponse } from "next/server";
import { addCustomDomain } from "@/2-features/custom-domain/api/addCustomDomain";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";

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
    const translations = await fetchBuilderTranslations(lang);

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

    const result = await addCustomDomain(id, domain);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[add-domain] error:", error);

    // Conservative: error messages may not be in translations, fallback ALWAYS in English
    return NextResponse.json(
      {
        error:
          (await fetchBuilderTranslations("en"))[
            "builder.domain.server_error"
          ] || "Server error",
      },
      { status: 500 },
    );
  }
}
