/// <reference lib="deno.ns" />

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { EMAIL_TRANSLATIONS } from "../../email-translations.ts";

type InviteRequestBody = {
  site_id: string;
  party_id: string;
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const assertEnv = (name: string) => {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
};

const applyTemplate = (str: string, vars: Record<string, string>) =>
  str.replace(/\{\{(\w+)\}\}/g, (_m, k) => vars[k] ?? `{{${k}}}`);

const randomAccessCodeUrlSafe = (byteLen = 32): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLen));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const sha256Hex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
};

type DomainStatuses = Record<string, string> | null;

const getPublicSiteBaseUrl = (site: {
  subdomain: string | null;
  domains: string[] | null;
  domain_statuses: DomainStatuses;
}) => {
  const isLocal = Deno.env.get("SUPABASE_DEV") === "true";
  if (!site.subdomain) throw new Error("Site has no subdomain");

  // Local dev: always route via localhost (HTTP).
  if (isLocal) {
    return `http://${site.subdomain}.localhost:3000`;
  }

  const allDomains = Array.isArray(site.domains)
    ? site.domains.filter(Boolean)
    : [];
  const prodDomains = allDomains.filter((d) => !/localhost/i.test(d));

  const statuses: Record<string, string> =
    site.domain_statuses && typeof site.domain_statuses === "object"
      ? (site.domain_statuses as Record<string, string>)
      : {};

  // Keep only VERIFIED domains
  const verified = prodDomains.filter((d) => statuses[d] === "verified");

  // Prefer www first if both exist
  const pick = verified.find((d) => d.startsWith("www.")) ?? verified[0];

  // If no verified custom domain exists, fall back to the platform subdomain
  if (!pick) {
    return `https://${site.subdomain}.weddweb.com`;
  }

  return `https://${pick}`;
};

const getLangToUse = (preferred: unknown, fallback: unknown): string => {
  const preferredStr = typeof preferred === "string" ? preferred : "";
  const fallbackStr = typeof fallback === "string" ? fallback : "";
  if (preferredStr && EMAIL_TRANSLATIONS[preferredStr]) return preferredStr;
  if (fallbackStr && EMAIL_TRANSLATIONS[fallbackStr]) return fallbackStr;
  return "en";
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Same auth guard pattern as legacy-notification:
  // require an internal secret to be present in Authorization header.
  const authHeader = req.headers.get("Authorization") || "";
  const serviceKey = Deno.env.get("MY_CUSTOM_SERVICE_KEY") || "";
  if (!serviceKey || !authHeader.includes(serviceKey)) {
    return json({ error: "Missing Auth" }, 401);
  }

  try {
    const body = (await req.json()) as Partial<InviteRequestBody>;
    const site_id = typeof body.site_id === "string" ? body.site_id : "";
    const party_id = typeof body.party_id === "string" ? body.party_id : "";

    if (!site_id || !party_id) {
      return json({ error: "Missing required fields: site_id, party_id" }, 400);
    }

    const SUPABASE_URL = assertEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = assertEnv("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1) Fetch party
    const { data: party, error: partyErr } = await supabase
      .from("rsvp_parties")
      .select("id, site_id, name, email, preferred_lang, is_active")
      .eq("id", party_id)
      .eq("site_id", site_id)
      .maybeSingle();

    if (partyErr) throw partyErr;
    if (!party) return json({ error: "Party not found" }, 404);
    if (!party.is_active) return json({ error: "Party is inactive" }, 400);

    // 2) Fetch site (for title + domain + default lang)
    const { data: site, error: siteErr } = await supabase
      .from("sites")
      .select("id, title, subdomain, domains, domain_statuses, default_lang")
      .eq("id", site_id)
      .maybeSingle();

    if (siteErr) throw siteErr;
    if (!site) return json({ error: "Site not found" }, 404);

    const lang = getLangToUse(party.preferred_lang, site.default_lang);

    // 3) Rotate access code hash
    const rawCode = randomAccessCodeUrlSafe(32);
    const accessCodeHash = await sha256Hex(rawCode);

    const { error: updErr } = await supabase
      .from("rsvp_parties")
      .update({ access_code_hash: accessCodeHash })
      .eq("id", party_id)
      .eq("site_id", site_id);

    if (updErr) throw updErr;

    // 4) Build RSVP URL
    const baseUrl = getPublicSiteBaseUrl({
      subdomain: site.subdomain ?? null,
      domains: (site.domains as string[] | null) ?? null,
      domain_statuses:
        (site.domain_statuses as Record<string, string> | null) ?? null,
    });

    const rsvpUrl = `${baseUrl}/${encodeURIComponent(lang)}/rsvp?code=${encodeURIComponent(rawCode)}`;

    // 5) Translate
    const content =
      EMAIL_TRANSLATIONS[lang]?.rsvp_invite ??
      EMAIL_TRANSLATIONS.en?.rsvp_invite;

    if (!content)
      throw new Error(
        `Missing EMAIL_TRANSLATIONS for rsvp_invite (lang=${lang})`,
      );

    const vars = {
      party_name: party.name,
      wedding_title: site.title,
      rsvp_url: rsvpUrl,
    };

    const subject = applyTemplate(content.subject, vars);
    const title = applyTemplate(content.title, vars);
    const description = applyTemplate(content.description, vars);
    const button = applyTemplate(content.button, vars);

    // 6) Send email
    const from =
      Deno.env.get("RESEND_FROM_EMAIL") || "WeddWeb <hello@weddweb.com>";

    const { data, error } = await resend.emails.send({
      from,
      to: [party.email],
      subject,
      html: `
        <div style="background-color:#f9fafb;padding:40px 20px;font-family:sans-serif;color:#292d41;text-align:center;">
          <div style="max-width:600px;margin:0 auto;background-color:#fff;border-radius:12px;padding:40px;border:1px solid #e8e6e1;">
            <h1 style="color:#6abda6;font-size:24px;">${title}</h1>
            <p style="font-size:16px;line-height:1.6;color:#4b5563;">
              ${description}
            </p>
            <div style="margin:30px 0;">
              <a href="${rsvpUrl}" style="background-color:#6abda6;color:#fff;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block;">
                ${button}
              </a>
            </div>
            <p style="font-size:12px;color:#9ca3af;word-break:break-word;">
              ${rsvpUrl}
            </p>
          </div>
        </div>
      `,
    });

    if (error) throw error;

    return json(
      {
        ok: true,
        site_id,
        party_id,
        email: party.email,
        lang,
        resend: data,
      },
      200,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return json({ error: errorMessage }, 500);
  }
});
