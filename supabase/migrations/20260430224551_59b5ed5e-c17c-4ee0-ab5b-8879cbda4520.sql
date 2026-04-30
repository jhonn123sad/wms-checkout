-- Corrigir search_path da função de trigger
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;