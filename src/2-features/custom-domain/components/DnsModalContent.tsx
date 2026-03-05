import CopyButton from "@/4-shared/ui/buttons/CopyButton";

const DnsRecord = ({
  step,
  type,
  name,
  value,
  copyLabel,
  typeColor,
}: {
  step: number;
  type: string;
  name: string;
  value: string;
  copyLabel: string;
  typeColor: { bg: string; border: string; text: string };
}) => (
  <div className="rounded-xl p-4 mb-3 bg-neutral-800 border border-neutral-700">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-bold rounded-md px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-slate-400 font-mono">
        Step {step}
      </span>
      <span
        className={`text-xs font-semibold rounded-md px-2 py-0.5 ${typeColor.bg} ${typeColor.text} font-mono border ${typeColor.border}`}
      >
        {type}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-xs mb-1.5 text-slate-500 font-medium font-sans">
          Name / Host
        </div>
        <div className="rounded-lg px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 text-slate-300 font-mono break-all">
          {name}
        </div>
      </div>
      <div>
        <div className="text-xs mb-1.5 text-slate-500 font-medium font-sans">
          Points to / Value
        </div>
        <div className="rounded-lg px-3 py-2 text-xs flex items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 text-slate-300 font-mono break-all">
          <span>{value}</span>
          <CopyButton text={value} label={copyLabel} />
        </div>
      </div>
    </div>
  </div>
);

export default function DnsModalContent({ domain }: { domain: string }) {
  return (
    <>
      <DnsRecord
        step={1}
        type="A Record"
        typeColor={{
          bg: "bg-red-600/10",
          border: "border-red-300/25",
          text: "text-red-400",
        }}
        name="@"
        value="216.198.79.1"
        copyLabel="IP"
      />
      <DnsRecord
        step={2}
        type="CNAME Record"
        typeColor={{
          bg: "bg-blue-500/10",
          border: "border-blue-300/25",
          text: "text-blue-300",
        }}
        name="www"
        value="cname.vercel-dns.com"
        copyLabel="CNAME"
      />
      <div className="flex items-start gap-2 rounded-xl px-4 py-3 mt-1 bg-yellow-300/10 border border-yellow-300/25">
        <svg
          className="mt-0.5 shrink-0"
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
        <p className="text-xs leading-relaxed text-gray-600 font-sans">
          Add these records in your DNS provider (Namecheap, GoDaddy, Google
          Domains, Cloudflare, etc.). Changes can take up to 48 hours.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 mt-4">
        <a
          href="https://vercel.com/docs/concepts/projects/custom-domains#step-2--add-your-domain-to-vercel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition"
        >
          View Vercel DNS setup guide
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
        <a
          href="https://pressific.com/articles/how-to-update-your-dns-records-on/#2-namecheap"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-medium hover:text-blue-900 transition"
        >
          Most common registrars: DNS instructions
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
    </>
  );
}
