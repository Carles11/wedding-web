import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type { Site } from "@/4-shared/types";

export async function createSiteForUser(user: {
  id: string;
  email: string | null;
}): Promise<Site | null> {
  const defaultSubdomain =
    (user.email ?? user.id)
      .split("@")[0]
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 24) +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const defaultTitle =
    user.email && user.email.includes("@")
      ? `${user.email.split("@")[0]}'s Wedding`
      : "Wedding Site";

  // 1. Insert site row
  const { data: siteData, error: siteError } = await supabaseAdmin
    .from("sites")
    .insert([
      {
        owner_user_id: user.id,
        title: defaultTitle,
        subdomain: defaultSubdomain,
        default_lang: "en",
        languages: ["en"],
        domains: [],
      },
    ])
    .select("id, subdomain, default_lang, languages, domains")
    .maybeSingle();

  if (siteError || !siteData || !siteData.id) {
    throw siteError || new Error("Could not create site");
  }

  // 2. Insert user_sites row for ownership
  const { error: userSitesError } = await supabaseAdmin
    .from("user_sites")
    .insert([
      {
        user_id: user.id,
        site_id: siteData.id,
        role: "owner",
      },
    ]);

  if (userSitesError) {
    throw userSitesError;
  }

  return siteData as Site;
}
