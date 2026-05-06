-- RESTORE MISSING TABLES
-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    description text,
    price_cents integer NOT NULL,
    active boolean NOT NULL DEFAULT true,
    thank_you_url text
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    product_id uuid REFERENCES public.products(id),
    checkout_id uuid, -- Added later
    customer_name text,
    customer_email text,
    customer_cpf text,
    customer_phone text,
    amount_cents integer NOT NULL,
    status text NOT NULL DEFAULT 'created',
    pushinpay_transaction_id text UNIQUE,
    pix_qr_code text,
    pix_qr_code_base64 text,
    paid_at timestamptz,
    expires_at timestamptz,
    public_access_token text,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Webhook Events
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    provider text NOT NULL DEFAULT 'pushinpay',
    event_type text,
    transaction_id text,
    payload jsonb NOT NULL,
    processed boolean NOT NULL DEFAULT false,
    error_message text
);

-- Checkouts
CREATE TABLE IF NOT EXISTS public.checkouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    cta_text TEXT NOT NULL DEFAULT 'Comprar agora',
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    status TEXT DEFAULT 'published',
    pix_expiration_minutes INTEGER DEFAULT 30,
    success_redirect_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add checkout_id to orders if it exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='checkout_id') THEN
        ALTER TABLE public.orders ADD COLUMN checkout_id UUID REFERENCES public.checkouts(id);
    END IF;
END $$;

-- Checkout Fields
CREATE TABLE IF NOT EXISTS public.checkout_fields (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    checkout_id UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL DEFAULT 'text',
    required BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Checkout Leads
CREATE TABLE IF NOT EXISTS public.checkout_leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    checkout_id UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pages
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    seo_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sections
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Media Assets
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ADMIN SECURITY
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ENABLE RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Admin broad access
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to webhook_events" ON public.webhook_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to checkouts" ON public.checkouts FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to checkout_fields" ON public.checkout_fields FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to checkout_leads" ON public.checkout_leads FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to pages" ON public.pages FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to sections" ON public.sections FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to media_assets" ON public.media_assets FOR ALL USING (public.is_admin());

-- Public SELECT access
CREATE POLICY "Public view active products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Public view published checkouts" ON public.checkouts FOR SELECT USING (active = true AND status = 'published');
CREATE POLICY "Public view checkout fields" ON public.checkout_fields FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.checkouts WHERE id = checkout_id AND active = true AND status = 'published')
);
CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public view sections" ON public.sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pages WHERE id = page_id AND status = 'published')
);
CREATE POLICY "Public view media assets" ON public.media_assets FOR SELECT USING (true);

-- Leads insertion
CREATE POLICY "Public insert leads" ON public.checkout_leads FOR INSERT WITH CHECK (true);
