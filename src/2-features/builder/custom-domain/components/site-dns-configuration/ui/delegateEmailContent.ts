import { t } from "@/4-shared/helpers/t";

export const handleDelegateEmail = ({
  translations,
  domainName,
}: {
  translations: Record<string, string>;
  domainName: string;
}) => {
  const subject = encodeURIComponent(
    t(
      translations,
      "builder.domain.social.email_subject",
      t(
        translations,
        "builder.domain.email.subject",
        `Help with my wedding website domain`,
      ),
    ),
  );

  // Technical details formatted with line breaks
  const body = encodeURIComponent(
    [
      t(
        translations,
        "builder.domain.social.email_greeting",
        "Hey! I'm setting up my wedding website on WeddWeb and I'm a bit lost with the DNS settings. Could you help me out?",
      ),
      "",
      t(
        translations,
        "builder.domain.social.email_task",
        "I need to point my domain to their servers so the site goes live. Here are the specific records they gave me:",
      ),
      "",
      `1. A Record`,
      `   Name/Host: @`,
      `   Value: 216.198.79.1`,
      "",
      `2. CNAME Record`,
      `   Name/Host: www`,
      `   Value: 7c2ca668cf1fda1e.vercel-dns-017.com`,
      "",
      t(
        translations,
        "builder.domain.social.email_closing",
        "Drop me a message or call me once you see this—I can give you my registrar login if that's easier. Thanks a million!",
      ),
    ].join("\n"),
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};
