-- Revogar permissão de execução pública para funções sensíveis SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- Garantir que o postgres (e outros superusers/owners) ainda possa executar
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO postgres;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
