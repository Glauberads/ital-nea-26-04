// ================================================
// CONFIGURAÇÃO DO SUPABASE
// Para trocar de projeto, altere apenas estas 2 linhas:
// ================================================

const SUPABASE_URL = "https://dxfbbjecztfeaiblelvt.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZmJiamVjenRmZWFpYmxlbHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTkxNzIsImV4cCI6MjA5MTczNTE3Mn0.XUmsIOuNQYtencCoe9eHbQUrjfasQ4QssoQ6mG4uHaM"

// ================================================
// NÃO ALTERE ABAIXO DESTA LINHA
// ================================================

import { createClient } from "@supabase/supabase-js"

if (!SUPABASE_URL || SUPABASE_URL.includes("SEU-PROJETO")) {
  console.warn("⚠️ Supabase não configurado. Edite src/config/supabase.ts")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export { SUPABASE_URL, SUPABASE_ANON_KEY }
