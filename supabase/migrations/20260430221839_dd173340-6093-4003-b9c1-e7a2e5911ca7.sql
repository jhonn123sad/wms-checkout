-- Create checkouts table
CREATE TABLE public.checkouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    cta_text TEXT NOT NULL DEFAULT 'Comprar agora',
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checkout_fields table
CREATE TABLE public.checkout_fields (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    checkout_id UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL DEFAULT 'text',
    required BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checkout_leads table
CREATE TABLE public.checkout_leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    checkout_id UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_leads ENABLE ROW LEVEL SECURITY;

-- Policies for checkouts
CREATE POLICY "Public checkouts are viewable by everyone" 
ON public.checkouts FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can do everything on checkouts" 
ON public.checkouts FOR ALL 
USING (auth.role() = 'authenticated');

-- Policies for checkout_fields
CREATE POLICY "Public fields are viewable by everyone" 
ON public.checkout_fields FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.checkouts WHERE id = checkout_fields.checkout_id AND active = true));

CREATE POLICY "Admins can do everything on checkout_fields" 
ON public.checkout_fields FOR ALL 
USING (auth.role() = 'authenticated');

-- Policies for checkout_leads
CREATE POLICY "Anyone can insert leads" 
ON public.checkout_leads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view leads" 
ON public.checkout_leads FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insert initial data
DO $$
DECLARE
    checkout_id_1 UUID;
    checkout_id_2 UUID;
    checkout_id_3 UUID;
    checkout_id_4 UUID;
BEGIN
    -- Checkout 1
    INSERT INTO public.checkouts (title, subtitle, slug, price, cta_text, media_type, media_url)
    VALUES ('Acesso Reservado', 'Conteúdo exclusivo liberado após confirmação', 'acesso-reservado', 19.90, 'Liberar acesso agora', 'video', 'https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/acesso-reservado/Woman_filming_herself_202604130005.mp4')
    RETURNING id INTO checkout_id_1;

    INSERT INTO public.checkout_fields (checkout_id, field_name, field_label, required, sort_order) VALUES
    (checkout_id_1, 'nome', 'Nome Completo', true, 1),
    (checkout_id_1, 'email', 'E-mail', true, 2),
    (checkout_id_1, 'whatsapp', 'WhatsApp', true, 3);

    -- Checkout 2
    INSERT INTO public.checkouts (title, subtitle, slug, price, cta_text, media_type, media_url)
    VALUES ('Comunidade WMS', 'Entre para a comunidade e acesse conteúdos exclusivos', 'comunidade-wms', 29.90, 'Entrar na comunidade', 'image', 'https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/comunidade-wms/edite_essa_imagem_202604160528.jpeg')
    RETURNING id INTO checkout_id_2;

    INSERT INTO public.checkout_fields (checkout_id, field_name, field_label, required, sort_order) VALUES
    (checkout_id_2, 'nome', 'Nome Completo', true, 1),
    (checkout_id_2, 'email', 'E-mail', true, 2),
    (checkout_id_2, 'instagram', 'Instagram', false, 3),
    (checkout_id_2, 'whatsapp', 'WhatsApp', true, 4);

    -- Checkout 3
    INSERT INTO public.checkouts (title, subtitle, slug, price, cta_text, media_type, media_url)
    VALUES ('Receitas Práticas', 'Receitas simples, rápidas e práticas para o dia a dia', 'receitas-praticas', 14.90, 'Comprar receitas', 'image', 'https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/receitas-praticas/Velour_Melt_Hot_202604120517.jpeg')
    RETURNING id INTO checkout_id_3;

    INSERT INTO public.checkout_fields (checkout_id, field_name, field_label, required, sort_order) VALUES
    (checkout_id_3, 'nome', 'Nome Completo', true, 1),
    (checkout_id_3, 'email', 'E-mail', true, 2),
    (checkout_id_3, 'whatsapp', 'WhatsApp', false, 3);

    -- Checkout 4
    INSERT INTO public.checkouts (title, subtitle, slug, price, cta_text, media_type, media_url)
    VALUES ('Visagismo com IA', 'Descubra estilos personalizados com inteligência artificial', 'visagismo-ia', 39.90, 'Começar análise', 'image', 'https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/visagismo-ia/deixe_o_cabelo_202604151501.png')
    RETURNING id INTO checkout_id_4;

    INSERT INTO public.checkout_fields (checkout_id, field_name, field_label, required, sort_order) VALUES
    (checkout_id_4, 'nome', 'Nome Completo', true, 1),
    (checkout_id_4, 'email', 'E-mail', true, 2),
    (checkout_id_4, 'whatsapp', 'WhatsApp', true, 3),
    (checkout_id_4, 'objetivo', 'Objetivo com o visual', false, 4);
END $$;