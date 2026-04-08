import { t } from "@/4-shared/helpers/t";
import { DnsRecord } from "./DnsRecord";

export const ManualGuideView = ({
  translations,
}: {
  translations: Record<string, string>;
}) => (
  <>
    <DnsRecord
      step={1}
      type={t(
        translations,
        "builder.domain.dns_modal.record_type_a",
        "A Record",
      )}
      typeColor={{
        bg: "bg-red-600/10",
        border: "border-red-300/25",
        text: "text-red-400",
      }}
      name="@"
      value="216.198.79.1"
      copyLabel={t(
        translations,
        "builder.domain.dns_modal.copy_label_ip",
        "IP",
      )}
      translations={translations}
    />
    <DnsRecord
      step={2}
      type={t(
        translations,
        "builder.domain.dns_modal.record_type_cname",
        "CNAME Record",
      )}
      typeColor={{
        bg: "bg-blue-500/10",
        border: "border-blue-300/25",
        text: "text-blue-300",
      }}
      name="www"
      value="7c2ca668cf1fda1e.vercel-dns-017.com"
      copyLabel={t(
        translations,
        "builder.domain.dns_modal.copy_label_cname",
        "CNAME",
      )}
      translations={translations}
    />
    {/* ... The rest of your current SVG note and Vercel/Registrar links ... */}
  </>
);
