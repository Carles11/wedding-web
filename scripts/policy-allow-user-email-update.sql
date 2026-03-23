-- Policy: Allow users to update their own email in user_profiles
-- This assumes RLS is enabled on user_profiles and that the table has a column 'id' (UUID PK) and 'email'.
-- The authenticated user's uid must match the id column.

-- Enable RLS if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow owner to update their own email
CREATE POLICY "Allow user to update own email" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
