import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { useState } from "react";
import { ManualGuideView } from "./site-dns-configuration/ui/ManualGuideView";
import { handleDelegateEmail } from "./site-dns-configuration/ui/delegateEmailContent";
import { buildMagicLink } from "./site-dns-configuration/ui/generateDnsProviderMagicLink";

export default function DnsModalContent({
  translations,
  domainConnectId, // From your new DB schema
  domainName,
}: {
  translations: Record<string, string>;
  domainConnectId?: string;
  domainName: string;
}) {
  const [view, setView] = useState<"selection" | "manual">("selection");
  const domainProviderApiUrl = domainConnectId
    ? domainConnectId
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "")
        .replace(/\/v2$/i, "")
    : undefined;

  // Magic Pillar: Domain Connect Handshake
  const handleMagicSetup = () => {
    // If we haven't discovered the provider URL yet, we can't show the button
    if (!domainProviderApiUrl) {
      return notify.error(
        t(
          translations,
          "builder.domain.dns_modal.magic_error",
          "We couldn't detect your registrar's auto-setup API.",
        ),
      );
    }

    const magicUrl = buildMagicLink(domainProviderApiUrl, domainName);

    if (magicUrl) {
      window.open(magicUrl, "_blank");
    }
  };

  if (view === "manual") {
    return (
      <div className="animate-in fade-in duration-300">
        <button
          onClick={() => setView("selection")}
          className="text-[10px] text-slate-500 hover:text-slate-400 mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← {t(translations, "common.back", "Back to options")}
        </button>
        <ManualGuideView translations={translations} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
      {/* PILLAR 1: MAGIC (Only show if provider supports Domain Connect) */}
      {domainProviderApiUrl && (
        <button
          onClick={handleMagicSetup}
          className="flex items-center gap-4 p-4 rounded-xl bg-(--builder-color-primary) hover:bg-(--builder-color-primary-hover) border border-indigo-400/30 transition-all group"
        >
          <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
            ✨
          </div>
          <div className="text-left cursor-pointer">
            <p className="text-sm font-bold text-white">
              {t(
                translations,
                "builder.domain.dns_modal.magic_title",
                "Automatic Setup",
              )}
            </p>
            <p className="text-xs text-white">
              {interpolate(
                t(
                  translations,
                  "builder.domain.dns_modal.magic_desc",
                  "We'll configure {dnsProvider} for you in 2 clicks.",
                ),
                { dnsProvider: domainProviderApiUrl },
              )}
            </p>
          </div>
        </button>
      )}

      {/* PILLAR 3: GUIDED MANUAL (Your existing code) */}
      <button
        onClick={() => setView("manual")}
        className="flex items-center gap-4 p-4 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500 transition-all group"
      >
        <div className="bg-neutral-300 p-2 rounded-lg group-hover:bg-neutral-600 transition-colors">
          🛠
        </div>
        <div className="text-left cursor-pointer">
          <p className="text-sm font-bold text-slate-200">
            {t(
              translations,
              "builder.domain.dns_modal.manual_title",
              "Manual Configuration",
            )}
          </p>
          <p className="text-xs text-slate-200">
            {t(
              translations,
              "builder.domain.dns_modal.manual_desc",
              "I'll copy and paste the records myself.",
            )}
          </p>
        </div>
      </button>

      <div className="mt-4 pt-4 border-t border-neutral-800">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
          {t(
            translations,
            "builder.domain.social.help_title",
            "No idea what DNS is all about?",
          )}
        </h4>

        <button
          onClick={() =>
            handleDelegateEmail({ translations, domainName: domainName })
          }
          className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-neutral-700 hover:bg-neutral-100 hover:border-neutral-500 transition-all cursor-pointer group"
        >
          <div className="text-left">
            <span className="text-xs font-semibold text-slate-800 transition-colors">
              📧{" "}
              {t(
                translations,
                "builder.domain.social.button",
                "Forward to a tech-savvy friend",
              )}
            </span>
            <p className="text-xs text-slate-500 mt-1 max-w-fit px-4">
              {t(
                translations,
                "builder.domain.social.email_closing",
                "Drop me a message or call me once you see this—I can give you my registrar login if that's easier. Thanks a million!",
              )}
            </p>
          </div>
          <div className="bg-neutral-800 p-2 rounded-full group-hover:bg-indigo-500/20 transition-colors">
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="text-slate-500 group-hover:text-indigo-400 transition-colors"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
