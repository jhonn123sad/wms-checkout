-- Garantir que o bucket checkout-assets exista e seja público
INSERT INTO storage.buckets (id, name, public)
VALUES ('checkout-assets', 'checkout-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public Select checkout-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert checkout-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update checkout-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete checkout-assets" ON storage.objects;

-- Permitir leitura pública
CREATE POLICY "Public Select checkout-assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'checkout-assets');

-- Permitir inserção para anon/auth (enquanto o admin não tem login)
CREATE POLICY "Public Insert checkout-assets"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'checkout-assets');

-- Permitir atualização para anon/auth
CREATE POLICY "Public Update checkout-assets"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'checkout-assets')
WITH CHECK (bucket_id = 'checkout-assets');

-- Permitir exclusão para anon/auth
CREATE POLICY "Public Delete checkout-assets"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'checkout-assets');
