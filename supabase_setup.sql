CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id),
    customer_name text NOT NULL,
    customer_cpf text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    amount numeric NOT NULL,
     pix_code text,
     pix_qr_code_base64 text,
     pushinpay_transaction_id text,
     created_at timestamptz DEFAULT now()
 );

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access for orders" ON public.orders;
CREATE POLICY "Public insert access for orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Inserir produto de teste
INSERT INTO public.products (name, description, price)
VALUES ('Produto Teste', 'Acesso liberado após confirmação do Pix.', 25.00)
ON CONFLICT DO NOTHING;
