import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { HeroSectionType } from "@/4-shared/types";

// Fetch the hero section for a specific site (multi-tenant/SaaS)
export async function fetchHeroSection(
  siteId: string,
  lang: string,
  fallbackLang: string = "en",
): Promise<HeroSectionType | null> {
  if (!siteId) return null;

  const supabase = await createSupabaseSSRClient();
  // Fetch the hero section structure/content
  const { data: heroRow, error } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("type", "hero")
    .maybeSingle();

  if (error || !heroRow) return null;

  // Fetch translations for hero title and description
  const { data: translations, error: trError } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", siteId)
    .in("key", ["sections.hero.title", "sections.hero.description"])
    .in("locale", [lang, fallbackLang]);

  if (trError) return null;

  // Load translation values
  const heroTitle =
    translations?.find(
      (t) => t.key === "sections.hero.title" && t.locale === lang,
    )?.value ||
    translations?.find(
      (t) => t.key === "sections.hero.title" && t.locale === fallbackLang,
    )?.value ||
    "";

  const heroDescription =
    translations?.find(
      (t) => t.key === "sections.hero.description" && t.locale === lang,
    )?.value ||
    translations?.find(
      (t) => t.key === "sections.hero.description" && t.locale === fallbackLang,
    )?.value ||
    "";

  // Parse the image field from heroRow content/background as before
  let backgroundImage = "";
  try {
    const contentObj =
      typeof heroRow.content === "string"
        ? JSON.parse(heroRow.content)
        : heroRow.content;
    backgroundImage = contentObj?.backgroundImage ?? heroRow.background ?? "";
  } catch {
    backgroundImage = heroRow.background ?? "";
  }

  return {
    id: heroRow.id,
    site_id: heroRow.site_id,
    type: heroRow.type,
    title: heroTitle,
    description: heroDescription,
    backgroundImage,
    sort_order: heroRow.sort_order,
  };
}
