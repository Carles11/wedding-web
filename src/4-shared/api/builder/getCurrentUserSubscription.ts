import { createClient } from "@/4-shared/lib/supabase/client";

export async function getCurrentUserSubscription(
  user_id: string,
): Promise<"free" | "monthly" | "yearly"> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_type, status")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return "free";
  if (
    ["active", "trialing"].includes(data.status) &&
    ["monthly", "yearly"].includes(data.plan_type)
  ) {
    return data.plan_type as "monthly" | "yearly";
  }
  return "free";
}
