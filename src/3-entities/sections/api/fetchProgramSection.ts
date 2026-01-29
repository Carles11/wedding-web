import { supabase } from "@/4-shared/api/supabaseClient";
import type { ProgramSection } from "@/4-shared/types";

// Fetches the "program" section for a given site (SaaS/multi-tenant-safe)
export async function fetchProgramSection(
  siteId: string,
): Promise<ProgramSection | null> {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("type", "program")
    .maybeSingle();

  if (error) {
    console.error("fetchProgramSection:", error);
    return null;
  }

  if (!data) return null;

  return data as ProgramSection;
}
