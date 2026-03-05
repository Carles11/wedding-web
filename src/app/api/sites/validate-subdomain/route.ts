import { isValidSubdomain } from "@/4-shared/utils/validations/subdomain";
import { createClient } from "@/4-shared/lib/supabase/client";

export async function GET(req: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const subdomain = searchParams.get("subdomain");
  if (!subdomain)
    return Response.json({ valid: false, reason: "invalid" }, { status: 400 });
  if (!isValidSubdomain(subdomain)) {
    return Response.json({ valid: false, reason: "invalid" });
  }
  // Uniqueness check
  const { data: existing } = await supabase
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();
  if (existing) return Response.json({ valid: false, reason: "taken" });
  // Reserved words, if logic is external to isValidSubdomain
  // ...
  return Response.json({ valid: true });
}
