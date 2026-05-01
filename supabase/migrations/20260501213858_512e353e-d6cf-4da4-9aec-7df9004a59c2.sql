-- 1) Storage: permitir upload/update/delete no bucket site-media para anon (admin sem auth ainda)
DROP POLICY IF EXISTS "Authenticated Insert site-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update site-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete site-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload site-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update site-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete site-media" ON storage.objects;

CREATE POLICY "site-media insert anon"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "site-media update anon"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'site-media')
  WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "site-media delete anon"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'site-media');

-- 2) Permitir admin (sem login) gerenciar checkouts e checkout_fields
DROP POLICY IF EXISTS "Admins can do everything on checkouts" ON public.checkouts;
CREATE POLICY "Anyone can manage checkouts (no auth yet)"
  ON public.checkouts FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can do everything on checkout_fields" ON public.checkout_fields;
CREATE POLICY "Anyone can manage checkout_fields (no auth yet)"
  ON public.checkout_fields FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
