-- Garantir que o bucket de media existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket media
CREATE POLICY "Acesso público para leitura de mídias"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Acesso total para usuários autenticados no bucket media"
ON storage.objects FOR ALL
USING (bucket_id = 'media' AND auth.role() = 'authenticated');
