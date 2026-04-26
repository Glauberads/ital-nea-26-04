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
- ✅ Seção Sobre (história da empresa)
- ✅ Seção Autoridade (franquia Italínea com logo oficial)
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
- ✅ **Personalização** — Upload de logos (Header e Sobre) com opção de exibir em branco e edição da headline/subtítulo do Hero (bucket `logos` + tabela `configuracoes`)
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
- **Tabelas:** `leads`, `configuracoes`, `user_roles`, `admins`, `galeria_midia`, `opcoes_formulario`, `opcoes_local`, `depoimentos`
- **Storage Buckets:** `logos` (público — logos do Header e Sobre)
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
