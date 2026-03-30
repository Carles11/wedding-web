import Heading from "@/4-shared/ui/commons/typography/Heading";
import Link from "next/link";

interface Props {
  translations: Record<string, string>;
  lang: string;
}

export default function ExpiredSiteNotice({ translations, lang }: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-24">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Decorative Element */}
        <div className="flex justify-center">
          <div className="w-20 h-px bg-gray-200" />
          <span className="mx-4 text-gray-300">✦</span>
          <div className="w-20 h-px bg-gray-200" />
        </div>

        <div className="space-y-4">
          <Heading
            as="h1"
            className="text-3xl md:text-4xl font-serif text-gray-900"
          >
            {translations["tenant.expired.title"] ??
              "Thissssss celebration has moved offline"}
          </Heading>

          <p className="text-lg text-gray-500 font-light leading-relaxed">
            {translations["tenant.expired.description"] ??
              "The hosting period for this wedding website has concluded. We hope you enjoyed sharing these special moments with the couple."}
          </p>
        </div>

        {/* Action for the Couple */}
        <div className="pt-12 border-t border-gray-50">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            {translations["tenant.expired.owner_note"] ??
              "Are you the owner of this site?"}
          </p>
          <Link
            href={`/${lang}/builder`}
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            {translations["tenant.expired.login_btn"] ?? "Log in to Dashboard"}
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            {translations["tenant.expired.upgrade_hint"] ??
              "Upgrade to Premium to keep your memories online forever."}
          </p>
        </div>

        {/* Brand Footer */}
        <div className="pt-24 opacity-40">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
            Powered by WeddWeb.com
          </p>
        </div>
      </div>
    </main>
  );
}
