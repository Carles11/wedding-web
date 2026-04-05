/// <reference lib="deno.ns" />

import { Resend } from "resend";
import { EMAIL_TRANSLATIONS } from "../../email-translations.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const getInternalSiteUrl = (subdomain: string) => {
  // Check if we are running locally or in production
  const isLocal = Deno.env.get("SUPABASE_DEV") === "true";

  if (isLocal) {
    return `http://${subdomain}.localhost:3000`;
  }

  return `https://${subdomain}.weddweb.com`;
};

Deno.serve(async (req) => {
  // 1. Get the auth header
  const authHeader = req.headers.get("Authorization") || "";

  // 2. LOG THE TRUTH (This will show us exactly what's wrong)
  console.log("Header start:", authHeader.substring(0, 20));

  // 3. THE FIX: Trust the 'service_role' claim in the JWT
  // If you use the Supabase 'Test' sidebar with 'service_role' selected,
  // the 'authHeader' will be a valid JWT.
  // For maximum reliability, we'll check if it's present.
  const serviceKey = Deno.env.get("MY_CUSTOM_SERVICE_KEY") || "";
  if (!serviceKey || !authHeader.includes(serviceKey)) {
    return new Response(JSON.stringify({ error: "Missing Auth" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    console.log("Processing email for:", body.email);

    const { email, name, lang, wedding_title, subdomain } = body;

    let langToUse = lang || "en"; // Default to English if lang is missing

    // Check if translations exist
    if (!EMAIL_TRANSLATIONS[langToUse]?.legacy_warning) {
      console.error(`Missing translation for lang: ${langToUse}`);
      // Fallback to English so it doesn't crash
      langToUse = "en";
    }

    // Find translation or fallback to English
    const eventType = "legacy_warning";
    const content =
      EMAIL_TRANSLATIONS[langToUse]?.[eventType] ||
      EMAIL_TRANSLATIONS.en[eventType];

    // Build the login URL (Update with your production domain)
    const loginUrl = `https://weddweb.com/${langToUse}/auth/login`;
    const siteUrl = getInternalSiteUrl(subdomain);

    const { data, error } = await resend.emails.send({
      from: "WeddWeb <hello@weddweb.com>",
      to: [email],
      subject: content.subject.replace("{{wedding_title}}", wedding_title),
      html: `
        <div style="background-color: #f9fafb; padding: 40px 20px; font-family: sans-serif; color: #292d41; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e8e6e1;">
            <h1 style="color: #6abda6; font-size: 24px;">${content.title}</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
              ${content.description
                .replace("{{name}}", name)
                .replace("{{wedding_title}}", wedding_title)}
            </p>
            <div style="margin: 30px 0;">
              <a href="${loginUrl}" style="background-color: #6abda6; color: #ffffff; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block;">
                ${content.button}
              </a>
            </div>
            <p style="font-size: 12px; color: #9ca3af;">
              ${siteUrl}
            </p>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
});
