-- Criar uma página inicial de exemplo
INSERT INTO public.pages (slug, title, status)
VALUES ('home', 'Página Inicial', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Adicionar seções para a home
DO $$
DECLARE
    home_id UUID;
BEGIN
    SELECT id INTO home_id FROM public.pages WHERE slug = 'home';
    
    IF home_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.sections WHERE page_id = home_id) THEN
        INSERT INTO public.sections (page_id, type, content, sort_order) VALUES
        (home_id, 'hero', '{"title": "Seu Novo Ecossistema de Checkouts", "subtitle": "Crie landing pages e checkouts de alta conversão em minutos.", "cta_text": "Começar Agora", "cta_link": "/admin"}', 0),
        (home_id, 'features', '{"items": [{"title": "Edição Visual", "description": "Tudo editável via painel admin."}, {"title": "Mídias Flexíveis", "description": "Vídeos, GIFs e imagens em um só lugar."}, {"title": "Checkout Rápido", "description": "Integração direta com Pix."}]}', 1);
    END IF;
END $$;