-- Create bucket for media if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the site-media bucket
-- Allow public read access
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access site-media'
    ) THEN
        CREATE POLICY "Public Access site-media" ON storage.objects 
        FOR SELECT USING (bucket_id = 'site-media');
    END IF;
END $$;

-- Allow authenticated users to upload/update/delete
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Insert site-media'
    ) THEN
        CREATE POLICY "Authenticated Insert site-media" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'site-media' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Update site-media'
    ) THEN
        CREATE POLICY "Authenticated Update site-media" ON storage.objects 
        FOR UPDATE USING (bucket_id = 'site-media' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Delete site-media'
    ) THEN
        CREATE POLICY "Authenticated Delete site-media" ON storage.objects 
        FOR DELETE USING (bucket_id = 'site-media' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Add media_json column to relevant tables
ALTER TABLE public.checkouts ADD COLUMN IF NOT EXISTS media_json JSONB;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS media_json JSONB;

-- Comment on columns for clarity
COMMENT ON COLUMN public.checkouts.media_json IS 'Estrutura JSON para mídias (imagem, vídeo, gif) com suporte a Supabase Storage e URLs externas';
COMMENT ON COLUMN public.pages.media_json IS 'Estrutura JSON para mídias (imagem, vídeo, gif) com suporte a Supabase Storage e URLs externas';
