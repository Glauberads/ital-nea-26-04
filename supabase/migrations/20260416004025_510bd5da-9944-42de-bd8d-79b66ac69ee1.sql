ALTER TABLE public.configuracoes
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT '';