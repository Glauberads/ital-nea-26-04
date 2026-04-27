# DOCUMENTAÇÃO COMPLETA — METTA ITALÍNEA

*Gerado em: 26/04/2026, 22:53:37*

---


# SEÇÃO: CONDIÇÕES INICIAIS E CONTEXTO

# Contexto do Projeto — Metta Italínea

## Objetivo
Landing page de alta conversão + painel administrativo para a **Italínea by Salapronta**, loja de móveis planejados premium localizada em **Barueri e Região**. A página captura leads via formulário e WhatsApp (11 94005-9909), reforçando autoridade da marca (franquia Italínea, +40 anos de história). Todas as mensagens de WhatsApp incluem a tag `gads` para rastreamento de origem.

## Público-Alvo
- Moradores de Barueri, Grande SP e região
- Classes B e A, buscando móveis planejados para casa nova, reforma ou decoração
- Perfil: 28–55 anos, valorizam qualidade, design e condições de pagamento facilitadas

## Funcionalidades Principais

### Landing Page (`/`)
| Funcionalidade | Descrição |
|---|---|
| **Formulário de leads** | Campos nome, e-mail, telefone (com máscara), local do imóvel e interesse (opções dinâmicas da tabela `opcoes_formulario`). Salva no Supabase e redireciona ao WhatsApp (11 94005-9909) com tag `gads` |
| **Modal de qualificação** | `LeadQualificationModal` para captura adicional de informações do lead |
| **Exit Intent Popup** | Detecta intenção de saída do mouse e exibe modal com formulário simplificado (1× por sessão via `sessionStorage`) |
| **Nosso Showroom** | Grid dinâmico de imagens da categoria `showroom` da tabela `galeria_midia`, com título e descrição por imagem |
| **Nossos Projetos** | Grid dinâmico de imagens da categoria `projetos` da tabela `galeria_midia`, com título e descrição por imagem |
| **Contador regressivo** | Timer de 48h na seção de promoção, persistido via `localStorage` |
| **Captura de UTMs** | Parâmetros `utm_source`, `utm_medium` e `utm_campaign` extraídos automaticamente da URL e salvos junto ao lead |
| **WhatsApp flutuante** | Botão fixo no canto inferior esquerdo + bolha de chat rápido no canto direito (nº 11 94005-9909, tag `gads`) |
| **Mapa de localização** | Embed do Google Maps configurável via tabela `configuracoes` |
| **Reforço de oferta** | Seção `OfferReinforcement` com chamadas adicionais para conversão |
| **Carrossel de depoimentos** | Prova social com avaliações 5 estrelas |
| **Scroll suave** | Navegação interna entre seções via âncoras |
| **Tracking dinâmico** | Scripts de Google Ads e Facebook Pixel injetados em tempo real a partir da tabela `configuracoes` |

### Dashboard Admin (`/admin`)
| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Visão geral com métricas e KPIs de leads |
| **Leads** | Tabela com todos os leads capturados, filtros e busca |
| **Mídia** | Gestão de imagens do showroom e projetos: upload, edição de título/descrição, categorização (`showroom` ou `projetos`), ordenação. Dados na tabela `galeria_midia` |
| **Marketing** | Configuração de Google Ads ID/Label, Facebook Pixel ID, GTM ID, webhooks (POST e GET) e número de WhatsApp. Valores salvos na tabela `configuracoes` |
| **Opções do Formulário** | CRUD completo das opções de interesse exibidas no formulário da landing page. Dados na tabela `opcoes_formulario` |
| **Redes Sociais** | Edição das URLs de Instagram, Facebook, YouTube, TikTok e Twitter exibidas no Footer (tabela `configuracoes`) |
| **Depoimentos** | CRUD de depoimentos exibidos no carrossel da landing page (tabela `depoimentos` com campos nome, texto, data, ordem, público) |
| **Personalização** | Upload das logos (Header, Sobre, Nossa Rede e Rodapé) e imagem aérea da fábrica (bucket `logos`), com toggle "exibir em branco" para logos específicas + edição de headline, highlight e subtítulo do Hero (tabela `configuracoes`) |
| **Sidebar** | Menu lateral dark mode premium (zinc-950 + destaques azul/dourado) com ícones lucide-react |

### Autenticação & Segurança
| Funcionalidade | Descrição |
|---|---|
| **Login** | Autenticação via Supabase Auth (email/senha) em `/login` |
| **Proteção de rotas** | Rotas `/admin/*` acessíveis apenas para usuários com role `admin` |
| **RBAC** | Tabela `user_roles` com enum `app_role` (admin, moderator, user) |
| **RLS** | Row Level Security ativa em `leads`, `configuracoes`, `user_roles`, `galeria_midia` e `opcoes_formulario` |
| **Super Admin** | UUID `6e5ca618-c217-42cf-898c-ccdd6a162b0d` configurado como admin |

## Tecnologias Utilizadas
| Tecnologia | Função |
|---|---|
| **React 18** + **TypeScript** | Framework e tipagem |
| **Vite 5** | Build e dev server |
| **Tailwind CSS v3** | Estilização com design tokens semânticos |
| **Framer Motion** | Animações (fade-in, scale, hover) |
| **React Hook Form** + **Zod** | Validação de formulários |
| **react-input-mask** | Máscara de telefone `(99) 99999-9999` |
| **Supabase** | Auth, banco de dados (PostgreSQL), Storage, RLS |
| **shadcn/ui** | Componentes base (button, card, dialog, table, etc.) |
| **React Query** | Cache e sincronização de dados do servidor |
| **lucide-react** | Ícones do painel admin e landing page |

## Estrutura de Pastas
```
src/
├── config/
│   ├── supabase.ts               # Cliente Supabase (único ponto de configuração)
│   ├── supabase-schema.sql       # SQL para criar tabela leads
│   └── supabase-configuracoes.sql# SQL para criar tabela configuracoes
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx       # Layout do painel com sidebar protegida
│   ├── landing/                  # Todas as seções da LP (13 componentes)
│   └── TrackingScripts.tsx       # Injeção dinâmica de scripts de tracking
├── contexts/
│   └── AuthContext.tsx           # Provider de autenticação + verificação de role
├── hooks/
│   ├── useLeadForm.ts           # Hook compartilhado para submissão de leads
│   └── use-mobile.tsx           # Detecção de dispositivo mobile
├── integrations/supabase/
│   ├── client.ts                # Cliente Supabase (gerado pela integração)
│   └── types.ts                 # Tipos TypeScript gerados
└── pages/
    ├── Index.tsx                 # Composição da landing page
    ├── Login.tsx                 # Página de login
    ├── NotFound.tsx              # Página 404
    └── admin/
        ├── Dashboard.tsx         # Visão geral
        ├── Leads.tsx             # Tabela de leads
        ├── Midia.tsx             # Gestão de mídia (showroom + projetos)
        ├── Marketing.tsx         # Configurações de marketing + webhooks
        ├── FormOptions.tsx       # Opções do formulário de interesse
        ├── RedesSociais.tsx      # URLs das redes sociais (Footer)
        ├── Depoimentos.tsx       # CRUD de depoimentos
        └── Personalizacao.tsx    # Upload de logos + edição da headline do Hero
```

## Integração Supabase
- **Projeto:** `dxfbbjecztfeaiblelvt.supabase.co`
- **Tabelas:** `leads`, `configuracoes` (incluindo campos dinâmicos `about_factory_url`, `about_metta_logo_url`, `authority_logo_url`, `footer_logo_url`), `user_roles`, `admins`, `galeria_midia`, `opcoes_formulario`, `opcoes_local`, `depoimentos`
- **Auth:** Email/senha com role-based access (função `is_admin()` security definer)
- **RLS:** Ativa em todas as tabelas
- **Storage Buckets:** `galeria` (imagens do showroom/projetos) e `logos` (logos do Header/Sobre/Rede e imagem da fábrica — público)
- O cliente é instanciado em `src/integrations/supabase/client.ts`
- Para trocar de projeto/ambiente, veja `SUPABASE_MIGRATION.md`


---


# SEÇÃO: GUIA DE INICIALIZAÇÃO (README)

# Metta Italínea — Landing Page + Admin

Landing page de conversão para a **Italínea by Salapronta**, loja de móveis planejados premium em **Barueri e Região**. Captura leads via formulário + WhatsApp (11 94005-9909), com integração Supabase e identificação de origem via tag `gads`.

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS · Framer Motion · Supabase · shadcn/ui · React Query · React Hook Form · Zod · react-input-mask

## Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd <nome-do-repo>

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# O arquivo .env já contém as credenciais do Supabase (URL e anon key)

# 4. Execute as migrações SQL no Supabase SQL Editor:
#    - src/config/supabase-schema.sql (tabela leads)
#    - src/config/supabase-configuracoes.sql (tabela configuracoes)
#    - Migração de roles (user_roles + RLS policies)
#    - Migrações em supabase/migrations/ (galeria_midia, opcoes_formulario, etc.)

# 5. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Linting com ESLint |

## Funcionalidades

### Landing Page (`/`)
- ✅ Barra de benefícios fixa no topo
- ✅ Hero section com CTA e scroll suave
- ✅ Seção Sobre — Imagem da fábrica e logos dinâmicas via admin
- ✅ Seção Autoridade — Logo oficial da rede Italínea dinâmica via admin
- ✅ **Nosso Showroom** — Grid dinâmico com imagens da categoria `showroom` (tabela `galeria_midia`), com título e descrição por imagem
- ✅ **Nossos Projetos** — Grid dinâmico com imagens da categoria `projetos` (tabela `galeria_midia`), com título e descrição por imagem
- ✅ Promoção com contador regressivo de 48h
- ✅ Depoimentos com avaliações 5 estrelas
- ✅ Formulário principal com validação, máscara de telefone e opções de interesse dinâmicas (tabela `opcoes_formulario`)
- ✅ Modal de qualificação de lead (`LeadQualificationModal`)
- ✅ Exit intent popup (1× por sessão)
- ✅ Botão WhatsApp flutuante + chat rápido (nº 11 94005-9909, tag `gads`)
- ✅ Mapa de localização integrado (Google Maps embed configurável)
- ✅ Captura de UTMs (`utm_source`, `utm_medium`, `utm_campaign`)
- ✅ Design escuro e sofisticado, totalmente responsivo
- ✅ Reforço de oferta (seção `OfferReinforcement`)

### Dashboard Admin (`/admin`)
- ✅ Layout com sidebar dark mode premium (zinc-950 + destaques azul/dourado)
- ✅ **Dashboard** — Visão geral com métricas e KPIs
- ✅ **Leads** — Tabela de leads capturados com filtros
- ✅ **Mídia** — Gestão de imagens do showroom e projetos (upload, edição de título/descrição, categorias, ordenação)
- ✅ **Marketing** — Configurações de Google Ads, Facebook Pixel, GTM, webhooks e WhatsApp
- ✅ **Opções do Formulário** — CRUD completo de opções de interesse (tabela `opcoes_formulario`)
- ✅ **Redes Sociais** — Gestão das URLs de Instagram, Facebook, YouTube, TikTok e Twitter exibidas no Footer
- ✅ **Depoimentos** — CRUD de depoimentos exibidos no carrossel da landing (tabela `depoimentos`)
- ✅ **Personalização** — Gestão dinâmica de ativos de marca: upload de logos (Header, Sobre, Nossa Rede, Rodapé) e imagem da fábrica, com opção de exibir em branco e edição da headline/subtítulo do Hero (bucket `logos` + tabela `configuracoes`)
- ✅ Scripts de tracking injetados dinamicamente via tabela `configuracoes`

### Autenticação & Segurança
- ✅ Login via Supabase Auth (`/login`)
- ✅ Rotas `/admin/*` protegidas — apenas usuários autenticados com role `admin`
- ✅ Sistema RBAC com tabela `user_roles` e enum `app_role`
- ✅ Função `has_role()` (security definer) para RLS sem recursão
- ✅ Políticas RLS nas tabelas `leads`, `configuracoes`, `galeria_midia` e `opcoes_formulario`

## Estrutura de Pastas

```
src/
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx       # Layout do painel com sidebar
│   ├── landing/
│   │   ├── HeroSection.tsx       # Hero com CTA
│   │   ├── AboutSection.tsx      # Sobre a empresa
│   │   ├── AuthoritySection.tsx  # Franquia Italínea
│   │   ├── ShowroomSection.tsx   # Galeria showroom (dinâmica)
│   │   ├── GallerySection.tsx    # Nossos Projetos (dinâmica)
│   │   ├── PromotionSection.tsx  # Promoção com timer
│   │   ├── TestimonialsSection.tsx # Depoimentos
│   │   ├── OfferReinforcement.tsx # Reforço de oferta
│   │   ├── ContactForm.tsx       # Formulário principal
│   │   ├── MapSection.tsx        # Mapa de localização
│   │   ├── ExitIntentPopup.tsx   # Popup de saída
│   │   ├── LeadQualificationModal.tsx # Modal de qualificação
│   │   ├── FloatingElements.tsx  # WhatsApp flutuante
│   │   └── Footer.tsx            # Rodapé
│   ├── ui/                       # Componentes shadcn/ui
│   └── TrackingScripts.tsx       # Scripts dinâmicos (Ads, Pixel)
├── config/
│   ├── supabase.ts               # Cliente Supabase
│   ├── supabase-schema.sql       # SQL tabela leads
│   └── supabase-configuracoes.sql# SQL tabela configuracoes
├── contexts/
│   └── AuthContext.tsx            # Contexto de autenticação + RBAC
├── hooks/
│   ├── useLeadForm.ts            # Hook de submissão de leads
│   └── use-mobile.tsx            # Detecção de mobile
├── integrations/supabase/
│   ├── client.ts                 # Cliente Supabase (gerado)
│   └── types.ts                  # Tipos TypeScript (gerado)
└── pages/
    ├── Index.tsx                  # Landing page
    ├── Login.tsx                  # Página de login
    ├── NotFound.tsx               # Página 404
    └── admin/
        ├── Dashboard.tsx          # Visão geral
        ├── Leads.tsx              # Gestão de leads
        ├── Midia.tsx              # Gestão de mídia (showroom + projetos)
        ├── Marketing.tsx          # Config. de marketing + webhooks
        ├── FormOptions.tsx        # Opções do formulário de interesse
        ├── RedesSociais.tsx       # URLs das redes sociais (Footer)
        ├── Depoimentos.tsx        # CRUD de depoimentos
        └── Personalizacao.tsx     # Upload de logos + edição da headline do Hero
```

## Integração Supabase

- **Projeto:** `dxfbbjecztfeaiblelvt.supabase.co`
- **Tabelas:** `leads`, `configuracoes` (incluindo campos de imagem dinâmicos), `user_roles`, `admins`, `galeria_midia`, `opcoes_formulario`, `opcoes_local`, `depoimentos`
- **Storage Buckets:** `logos` (público — logos e ativos de marca), `galeria` (showroom e projetos)
- **Auth:** Email/senha com proteção por role (função `is_admin()`)
- **RLS:** Ativa em todas as tabelas

Veja [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) para trocar de projeto/ambiente.

## Deploy

Veja [deploy.md](./deploy.md) para instruções detalhadas de implantação.

## Contribuição

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Faça suas alterações
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request


---


# SEÇÃO: GUIA DE DEPLOY E OPERAÇÃO

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
| **Supabase** | Projeto configurado com as tabelas: `leads`, `configuracoes`, `user_roles`, `galeria_midia`, `opcoes_formulario`. **Nota:** A tabela `configuracoes` deve conter as colunas `about_factory_url`, `about_metta_logo_url`, `authority_logo_url` e `footer_logo_url`. |
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
- [ ] Seções Sobre e Nossa Rede exibem imagens carregadas via admin
- [ ] Painel admin (`/admin`) acessível apenas para usuários autenticados com role admin
- [ ] Scripts de tracking (Google Ads, Facebook Pixel) injetados corretamente
- [ ] Webhooks configurados e respondendo (se ativados)

## Sincronização de Repositórios

O projeto utiliza dois repositórios sincronizados:
- `origin`: `https://github.com/Glauberads/ital-nea-26-04.git` (Repositório principal de desenvolvimento)
- `vercel`: `https://github.com/Glauberads/italinea-260426.git` (Repositório conectado ao deploy da Vercel)

Para garantir que o site ao vivo seja atualizado, realize o push para ambos:
```bash
git push origin main
git push vercel main
```


---


# SEÇÃO: MIGRAÇÃO SUPABASE

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


---

