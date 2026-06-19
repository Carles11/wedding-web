import { ShareTarget } from "@/4-shared/types";
import { BuilderButton } from "../../builder";

export function ShareTargetCard({
  target,
  translations,
  onShare,
  onCopy,
}: {
  target: ShareTarget;
  translations: Record<string, string>;
  onShare: (target: ShareTarget) => Promise<void>;
  onCopy: (url: string) => Promise<void>;
}) {
  const isAvailable = Boolean(target.url);
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {target.label}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{target.description}</p>
        </div>

        {target.url ? (
          <a
            href={target.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-(--builder-color-primary) hover:underline"
          >
            {translations["builder.domain.visit_site"] || "Visit"}
          </a>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {translations["builder.share.unavailable"] || "Unavailable"}
          </span>
        )}
      </div>

      <div className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 break-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {target.url ||
          translations["builder.share.no_custom_domain"] ||
          "No custom domain connected yet."}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <BuilderButton
          size="sm"
          onClick={() => void onShare(target)}
          disabled={!isAvailable}
        >
          {translations["builder.share.action_share"] || "Share"}
        </BuilderButton>
        <BuilderButton
          variant="secondary"
          size="sm"
          onClick={() => target.url && void onCopy(target.url)}
          disabled={!isAvailable}
        >
          {translations["builder.share.action_copy"] || "Copy link"}
        </BuilderButton>
      </div>
    </div>
  );
}
