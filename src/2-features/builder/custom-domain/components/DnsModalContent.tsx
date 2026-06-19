import { t } from "@/4-shared/helpers/t";
import { Mail } from "lucide-react";
import { ManualGuideView } from "./site-dns-configuration/ui/ManualGuideView";
import { handleDelegateEmail } from "./site-dns-configuration/ui/delegateEmailContent";

export default function DnsModalContent({
  translations,
  domainName,
}: {
  translations: Record<string, string>;
  domainName: string;
}) {
  return (
    <div className="flex flex-col gap-0 animate-in fade-in duration-300">
      {/* Section 1: Do it yourself */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
          {t(
            translations,
            "builder.domain.dns_modal.section_diy",
            "Add these records at your registrar",
          )}
        </h4>
        <ManualGuideView translations={translations} />
      </div>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-gray-800 px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t(translations, "builder.domain.dns_modal.divider_or", "or")}
          </span>
        </div>
      </div>

      {/* Section 2: Ask for help */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
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
          className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-neutral-300 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700/50 hover:border-neutral-400 dark:hover:border-gray-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/50 transition-colors">
              <Mail size={16} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t(
                  translations,
                  "builder.domain.social.help_button",
                  "Forward to a tech-savvy friend",
                )}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t(
                  translations,
                  "builder.domain.social.email_hint",
                  "We'll prepare an email with all the DNS details ready to send.",
                )}
              </p>
            </div>
          </div>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors shrink-0"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
