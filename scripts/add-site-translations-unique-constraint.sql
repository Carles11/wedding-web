-- Ensure site_translations has one row per (site_id, key, locale).
-- Run in Supabase SQL editor before relying on upsert conflicts.

BEGIN;

-- 1) Remove duplicates, keep the newest row per (site_id, key, locale).
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY site_id, key, locale
      ORDER BY created_at DESC NULLS LAST, id DESC
    ) AS rn
  FROM public.site_translations
)
DELETE FROM public.site_translations st
USING ranked r
WHERE st.id = r.id
  AND r.rn > 1;

-- 2) Add unique constraint if it does not already exist.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'site_translations_site_key_locale_unique'
  ) THEN
    ALTER TABLE public.site_translations
      ADD CONSTRAINT site_translations_site_key_locale_unique
      UNIQUE (site_id, key, locale);
  END IF;
END $$;

COMMIT;
