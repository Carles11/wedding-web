import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { Subscription } from "@/4-shared/types";

export async function getCurrentUserSubscription(
  user_id: string,
): Promise<Subscription | null> {
  const supabase = await createSupabaseSSRClient();
  console.log(
    "xxxxxxxxxxxxxuser_idxxxxxxxxxxxxxxxx:_user_id in getCURRENTSUBSCRIPTON",
    user_id,
  );
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log(
    "XXXXXXXXXXXXdataXXXXXXXXXXXgetCurrentUserSubscription: data",
    data,
  );
  console.log(
    "XXXXXXXXXXXerrorXXXXXXXXXXXXgetCurrentUserSubscription: error",
    error,
  );

  if (error || !data) return null;
  return data as Subscription;
}
