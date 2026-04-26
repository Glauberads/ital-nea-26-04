ALTER TABLE public.configuracoes
  ADD COLUMN IF NOT EXISTS header_logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_headline text DEFAULT 'Móveis Planejados Barueri e Região',
  ADD COLUMN IF NOT EXISTS hero_headline_highlight text DEFAULT 'com Condições Exclusivas!',
  ADD COLUMN IF NOT EXISTS hero_subtitle text DEFAULT 'Solicite seu orçamento de forma rápida e fácil!';

INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Admins upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "Admins update logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "Admins delete logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos' AND public.is_admin());