"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createSupabaseSSRClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
