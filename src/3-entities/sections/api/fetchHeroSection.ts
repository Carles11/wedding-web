import { supabase } from "@/4-shared/api/supabaseClient";
import type { HeroSection } from "@/4-shared/types";

// Fetch the hero section for a specific site (multi-tenant/SaaS)
export async function fetchHeroSection(
  siteId: string
): Promise<HeroSection | null> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("type", "hero")
    .single();

  if (error || !data) return null;

  // Parse hero.title if it's a string
  if (typeof data.title === "string") {
    try {
      data.title = JSON.parse(data.title);
    } catch (e) {
      data.title = { es: "", ca: "" };
    }
  }
  return data as HeroSection;
}
