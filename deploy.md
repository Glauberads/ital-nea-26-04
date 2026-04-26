# Guia de Deploy — Metta Italínea

## Opção 1: Lovable (Recomendado)

A forma mais simples de publicar:

1. Clique no botão **Publish** no canto superior direito do editor Lovable
2. Aguarde o build finalizar
3. Sua aplicação estará disponível em `https://<projeto>.lovable.app`
4. Para conectar um domínio próprio: **Project Settings → Domains**

> **Nota:** Alterações no frontend requerem clicar em "Update" no diálogo de publicação. Alterações no backend (edge functions, migrations) são deployadas automaticamente.

## Opção 2: Vercel / Netlify

### Pré-requisitos
- Node.js 18+
- Conta na plataforma de hospedagem
- Repositório no GitHub

### Passos

```bash
# 1. Build de produção
npm run build

# 2. O output estará em dist/
```

**Vercel:**
1. Importe o repositório GitHub em [vercel.com/new](https://vercel.com/new)
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL` (se utilizada)
   - `VITE_SUPABASE_ANON_KEY` (se utilizada)
6. Clique em **Deploy**

> O arquivo `vercel.json` já está configurado com rewrites para SPA.

**Netlify:**
1. Importe o repositório em [app.netlify.com](https://app.netlify.com)
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Adicione as variáveis de ambiente (mesmas do Vercel)
5. Clique em **Deploy site**

## Opção 3: Hospedagem Estática (VPS / Apache / Nginx)

```bash
npm run build
# Copie o conteúdo de dist/ para o diretório público do servidor
```

Exemplo Nginx:
```nginx
server {
    listen 80;
    server_name meudominio.com.br;
    root /var/www/metta/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> O `try_files` com fallback para `/index.html` é essencial para o roteamento SPA funcionar (evita 404 ao recarregar páginas).

## Pré-requisitos do Ambiente

| Item | Detalhes |
|---|---|
| **Node.js** | 18+ (para build local) |
| **Supabase** | Projeto configurado com as tabelas: `leads`, `configuracoes`, `user_roles`, `galeria_midia`, `opcoes_formulario` |
| **Migrações** | Executar todos os arquivos SQL em `src/config/` e `supabase/migrations/` |
| **Credenciais** | URL e anon key configuradas em `src/config/supabase.ts` **antes** do build |
| **Storage** | Bucket de imagens criado no Supabase para a galeria de mídia |
| **RBAC** | Pelo menos um usuário com role `admin` na tabela `user_roles` |

## Checklist Pré-Deploy

- [ ] Credenciais Supabase configuradas em `src/config/supabase.ts`
- [ ] Todas as tabelas criadas no Supabase (`leads`, `configuracoes`, `user_roles`, `galeria_midia`, `opcoes_formulario`)
- [ ] Migrações em `supabase/migrations/` executadas
- [ ] Função `has_role()` e enum `app_role` criados
- [ ] Políticas RLS configuradas em todas as tabelas
- [ ] Bucket de storage criado para imagens
- [ ] Usuário admin configurado na tabela `user_roles`
- [ ] Build local funciona sem erros (`npm run build`)
- [ ] Formulários testados end-to-end (lead + redirecionamento WhatsApp)
- [ ] Galeria de imagens (showroom e projetos) carregando corretamente
- [ ] Opções de interesse do formulário configuradas via admin
- [ ] Meta tags SEO revisadas em `index.html`
- [ ] Domínio e SSL configurados na plataforma de hospedagem

## Checklist Pós-Deploy

- [ ] Landing page carrega sem erros no console
- [ ] Formulário de lead salva no Supabase e redireciona ao WhatsApp
- [ ] Seções Showroom e Nossos Projetos exibem imagens do banco
- [ ] Painel admin (`/admin`) acessível apenas para usuários autenticados com role admin
- [ ] Scripts de tracking (Google Ads, Facebook Pixel) injetados corretamente
- [ ] Webhooks configurados e respondendo (se ativados)
