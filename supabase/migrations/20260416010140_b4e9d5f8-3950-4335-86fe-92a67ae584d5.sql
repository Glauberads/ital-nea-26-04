
-- 1. Create admins table
CREATE TABLE public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only existing admins can read the admins table
CREATE POLICY "Admins can read admins" ON public.admins
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Create is_admin helper function (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$;

-- 3. Fix galeria_midia policies
DROP POLICY IF EXISTS "Apenas admin gerencia galeria" ON public.galeria_midia;
DROP POLICY IF EXISTS "Autenticados gerenciam mídia" ON public.galeria_midia;
DROP POLICY IF EXISTS "Leitura pública de mídia" ON public.galeria_midia;
DROP POLICY IF EXISTS "Leitura pública galeria" ON public.galeria_midia;

CREATE POLICY "Public can read gallery" ON public.galeria_midia
  FOR SELECT USING (true);

CREATE POLICY "Admins manage gallery" ON public.galeria_midia
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Fix opcoes_formulario policies
DROP POLICY IF EXISTS "Apenas admin gerencia opcoes" ON public.opcoes_formulario;
DROP POLICY IF EXISTS "Autenticados gerenciam opções" ON public.opcoes_formulario;
DROP POLICY IF EXISTS "Leitura pública de opções ativas" ON public.opcoes_formulario;
DROP POLICY IF EXISTS "Leitura pública opcoes" ON public.opcoes_formulario;

CREATE POLICY "Public can read active options" ON public.opcoes_formulario
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admins manage form options" ON public.opcoes_formulario
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Fix leads policies
DROP POLICY IF EXISTS "Apenas admins leem leads" ON public.leads;

CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- 6. Fix configuracoes policies
DROP POLICY IF EXISTS "Apenas admins alteram configs" ON public.configuracoes;
DROP POLICY IF EXISTS "Permitir leitura pública de configs" ON public.configuracoes;

CREATE POLICY "Public can read configs" ON public.configuracoes
  FOR SELECT USING (true);

CREATE POLICY "Admins manage configs" ON public.configuracoes
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
