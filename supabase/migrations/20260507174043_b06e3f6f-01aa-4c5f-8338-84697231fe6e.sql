-- Backup de segurança
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'checkout_fields_backup_20260507_v2') THEN
        CREATE TABLE public.checkout_fields_backup_20260507_v2 AS SELECT * FROM public.checkout_fields;
    END IF;
END $$;

-- Garantir coluna active e normalizar
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'checkout_fields' AND column_name = 'active') THEN
        ALTER TABLE public.checkout_fields ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
    END IF;
END $$;

UPDATE public.checkout_fields SET active = FALSE WHERE active IS NULL;
ALTER TABLE public.checkout_fields ALTER COLUMN active SET NOT NULL;
ALTER TABLE public.checkout_fields ALTER COLUMN active SET DEFAULT TRUE;