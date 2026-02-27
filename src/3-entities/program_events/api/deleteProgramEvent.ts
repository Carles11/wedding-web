import { createClient } from "@/4-shared/lib/supabase/client";

export async function deleteProgramEvent(id: string): Promise<boolean> {
  if (!id) return false;

  const supabase = await createClient();

  const { error } = await supabase.from("program_events").delete().eq("id", id);
  if (error) {
    console.error("[deleteProgramEvent] DB delete error:", error);
    return false;
  }
  return true;
}
