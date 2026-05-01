-- Adicionar colunas de mídia à tabela checkout_projects
ALTER TABLE public.checkout_projects 
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT,
ADD COLUMN IF NOT EXISTS media_asset_id UUID REFERENCES public.media_assets(id);

-- Atualizar comentários para documentar o uso
COMMENT ON COLUMN public.checkout_projects.media_url IS 'URL direta da mídia (imagem, vídeo, gif) ou link de embed';
COMMENT ON COLUMN public.checkout_projects.media_type IS 'Tipo da mídia: image, video, gif, youtube, vimeo';
