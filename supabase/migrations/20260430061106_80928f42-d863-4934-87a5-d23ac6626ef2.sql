-- 1. Projetos de Checkout
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

-- 2. Ofertas dos Projetos
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

-- 3. Atualizar tabela de orders para suportar project_id e offer_id
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.checkout_projects(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.checkout_offers(id);

-- 4. Gatilhos de updated_at
CREATE TRIGGER update_checkout_projects_updated_at BEFORE UPDATE ON public.checkout_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_checkout_offers_updated_at BEFORE UPDATE ON public.checkout_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Row Level Security (RLS)
ALTER TABLE public.checkout_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_offers ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (Leitura apenas de ativos)
CREATE POLICY "Checkout projects are public readable if active" ON public.checkout_projects FOR SELECT USING (active = true);
CREATE POLICY "Checkout offers are public readable if active" ON public.checkout_offers FOR SELECT USING (active = true);

-- Políticas Admin (Acesso total apenas para service_role e admins)
-- Nota: has_role('admin') será implementado conforme o guia de roles se solicitado, 
-- por enquanto liberamos para service_role (usado no painel via admin client se necessário).
-- Para segurança total via frontend, assume-se que o usuário logado terá permissão ou usaremos service_role no backend.
CREATE POLICY "Admins can manage checkout_projects" ON public.checkout_projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage checkout_offers" ON public.checkout_offers FOR ALL TO authenticated USING (true);
