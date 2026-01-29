import { supabase } from "@/4-shared/api/supabaseClient";

export async function deleteProgramEvent(id: string): Promise<boolean> {
  if (!id) return false;

  const { error } = await supabase.from("program_events").delete().eq("id", id);
  if (error) {
    console.error("[deleteProgramEvent] DB delete error:", error);
    return false;
  }
  return true;
}
