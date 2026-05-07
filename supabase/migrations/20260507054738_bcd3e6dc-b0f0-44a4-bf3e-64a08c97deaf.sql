-- Criar tabela de seções de checkout
CREATE TABLE IF NOT EXISTS public.checkout_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_id UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    section_type TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.checkout_sections ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Seções de checkout são visíveis publicamente" 
ON public.checkout_sections FOR SELECT 
USING (active = true);

CREATE POLICY "Admins podem gerenciar seções de checkout" 
ON public.checkout_sections FOR ALL 
USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE TRIGGER update_checkout_sections_updated_at
BEFORE UPDATE ON public.checkout_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();