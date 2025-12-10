import { createClient } from "@supabase/supabase-js";

// These env variables must be set in your .env.local for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Utility: SSR-safe tenant lookup by domain (host)
export async function getSiteIdForDomain(
  domain: string
): Promise<string | null> {
  if (!domain) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .eq("domain", domain)
    .single();

  if (error) {
    // Log for debugging; in production, you might want to suppress this
    console.error("Supabase site lookup error:", error);
    return null;
  }

  return data?.id || null;
}
