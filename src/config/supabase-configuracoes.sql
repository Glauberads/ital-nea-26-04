-- Execute este SQL no Supabase SQL Editor para criar a tabela de configurações

CREATE TABLE configuracoes (
  id integer PRIMARY KEY DEFAULT 1,
  google_ads_id text DEFAULT '',
  google_ads_label text DEFAULT '',
  facebook_pixel_id text DEFAULT '',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Inserir linha padrão
INSERT INTO configuracoes (id) VALUES (1);

-- RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Leitura pública (para injetar scripts na landing page)
CREATE POLICY "Leitura pública das configurações"
  ON configuracoes FOR SELECT
  TO anon
  USING (true);

-- Apenas usuários autenticados podem atualizar
CREATE POLICY "Atualização autenticada"
  ON configuracoes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir upsert para autenticados
CREATE POLICY "Insert autenticado"
  ON configuracoes FOR INSERT
  TO authenticated
  WITH CHECK (true);
