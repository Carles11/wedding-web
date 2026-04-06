-- Clean up orphaned user/site data and enforce cascading deletes.
-- Run in the Supabase SQL editor.

BEGIN;

-- 1) One-time cleanup for site trees whose owner profile no longer exists.
WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.site_translations st
USING orphan_sites os
WHERE st.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.images i
USING orphan_sites os
WHERE i.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.program_events pe
USING orphan_sites os
WHERE pe.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.accommodations a
USING orphan_sites os
WHERE a.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.guests g
USING orphan_sites os
WHERE g.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.wedding_gift wg
USING orphan_sites os
WHERE wg.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.what_to_see wts
USING orphan_sites os
WHERE wts.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.sections sec
USING orphan_sites os
WHERE sec.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.user_sites us
USING orphan_sites os
WHERE us.site_id = os.id;

WITH orphan_sites AS (
  SELECT s.id
  FROM public.sites s
  LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
  WHERE s.owner_user_id IS NULL
     OR up.id IS NULL
)
DELETE FROM public.sites s
USING orphan_sites os
WHERE s.id = os.id;

-- 2) Clean up any remaining user-scoped rows whose profile is already gone.
DELETE FROM public.subscriptions sub
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_profiles up
  WHERE up.id = sub.user_id
);

DELETE FROM public.user_sites us
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_profiles up
  WHERE up.id = us.user_id
)
   OR NOT EXISTS (
     SELECT 1
     FROM public.sites s
     WHERE s.id = us.site_id
   );

-- 3) Recreate ownership FKs with ON DELETE CASCADE so auth user deletion
-- cascades through user_profiles into subscriptions, sites, and site-owned data.
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.user_profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.sites
  DROP CONSTRAINT IF EXISTS sites_owner_user_id_fkey;

ALTER TABLE public.sites
  ADD CONSTRAINT sites_owner_user_id_fkey
  FOREIGN KEY (owner_user_id)
  REFERENCES public.user_profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.user_sites
  DROP CONSTRAINT IF EXISTS user_sites_user_id_fkey;

ALTER TABLE public.user_sites
  ADD CONSTRAINT user_sites_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.user_profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.user_sites
  DROP CONSTRAINT IF EXISTS user_sites_site_id_fkey;

ALTER TABLE public.user_sites
  ADD CONSTRAINT user_sites_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.site_translations
  DROP CONSTRAINT IF EXISTS site_translations_site_id_fkey;

ALTER TABLE public.site_translations
  ADD CONSTRAINT site_translations_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.sections
  DROP CONSTRAINT IF EXISTS sections_site_id_fkey;

ALTER TABLE public.sections
  ADD CONSTRAINT sections_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.images
  DROP CONSTRAINT IF EXISTS images_site_id_fkey;

ALTER TABLE public.images
  ADD CONSTRAINT images_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.program_events
  DROP CONSTRAINT IF EXISTS program_events_site_id_fkey;

ALTER TABLE public.program_events
  ADD CONSTRAINT program_events_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.accommodations
  DROP CONSTRAINT IF EXISTS accommodations_site_id_fkey;

ALTER TABLE public.accommodations
  ADD CONSTRAINT accommodations_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.guests
  DROP CONSTRAINT IF EXISTS guests_site_id_fkey;

ALTER TABLE public.guests
  ADD CONSTRAINT guests_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.wedding_gift
  DROP CONSTRAINT IF EXISTS wedding_gift_site_id_fkey;

ALTER TABLE public.wedding_gift
  ADD CONSTRAINT wedding_gift_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

ALTER TABLE public.what_to_see
  DROP CONSTRAINT IF EXISTS what_to_see_site_id_fkey;

ALTER TABLE public.what_to_see
  ADD CONSTRAINT what_to_see_site_id_fkey
  FOREIGN KEY (site_id)
  REFERENCES public.sites(id)
  ON DELETE CASCADE;

COMMIT;

-- Optional verification after running:
-- SELECT COUNT(*) AS orphan_sites
-- FROM public.sites s
-- LEFT JOIN public.user_profiles up ON up.id = s.owner_user_id
-- WHERE s.owner_user_id IS NULL OR up.id IS NULL;