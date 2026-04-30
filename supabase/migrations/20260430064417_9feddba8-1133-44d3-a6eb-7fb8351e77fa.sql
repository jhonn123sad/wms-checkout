-- Simplificar políticas para checkout_projects
DROP POLICY IF EXISTS "Admins can manage checkout_projects" ON public.checkout_projects;
CREATE POLICY "Authenticated users can manage checkout_projects" 
ON public.checkout_projects 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Simplificar políticas para checkout_offers
DROP POLICY IF EXISTS "Admins can manage checkout_offers" ON public.checkout_offers;
CREATE POLICY "Authenticated users can manage checkout_offers" 
ON public.checkout_offers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Adicionar política para visualizar orders no dashboard
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Authenticated users can view orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (true);
