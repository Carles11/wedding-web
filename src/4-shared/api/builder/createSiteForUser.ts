"use server";

import { triggerSeoSync } from "@/4-shared/api/seo/triggerSeoSync";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type { Site } from "@/4-shared/types";
import { after } from "next/server";

export async function createSiteForUser(user: {
  id: string;
  email: string | null;
  preferredLanguage?: string | null;
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
  const initialLang = isValidLanguage(user.preferredLanguage ?? undefined)
    ? user.preferredLanguage
    : "en";

  const isRealDeployment =
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

  const defaultDomains = isRealDeployment
    ? [
        `${defaultSubdomain}.weddweb.com`,
        `www.${defaultSubdomain}.weddweb.com`,
      ]
    : [
        `${defaultSubdomain}.localhost:3000`,
        `www.${defaultSubdomain}.localhost:3000`,
        `${defaultSubdomain}.weddweb.com`,
        `www.${defaultSubdomain}.weddweb.com`,
      ];

  // 1. Insert site row
  const { data: siteData, error: siteError } = await supabaseAdmin
    .from("sites")
    .insert([
      {
        owner_user_id: user.id,
        title: defaultTitle,
        subdomain: defaultSubdomain,
        default_lang: initialLang,
        languages: [initialLang],
        domains: defaultDomains,
      },
    ])
    .select("id, subdomain, default_lang, languages, domains, seo_enabled")
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

  // Non-blocking SEO sync — runs after the response is sent
  after(() => triggerSeoSync(siteData.id));

  return siteData as Site;
}
