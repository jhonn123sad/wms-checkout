-- 1. Criar tipo enum para roles
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Função has_role segura
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 4. Corrigir políticas RLS (Restringir Admin)
DROP POLICY IF EXISTS "Admins can manage checkout_projects" ON public.checkout_projects;
DROP POLICY IF EXISTS "Admins can manage checkout_offers" ON public.checkout_offers;

CREATE POLICY "Admins can manage checkout_projects" 
ON public.checkout_projects 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage checkout_offers" 
ON public.checkout_offers 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Política para visualizar próprias roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
