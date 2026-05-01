ALTER TABLE public.checkouts
  ALTER COLUMN media_url DROP NOT NULL,
  ALTER COLUMN media_type DROP NOT NULL;
