-- 1. Adicionar coluna public_access_token para acesso seguro
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS public_access_token TEXT DEFAULT gen_random_uuid()::text;

-- 2. Limpar e redefinir RLS para 'orders'
-- Removemos o acesso público geral e restringimos a leitura direta.
-- O frontend agora deve usar as Edge Functions com o token.
DROP POLICY IF EXISTS "Pedidos podem ser lidos por ID" ON public.orders;
DROP POLICY IF EXISTS "Pedidos podem ser criados publicamente" ON public.orders;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Apenas o service role (Edge Functions) terá acesso total.
-- Mantemos uma política de inserção anônima se necessário para legibilidade do design, 
-- mas removeremos a de leitura para forçar o uso de Edge Functions + Token.
CREATE POLICY "Allow service role full access" 
ON public.orders 
FOR ALL 
USING (auth.role() = 'service_role');

-- 3. Limpar e redefinir RLS para 'webhook_events'
DROP POLICY IF EXISTS "webhook_events_select_policy" ON public.webhook_events;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhook events are service-role only" 
ON public.webhook_events 
FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Garantir RLS para 'products'
DROP POLICY IF EXISTS "Produtos visíveis para todos" ON public.products;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (active = true);

-- 5. Segurança de funções do banco (search_path)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
