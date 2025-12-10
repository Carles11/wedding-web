// src/4-shared/lib/getSiteDefaultLang.ts
import { supabase } from "@/4-shared/api/supabaseClient";

export async function getSiteDefaultLang(siteId: string): Promise<string> {
  const { data } = await supabase
    .from("sites")
    .select("default_lang")
    .eq("id", siteId)
    .single();
  return data?.default_lang ?? "ca";
}
