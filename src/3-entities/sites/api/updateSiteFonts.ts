"use server";

import {
  AVAILABLE_BODY_FONTS,
  AVAILABLE_TITLE_FONTS,
} from "@/4-shared/lib/fonts/fontRegistry";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

export async function updateSiteFonts(
  siteId: string,
  titleFont: string,
  bodyFont: string,
) {
  if (!siteId) {
    return { success: false, error: "Site ID is required" };
  }

  const validTitle = AVAILABLE_TITLE_FONTS.some((f) => f.id === titleFont);
  const validBody = AVAILABLE_BODY_FONTS.some((f) => f.id === bodyFont);
  if (!validTitle || !validBody) {
    return { success: false, error: "Invalid font selection" };
  }

  const supabase = await createSupabaseSSRClient();

  const { error } = await supabase
    .from("sites")
    .update({ title_font: titleFont, body_font: bodyFont })
    .eq("id", siteId);

  if (error) {
    console.error("[updateSiteFonts] error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
