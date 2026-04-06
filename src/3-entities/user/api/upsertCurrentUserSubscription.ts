import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { Subscription } from "@/4-shared/types/billing";

export async function upsertCurrentUserSubscription(
  subscriptionPayload: Partial<Subscription>,
) {
  // We return the result of the query directly
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(subscriptionPayload, {
      onConflict: "user_id",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  return { data, error };
}
