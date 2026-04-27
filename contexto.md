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
