import { createClient } from "@/4-shared/lib/supabase/client";
import type { Subscription } from "@/4-shared/types";

/**
 * Client-only: Fetch current user's subscription using browser Supabase client.
 * This works in React client components, hooks.
 */
export async function getCurrentUserSubscription(
  user_id: string,
): Promise<Subscription | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as Subscription;
}
