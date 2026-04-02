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
    const { user, email_data } = wh.verify(payload, headers) as {
      user: User;
      email_data: EmailData;
    };

    const confirmationUrl = email_data.confirmation_url || "";
    const supportedLangs = Object.keys(EMAIL_TRANSLATIONS);

    // Sniff language from Metadata or URL
    const lang =
      user.user_metadata?.language ||
      user.user_metadata?.preferred_language ||
      supportedLangs.find((l) => confirmationUrl.includes(`/${l}/`)) ||
      "en";

    const eventType = email_data.type || email_data.email_action_type || "";
    const content =
      EMAIL_TRANSLATIONS[lang]?.[eventType] || EMAIL_TRANSLATIONS.en[eventType];

    if (!content)
      throw new Error(`No translation for ${lang} and ${eventType}`);

    // Send via Resend with your NEW Wedding Styles
    const { data, error } = await resend.emails.send({
      from: "WeddWeb <hello@weddweb.com>",
      to: [user.email],
      subject: content.subject,
      html: `
        <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292d41;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e8e6e1;">
            <div style="padding: 40px; text-align: center;">
              <h1 style="font-family: Georgia, serif; color: #6abda6; font-size: 28px; margin-bottom: 20px; font-weight: normal;">
                ${content.title}
              </h1>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                ${content.description || "We're so excited to help you build the perfect website for your special day. First, please confirm your request by clicking the button below."}
              </p>
              
             <div style="margin: 35px 0;">
  <a href="${confirmationUrl}" 
     style="background-color: #6abda6; 
            color: #ffffff; 
            padding: 14px 32px; 
            border-radius: 50px; 
            text-decoration: none; 
            font-weight: 600; 
            font-size: 16px; 
            display: inline-block;
            line-height: 100%;
            text-align: center;
            cursor: pointer !important;">
    ${content.button}
  </a>
</div>
              
              <p style="font-size: 14px; color: #9ca3af; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #6abda6; word-break: break-all;">${confirmationUrl}</span>
              </p>
            </div>
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
