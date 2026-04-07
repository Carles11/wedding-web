import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

export async function upsertCurrentUserSubscription(subscriptionPayload: any) {
  console.log(
    "[DB Debug] Attempting upsert with:",
    JSON.stringify(subscriptionPayload),
  );

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(subscriptionPayload, {
      onConflict: "user_id",
    })
    .select(); // Remove .single() for the test to see if it's returning an array

  if (error) {
    console.error("[DB Debug] Detailed Postgres Error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  return { data: data?.[0] || null, error };
}
