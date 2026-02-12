import { supabase } from "@/4-shared/api/supabaseClient";
import type { HeroSection } from "@/4-shared/types";

// Fetch the hero section for a specific site (multi-tenant/SaaS)
export async function fetchHeroSection(
  siteId: string,
): Promise<HeroSection | null> {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("type", "hero")
    .maybeSingle();

  if (error || !data) return null;

  // Parse hero.title if it's unexpectedly stored as a JSON string in the DB.
  const maybeTitle = data as unknown as { title: unknown };
  if (typeof maybeTitle.title === "string") {
    try {
      const parsed = JSON.parse(maybeTitle.title) as Record<string, string>;
      (data as HeroSection).title = parsed;
    } catch (e) {
      (data as HeroSection).title = { es: "", ca: "" };
    }
  }

  return data as HeroSection;
}
