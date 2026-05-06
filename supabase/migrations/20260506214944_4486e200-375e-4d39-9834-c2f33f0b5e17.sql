-- Fix search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Be more explicit about revoking EXECUTE to satisfy linter
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- Re-grant to authenticated but keep it revoked from anon if we want total lockdown,
-- however, if the frontend needs to call it (it shouldn't, RLS handles it), we might need it.
-- The user didn't ask for the function to be private, just for security to be right.
-- RLS already uses it.
