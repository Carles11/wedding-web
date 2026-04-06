import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  // Grabbing the Browser's Language
  const acceptLang = ((await headers()).get("accept-language") ?? "")
    .toLowerCase()
    .trim();

  const langCandidates = acceptLang
    .split(",")
    .map((l) => l.split("-")[0].trim());

  let bestLang = "en";

  for (const candidate of langCandidates) {
    if (
      SUPPORTED_LANGUAGES.includes(
        candidate as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      bestLang = candidate;
      break;
    }
  }

  redirect(`/${bestLang}`);
}
