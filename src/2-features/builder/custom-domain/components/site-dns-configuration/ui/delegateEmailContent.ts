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
      "builder.domain.email.subject",
      `Help setting up DNS for ${domainName}`,
    ),
  );

  // Technical details formatted with line breaks
  const body = encodeURIComponent(
    `Hi!\n\n` +
      `I'm setting up my wedding website on WeddWeb and I'm a bit stuck on the DNS settings for ${domainName}. Could you help me add these two records?\n\n` +
      `1. A Record\n` +
      `   Name/Host: @\n` +
      `   Value: 216.198.79.1\n\n` +
      `2. CNAME Record\n` +
      `   Name/Host: www\n` +
      `   Value: 7c2ca668cf1fda1e.vercel-dns-017.com\n\n` +
      `Drop me a WhatsApp message or call me once you see this—I'll give you my registrar username and password so you can jump in and do it directly.\n\n` +
      `Thanks a million for the help!`,
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};
