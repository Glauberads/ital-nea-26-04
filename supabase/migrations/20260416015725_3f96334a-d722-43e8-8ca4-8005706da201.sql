
CREATE TABLE public.opcoes_local (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  posicao INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.opcoes_local ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage local options"
  ON public.opcoes_local FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can read active local options"
  ON public.opcoes_local FOR SELECT
  TO public
  USING (ativo = true);

-- Seed default data
INSERT INTO public.opcoes_local (label, value, posicao) VALUES
  ('São Paulo Capital', 'São Paulo Capital', 0),
  ('Grande SP', 'Grande SP', 1),
  ('Interior SP', 'Interior SP', 2),
  ('Outro', 'Outro', 3);
