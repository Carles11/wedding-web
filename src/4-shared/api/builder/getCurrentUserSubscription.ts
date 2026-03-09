import { createClient } from "@/4-shared/lib/supabase/client";
import type { Subscription } from "@/4-shared/types";

export async function getCurrentUserSubscription(
  user_id: string,
): Promise<Subscription | null> {
  const supabase = await createClient();
  console.log(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx:_user_id in getCURRENTSUBSCRIPTON",
    user_id,
  );
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log("XXXXXXXXXXXXXXXXXXXXXXXgetCurrentUserSubscription: data", data);
  console.log(
    "XXXXXXXXXXXXXXXXXXXXXXXgetCurrentUserSubscription: error",
    error,
  );

  if (error || !data) return null;
  return data as Subscription;
}
