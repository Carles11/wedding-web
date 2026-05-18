import { SEOService } from "@/4-shared/api/seo/seoService";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Simple secret key protection to prevent public spamming
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.INDEXNOW_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Invoke your service for the core apex domain across all 11 scripts
    await SEOService.syncWithSearchEngines(["weddweb.com"], null, true, [
      ...SUPPORTED_LANGUAGES,
    ]);

    return NextResponse.json({
      success: true,
      message: "Marketing SEO sync triggered successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
