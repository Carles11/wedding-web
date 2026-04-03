/// <reference lib="deno.ns" />

import { Resend } from "resend";
import { Webhook } from "standardwebhooks";
import { EMAIL_TRANSLATIONS } from "../../email-translations.ts";

interface User {
  email: string;
  user_metadata?: {
    language?: string;
    preferred_language?: string;
  };
}

interface EmailData {
  type?: string;
  email_action_type?: string;
  confirmation_url?: string;
  site_url?: string;
  redirect_to?: string;
  action_link?: string;
  token_hash?: string;
  new_email?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env
  .get("SEND_EMAIL_HOOK_SECRET")
  ?.replace("v1,whsec_", "");

Deno.serve(async (req) => {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    if (!hookSecret) throw new Error("Missing SEND_EMAIL_HOOK_SECRET");

    const wh = new Webhook(hookSecret);
    const verified = wh.verify(payload, headers) as {
      user: User;
      email_data: EmailData;
    };
    const { user, email_data } = verified;

    // 1. Determine Event Type
    const eventType =
      email_data.type || email_data.email_action_type || "signup";

    // 2. Determine if this is a real Confirmation (has token) or just a Security Notification
    const isConfirmation = !!email_data.token_hash;

    // 3. Determine Recipient
    // If it's a confirmation for a new email, Supabase provides 'new_email'
    // If it's a notification/default, it goes to 'user.email'
    const toEmail =
      eventType === "email_change" && email_data.new_email
        ? email_data.new_email
        : user.email;

    // 4. Determine Language
    const supportedLangs = Object.keys(EMAIL_TRANSLATIONS);
    const lang =
      user.user_metadata?.language ||
      user.user_metadata?.preferred_language ||
      supportedLangs.find((l) => email_data.redirect_to?.includes(`/${l}/`)) ||
      "en";

    // 5. SMART ROUTING
    let finalDestination = `/${lang}/builder/onboarding`;
    if (eventType === "recovery") {
      finalDestination = `/${lang}/auth/reset-password`;
    } else if (eventType === "email_change") {
      finalDestination = `/${lang}/builder/account`;
    }

    // 6. URL CONSTRUCTION (Only if confirmation is required)
    let confirmationUrl = "";
    if (isConfirmation) {
      const origin = email_data.redirect_to
        ? new URL(email_data.redirect_to).origin
        : "http://localhost:3000";

      const confirmPagePath = `${origin}/${lang}/auth/confirm`;
      confirmationUrl = `${confirmPagePath}?token_hash=${email_data.token_hash}&type=${eventType}&next=${encodeURIComponent(finalDestination)}`;
    }

    console.log(
      `[DEBUG] Event: ${eventType} | Confirmation: ${isConfirmation} | Recipient: ${toEmail}`,
    );

    // 7. Get Email Content
    const content =
      EMAIL_TRANSLATIONS[lang]?.[eventType] || EMAIL_TRANSLATIONS.en[eventType];
    if (!content)
      throw new Error(`No translation for ${lang} and ${eventType}`);

    // 8. Send via Resend
    const { data, error } = await resend.emails.send({
      from: "WeddWeb <hello@weddweb.com>",
      to: [toEmail],
      subject: content.subject,
      html: `
        <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292d41; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e8e6e1; padding: 40px;">
            <h1 style="font-family: Georgia, serif; color: #6abda6; font-size: 28px; margin-bottom: 20px; font-weight: normal;">${content.title}</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px;">${content.description}</p>
            
            ${
              isConfirmation
                ? `
            <div style="margin: 35px 0;">
              <a href="${confirmationUrl}" 
                 style="background-color: #6abda6; border: 12px solid #6abda6; color: #ffffff; padding: 0 30px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; cursor: pointer;">
                <span style="color: #ffffff;">${content.button}</span>
              </a>
            </div>
            <p style="font-size: 13px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #6abda6; word-break: break-all; text-decoration: none;">${confirmationUrl}</a>
            </p>
            `
                : `
            <div style="margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
              <p style="font-size: 13px; color: #9ca3af;">
                This is a security notification. If you did not request this change, please contact support immediately.
              </p>
            </div>
            `
            }
          </div>
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
      status: 401,
    });
  }
});
