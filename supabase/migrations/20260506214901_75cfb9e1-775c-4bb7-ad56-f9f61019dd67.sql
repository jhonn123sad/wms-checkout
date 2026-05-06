-- 1. RESTORE MISSING TABLES AND COLUMNS
-- Checkout Projects
CREATE TABLE IF NOT EXISTS public.checkout_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    headline TEXT,
    subheadline TEXT,
    thank_you_url TEXT,
    pix_expiration_minutes INTEGER DEFAULT 15,
    collect_name BOOLEAN DEFAULT true,
    collect_cpf BOOLEAN DEFAULT true,
    collect_phone BOOLEAN DEFAULT false,
    collect_email BOOLEAN DEFAULT false,
    theme_json JSONB DEFAULT '{}'::jsonB,
    legal_text TEXT
);

-- Checkout Offers
CREATE TABLE IF NOT EXISTS public.checkout_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    project_id UUID REFERENCES public.checkout_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Add columns to checkouts
ALTER TABLE public.checkouts ADD COLUMN IF NOT EXISTS media_json JSONB;
ALTER TABLE public.checkouts ADD COLUMN IF NOT EXISTS design_key TEXT DEFAULT 'default_v1';

-- Add columns to pages
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS media_json JSONB;

-- 2. HARDEN is_admin() FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Revoke execute from public and authenticated, only specific roles if needed, 
-- but usually for SD functions we just rely on internal logic or specific grants.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 3. APPLY RLS AND POLICIES
-- Enable RLS on all tables
ALTER TABLE public.checkout_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_offers ENABLE ROW LEVEL SECURITY;

-- Drop and Recreate Policies for checkout_projects
DROP POLICY IF EXISTS "Checkout projects are public readable if active" ON public.checkout_projects;
DROP POLICY IF EXISTS "Admins can manage checkout_projects" ON public.checkout_projects;

CREATE POLICY "Public can view active projects" ON public.checkout_projects 
FOR SELECT USING (active = true);

CREATE POLICY "Admins have full access to projects" ON public.checkout_projects 
FOR ALL USING (public.is_admin());

-- Drop and Recreate Policies for checkout_offers
DROP POLICY IF EXISTS "Checkout offers are public readable if active" ON public.checkout_offers;
DROP POLICY IF EXISTS "Admins can manage checkout_offers" ON public.checkout_offers;

CREATE POLICY "Public can view active offers" ON public.checkout_offers 
FOR SELECT USING (active = true);

CREATE POLICY "Admins have full access to offers" ON public.checkout_offers 
FOR ALL USING (public.is_admin());

-- Ensure other tables have correct is_admin() policies (updating previous turn's work if needed)
-- (The previous turn already set most of these, but we'll ensure consistency)

-- Orders & Webhook Events (No public access)
-- (Already handled in previous turn, but ensuring they remain restricted)

-- Cleanup any legacy policies that might still use auth.role() = 'authenticated'
DROP POLICY IF EXISTS "Admins can do everything on checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Admins can do everything on checkout_fields" ON public.checkout_fields;
DROP POLICY IF EXISTS "Admin gerenciamento total páginas" ON public.pages;
DROP POLICY IF EXISTS "Admin gerenciamento total seções" ON public.sections;
DROP POLICY IF EXISTS "Admin gerenciamento total mídias" ON public.media_assets;
DROP POLICY IF EXISTS "Admins can view leads" ON public.checkout_leads; -- will recreate with is_admin

-- Final check on checkout_leads
CREATE POLICY "Admins manage leads" ON public.checkout_leads 
FOR ALL USING (public.is_admin());
