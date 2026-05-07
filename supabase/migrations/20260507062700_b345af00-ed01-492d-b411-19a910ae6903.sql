ALTER TABLE public.checkout_fields
ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;