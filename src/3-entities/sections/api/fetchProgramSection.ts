import { supabase } from "@/4-shared/api/supabaseClient";
import type { ProgramSection } from "@/4-shared/types";

// Fetches the "program" section for a given site (SaaS/multi-tenant-safe)
export async function fetchProgramSection(
  siteId: string
): Promise<ProgramSection | null> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("type", "program")
    .single();

  if (error) {
    console.error("fetchProgramSection:", error.message);
    return null;
  }

  return data as ProgramSection;
}
