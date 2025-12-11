import "dotenv/config";
import { getMergedTranslations, t } from "../src/4-shared/lib/i18n.ts";

(async () => {
  try {
    // pass null for siteId to use only global translations
    const merged = await getMergedTranslations(null, "en");
    console.log("merged en:", merged);

    const label = await t(null, "es", "when");
    console.log('t(null, es, "when") =>', label);
  } catch (err) {
    console.error(err);
  }
})();
