-- Cleanup script for duplicate site 5fd0161a-b6b2-44b4-9097-83fe2022c14b
-- Run this in Supabase SQL Editor to remove all orphaned data

-- Store the duplicate site_id for reference
-- Site ID: 5fd0161a-b6b2-44b4-9097-83fe2022c14b

-- Step 1: Delete site_translations
DELETE FROM site_translations 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 2: Delete sections (this will cascade to any FK dependencies)
DELETE FROM sections 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 3: Delete images
DELETE FROM images 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 4: Delete program_events
DELETE FROM program_events 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 5: Delete accommodations
DELETE FROM accommodations 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 6: Delete what_to_see
DELETE FROM what_to_see 
WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Step 7: Delete wedding_gift (if stored as separate table)
-- DELETE FROM wedding_gift 
-- WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';

-- Verify cleanup:
-- SELECT 'site_translations' as table_name, COUNT(*) as remaining_rows FROM site_translations WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b'
-- UNION ALL
-- SELECT 'sections', COUNT(*) FROM sections WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b'
-- UNION ALL
-- SELECT 'images', COUNT(*) FROM images WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b'
-- UNION ALL
-- SELECT 'program_events', COUNT(*) FROM program_events WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b'
-- UNION ALL
-- SELECT 'accommodations', COUNT(*) FROM accommodations WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b'
-- UNION ALL
-- SELECT 'what_to_see', COUNT(*) FROM what_to_see WHERE site_id = '5fd0161a-b6b2-44b4-9097-83fe2022c14b';
