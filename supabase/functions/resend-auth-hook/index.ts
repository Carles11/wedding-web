/// <reference lib="deno.ns" />

import { Resend } from "resend";
import { Webhook } from "standardwebhooks";
import { EMAIL_TRANSLATIONS } from "../../email-translations.ts";

interface User {
  email: string;
  user_metadata?: {
    language?: string;
  };
}

interface EmailData {
  type?: string;
  email_action_type?: string;
  confirmation_url?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env
  .get("SEND_EMAIL_HOOK_SECRET")
  ?.replace("v1,whsec_", "");

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // We get the raw text payload for webhook verification
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    if (!hookSecret) {
      throw new Error("Missing SEND_EMAIL_HOOK_SECRET environment variable");
    }

    // 1. Verify the webhook signature
    const wh = new Webhook(hookSecret);
    const { user, email_data } = wh.verify(payload, headers) as {
      user: User;
      email_data: EmailData;
    };

    // 2. Sniff language from URL or metadata
    const confirmationUrl = email_data.confirmation_url || "";
    const urlParts = confirmationUrl.split("/");
    const supportedLangs = Object.keys(EMAIL_TRANSLATIONS);

    // Find language in URL (e.g., /es/ or /fr/)
    const langFromUrl = urlParts.find((part: string) =>
      supportedLangs.includes(part),
    );

    // Fallback: URL -> Metadata -> English
    const lang = langFromUrl || user.user_metadata?.language || "en";

    // 3. Get content based on event type
    // email_data.type is used for traditional flows, email_action_type for newer hooks
    const eventType = email_data.type || email_data.email_action_type || "";
    const content =
      EMAIL_TRANSLATIONS[lang]?.[eventType] || EMAIL_TRANSLATIONS.en[eventType];

    if (!content) {
      throw new Error(
        `No translation found for language: ${lang} and event: ${eventType}`,
      );
    }

    // 4. Send via Resend
    const { data, error } = await resend.emails.send({
      from: "WeddWeb <hello@weddweb.com>",
      to: [user.email],
      subject: content.subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">${content.title}</h2>
          <p style="color: #555; line-height: 1.5;">Click the button below to proceed with your request:</p>
          <div style="margin: 30px 0;">
            <a href="${confirmationUrl}" style="background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              ${content.button}
            </a>
          </div>
          <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${confirmationUrl}</p>
        </div>
      `,
    });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error processing auth email:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 401, // Use 401 to indicate verification failure or unauthorized access
      headers: { "Content-Type": "application/json" },
    });
  }
});
