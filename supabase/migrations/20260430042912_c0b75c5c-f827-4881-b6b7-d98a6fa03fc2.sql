-- Tabelas principais
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    description text,
    price_cents integer NOT NULL,
    active boolean NOT NULL DEFAULT true,
    thank_you_url text
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    product_id uuid REFERENCES public.products(id),
    customer_name text NOT NULL,
    customer_cpf text NOT NULL,
    amount_cents integer NOT NULL,
    status text NOT NULL DEFAULT 'created',
    pushinpay_transaction_id text UNIQUE,
    pix_qr_code text,
    pix_qr_code_base64 text,
    payer_name text,
    payer_national_registration text,
    end_to_end_id text,
    paid_at timestamptz,
    expires_at timestamptz,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    metadata jsonb DEFAULT '{}'::jsonb
);

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

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Produtos visíveis para todos" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Pedidos podem ser criados publicamente" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Pedidos podem ser lidos por ID" ON public.orders FOR SELECT USING (true);

-- Gatilho para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Inserir Produto Inicial
INSERT INTO public.products (name, description, price_cents, active, thank_you_url)
VALUES ('Produto Teste', 'Acesso liberado após confirmação do Pix.', 2500, true, 'https://biblioteca-wms.lovable.app')
ON CONFLICT DO NOTHING;