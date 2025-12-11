// scripts/test-i18n-simple.mjs
// ESM Node script to verify Supabase DB and global_translations table.
// Usage: node ./scripts/test-i18n-simple.mjs
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

try {
  const { data, error } = await supabase
    .from("global_translations")
    .select("locale, key, value")
    .order("locale", { ascending: true })
    .order("key", { ascending: true });

  if (error) {
    console.error("Supabase query error:", error);
    process.exit(1);
  }

  console.log("global_translations rows:");
  console.table(data || []);
  process.exit(0);
} catch (err) {
  console.error("Unexpected error querying Supabase:", err);
  process.exit(1);
}
