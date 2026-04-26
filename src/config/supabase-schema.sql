-- Execute este SQL no Supabase SQL Editor do seu projeto
-- Menu: SQL Editor > New Query > Cole e execute

create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  nome text not null,
  email text not null,
  telefone text not null,
  local_imovel text,
  origem text default 'landing-page',
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- Habilitar RLS (Row Level Security)
alter table leads enable row level security;

-- Permitir inserção pública (formulário sem login)
create policy "Permitir inserção pública"
  on leads for insert
  to anon
  with check (true);

-- Bloquear leitura pública (só via dashboard Supabase)
create policy "Bloquear leitura pública"
  on leads for select
  to anon
  using (false);
