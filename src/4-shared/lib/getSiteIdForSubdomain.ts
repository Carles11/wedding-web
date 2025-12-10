import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getSiteIdForSubdomain(
  subdomain: string
): Promise<string | null> {
  if (!subdomain) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .single();

  if (error) {
    console.error("Supabase subdomain lookup error:", error);
    return null;
  }

  return data?.id || null;
}
