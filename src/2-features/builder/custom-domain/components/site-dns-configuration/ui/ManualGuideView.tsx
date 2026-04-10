import { t } from "@/4-shared/helpers/t";
import { ExternalLink } from "lucide-react";
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
    <div className="flex flex-col gap-1.5 mt-4">
      <a
        href="https://vercel.com/docs/concepts/projects/custom-domains#step-2--add-your-domain-to-vercel"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition"
      >
        {t(
          translations,
          "builder.domain.dns_modal.link_vercel_guide",
          "View Vercel DNS setup guide",
        )}
        <ExternalLink size={10} />
      </a>
      <a
        href="https://pressific.com/articles/how-to-update-your-dns-records-on/#2-namecheap"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-medium hover:text-blue-900 transition"
      >
        {t(
          translations,
          "builder.domain.dns_modal.link_registrars_guide",
          "Most common registrars: DNS instructions",
        )}
        <ExternalLink size={10} />
      </a>
    </div>
  </>
);
