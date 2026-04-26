ALTER TABLE public.configuracoes 
  ADD COLUMN IF NOT EXISTS header_logo_white boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS about_logo_white boolean NOT NULL DEFAULT true;