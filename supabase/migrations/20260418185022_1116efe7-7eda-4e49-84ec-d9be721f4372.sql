CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.depoimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  texto TEXT NOT NULL,
  data_exibicao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public testimonials"
  ON public.depoimentos FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Admins can read all testimonials"
  ON public.depoimentos FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins manage testimonials"
  ON public.depoimentos FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE TRIGGER update_depoimentos_updated_at
  BEFORE UPDATE ON public.depoimentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.depoimentos (nome, texto, data_exibicao, ordem) VALUES
  ('Maria S.', 'Excelente atendimento! A equipe foi super atenciosa e o resultado ficou incrível. Minha cozinha ficou um sonho!', 'Há 2 semanas', 1),
  ('Carlos R.', 'Profissionais competentes e material de primeira qualidade. Recomendo de olhos fechados para qualquer projeto.', 'Há 1 mês', 2),
  ('Ana P.', 'Fizeram toda a minha casa e superaram minhas expectativas. O prazo foi cumprido e a montagem impecável.', 'Há 3 semanas', 3),
  ('Roberto L.', 'Já é a segunda vez que faço projeto com eles. Qualidade Italínea com atendimento personalizado. Nota 10!', 'Há 1 mês', 4),
  ('Juliana M.', 'Desde o projeto até a entrega, tudo foi perfeito. A equipe é muito profissional e cuidadosa com cada detalhe.', 'Há 2 meses', 5);