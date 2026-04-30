-- Revogar permissão de execução pública
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated;

-- Garantir acesso apenas para service_role e postgres
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO postgres, service_role;
