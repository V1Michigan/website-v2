-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR V1 MICHIGAN
-- =============================================================================
-- 
-- CRITICAL: These policies MUST be applied in the Supabase dashboard to secure
-- the database. Without RLS, anyone with the anon key can access/modify all data.
--
-- To apply these policies:
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- 2. Copy and paste these SQL statements
-- 3. Run them
-- 4. Verify RLS is ENABLED for each table (Table Editor > Settings)
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LOVE_NOTES TABLE
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;

-- Users can only insert love notes with their own user_id
CREATE POLICY "Users can insert own love notes"
ON love_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can read love notes they sent (where they are the sender)
CREATE POLICY "Users can read own sent notes"
ON love_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can read love notes sent to their email address
CREATE POLICY "Users can read received notes"
ON love_notes FOR SELECT
TO authenticated
USING (
  auth.email() = recipient_email 
  OR 
  LOWER(auth.email()) = LOWER(recipient_email)
);

-- Users can only delete their own sent notes
CREATE POLICY "Users can delete own notes"
ON love_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Users cannot update love notes (they're immutable once sent)
-- No UPDATE policy = updates are blocked


-- -----------------------------------------------------------------------------
-- 2. V1-PEOPLE TABLE (Profiles)
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE "v1-people" ENABLE ROW LEVEL SECURITY;

-- Everyone (including anonymous) can view all profiles
CREATE POLICY "Profiles are publicly viewable"
ON "v1-people" FOR SELECT
TO public
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON "v1-people" FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for new user onboarding)
CREATE POLICY "Users can create own profile"
ON "v1-people" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Only admins can delete profiles (optional - adjust as needed)
-- For now, disallow all deletes by not creating a DELETE policy


-- -----------------------------------------------------------------------------
-- 3. FLAGS TABLE (Feature Flags)
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;

-- Everyone can read feature flags
CREATE POLICY "Flags are publicly readable"
ON flags FOR SELECT
TO public
USING (true);

-- Only specific admin users can update flags
-- IMPORTANT: Replace these UUIDs with actual admin user IDs from auth.users table
CREATE POLICY "Only admins can update flags"
ON flags FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    -- Add admin user IDs here:
    -- '00000000-0000-0000-0000-000000000000'::uuid,
    -- 'admin-user-id-2'::uuid
    -- For now, block all updates until admins are defined
    SELECT id FROM "v1-people" WHERE role = 'Admin' AND id = auth.uid()
  )
);

-- Only admins can insert new flags
CREATE POLICY "Only admins can insert flags"
ON flags FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM "v1-people" WHERE role = 'Admin' AND id = auth.uid()
  )
);


-- -----------------------------------------------------------------------------
-- 4. DYNAMIC_LINKS TABLE (URL Redirects)
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE dynamic_links ENABLE ROW LEVEL SECURITY;

-- Everyone can read dynamic links (needed for redirects)
CREATE POLICY "Dynamic links are publicly readable"
ON dynamic_links FOR SELECT
TO public
USING (true);

-- Only admins can modify dynamic links
CREATE POLICY "Only admins can modify dynamic links"
ON dynamic_links FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM "v1-people" WHERE role = 'Admin' AND id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM "v1-people" WHERE role = 'Admin' AND id = auth.uid()
  )
);


-- -----------------------------------------------------------------------------
-- 5. STORAGE BUCKET: love-notes
-- -----------------------------------------------------------------------------
-- Enable RLS on storage
-- Go to: Storage > love-notes bucket > Policies

-- Policy: Users can upload to their own folder
-- Name: Users can upload own love note images
-- Allowed operation: INSERT
-- Policy definition:
/*
(bucket_id = 'love-notes'::text) 
AND (auth.uid()::text = (storage.foldername(name))[1])
*/

-- Policy: Users can read their own uploaded images
-- Name: Users can read own love note images
-- Allowed operation: SELECT
-- Policy definition:
/*
(bucket_id = 'love-notes'::text) 
AND (
  (auth.uid()::text = (storage.foldername(name))[1])
  OR 
  -- Allow reading if the image URL is in a love_note record the user can access
  EXISTS (
    SELECT 1 FROM love_notes 
    WHERE image_url LIKE '%' || name 
    AND (user_id = auth.uid() OR recipient_email = auth.email())
  )
)
*/

-- Policy: Users can delete their own images
-- Name: Users can delete own love note images
-- Allowed operation: DELETE
-- Policy definition:
/*
(bucket_id = 'love-notes'::text) 
AND (auth.uid()::text = (storage.foldername(name))[1])
*/


-- -----------------------------------------------------------------------------
-- ADDITIONAL SECURITY RECOMMENDATIONS
-- -----------------------------------------------------------------------------

-- 1. Create indexes for performance on filtered columns
CREATE INDEX IF NOT EXISTS idx_love_notes_user_id ON love_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_love_notes_recipient_email ON love_notes(recipient_email);
CREATE INDEX IF NOT EXISTS idx_love_notes_created_at ON love_notes(created_at DESC);

-- 2. Add constraints to prevent data quality issues
ALTER TABLE love_notes 
  ADD CONSTRAINT check_message_length CHECK (length(message_text) <= 400),
  ADD CONSTRAINT check_sender_name_length CHECK (length(sender_name) <= 100),
  ADD CONSTRAINT check_recipient_name_length CHECK (length(recipient_name) <= 100);

-- 3. Ensure email columns are lowercase (for consistent matching)
CREATE OR REPLACE FUNCTION lowercase_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.recipient_email = LOWER(NEW.recipient_email);
  NEW.sender_email = LOWER(NEW.sender_email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER love_notes_lowercase_email
  BEFORE INSERT OR UPDATE ON love_notes
  FOR EACH ROW
  EXECUTE FUNCTION lowercase_email();


-- -----------------------------------------------------------------------------
-- VERIFICATION QUERIES
-- -----------------------------------------------------------------------------
-- Run these to verify RLS is working:

-- 1. Check that RLS is enabled:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('love_notes', 'v1-people', 'flags', 'dynamic_links');
-- Expected: rowsecurity = true for all

-- 2. List all policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('love_notes', 'v1-people', 'flags', 'dynamic_links')
ORDER BY tablename, policyname;

-- 3. Test as anonymous user (should fail or return nothing):
-- Set role to anon and try to access data
SET ROLE anon;
SELECT * FROM love_notes; -- Should return empty or error
RESET ROLE;


-- -----------------------------------------------------------------------------
-- EMERGENCY DISABLE (if something breaks)
-- -----------------------------------------------------------------------------
-- If RLS causes issues and you need to temporarily disable it:
-- ALTER TABLE love_notes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "v1-people" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE flags DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE dynamic_links DISABLE ROW LEVEL SECURITY;
--
-- WARNING: Only do this in development! In production, fix the policies instead.
