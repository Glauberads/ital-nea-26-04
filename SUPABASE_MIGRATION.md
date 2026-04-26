# Como trocar o projeto Supabase

1. Abra o arquivo `src/config/supabase.ts`
2. Substitua `SUPABASE_URL` pela URL do novo projeto
3. Substitua `SUPABASE_ANON_KEY` pela anon key do novo projeto
4. No novo projeto Supabase, execute o SQL em `src/config/supabase-schema.sql`
5. Pronto — nenhum outro arquivo precisa ser alterado.

## Onde encontrar URL e anon key
Supabase Dashboard → seu projeto → Settings → API
- Project URL = SUPABASE_URL
- anon public = SUPABASE_ANON_KEY
