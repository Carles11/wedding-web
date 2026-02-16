import { supabase } from "@/4-shared/api/supabaseClient";

export async function getCurrentUserSubscription(user_id: string) {
  // Only one "active" subscription per user should exist (by your schema/logical model)
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_type, status")
    .eq("user_id", user_id)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;

  return (data?.plan_type ?? "free") as "free" | "monthly" | "yearly";
}
