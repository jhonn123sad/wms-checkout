-- Tabela de Páginas
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published, inactive
    seo_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Seções (para construção de páginas)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- hero, features, testimonial, text_content, etc.
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Ativos de Mídia
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- image, video, gif
    provider TEXT NOT NULL, -- upload, external, youtube, vimeo, gdrive
    storage_path TEXT, -- se for upload
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajustar a tabela de checkouts (se já existir, garantir campos)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='checkouts' AND column_name='media_asset_id') THEN
        ALTER TABLE public.checkouts ADD COLUMN media_asset_id UUID REFERENCES public.media_assets(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='checkouts' AND column_name='status') THEN
        ALTER TABLE public.checkouts ADD COLUMN status TEXT DEFAULT 'published';
    END IF;
END $$;

-- Habilitar RLS em tudo
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Políticas (Simplificadas para o MVP: leitura pública, escrita autenticada)
CREATE POLICY "Leitura pública de páginas" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Leitura pública de seções" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Leitura pública de mídias" ON public.media_assets FOR SELECT USING (true);

-- Admin policies (assuming authenticated users are admins for this MVP)
CREATE POLICY "Admin gerenciamento total páginas" ON public.pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin gerenciamento total seções" ON public.sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin gerenciamento total mídias" ON public.media_assets FOR ALL USING (auth.role() = 'authenticated');

-- Configuração do Storage (Bucket para mídias)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Mídia pública" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin upload mídias" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete mídias" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Gatilho de timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_checkouts_updated_at BEFORE UPDATE ON public.checkouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();