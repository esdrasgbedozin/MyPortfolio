# 🚀 Portfolio Pro — Esdras GBEDOZIN

> Portfolio professionnel d'Ingénieur Full-Stack & Architecte Cloud, construit avec Astro, React, et déployé sur Vercel Edge Functions.

---

## 🏗️ Architecture

**Pattern** : Jamstack SSR + Islands Architecture + Edge Functions

```
┌──────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  Astro SSR   │   │  Edge Funcs   │   │   Static     │  │
│  │  Pages (8)   │   │  /api/*      │   │   Assets     │  │
│  │  FR/EN i18n  │   │  contact.json│   │  fonts/img   │  │
│  └──────┬──────┘   │  health      │   └──────────────┘  │
│         │           └──────┬───────┘                      │
│         │                  │                               │
│  ┌──────▼──────┐   ┌──────▼───────┐                      │
│  │ React Islands│   │   Services   │                      │
│  │ client:idle  │   │ ContactSvc   │                      │
│  │ Hero, Form,  │   │ TurnstileSvc │                      │
│  │ Filters...   │   │ EmailSvc     │                      │
│  └─────────────┘   │ RateLimitSvc │                      │
│                     └──────────────┘                      │
└──────────────────────────────────────────────────────────┘
```

### Stack Technique

| Couche         | Technologies                                                  |
| -------------- | ------------------------------------------------------------- |
| **Framework**  | Astro 5.x (SSR + Islands Architecture)                        |
| **UI**         | React 19, Tailwind CSS 4 (Vite plugin)                        |
| **Animations** | Framer Motion, tsParticles, react-parallax-tilt               |
| **API**        | Astro SSR Edge Functions (Vercel)                             |
| **Email**      | Resend (primary) + SendGrid (fallback) avec retry policy      |
| **Anti-spam**  | Cloudflare Turnstile + Rate Limiting 3-Tier                   |
| **Monitoring** | Sentry (error tracking) + JSON structured logging             |
| **Tests**      | Vitest (350+ tests) + Playwright (120+ E2E) + axe-core (a11y) |
| **CI/CD**      | GitHub Actions + Vercel + Lighthouse CI                       |
| **Langues**    | FR/EN avec détection Accept-Language                          |

### Design Patterns

- **Factory Pattern** : `createEmailService()` — Resend ou SendGrid selon configuration
- **Strategy Pattern** : Validation via Zod schemas
- **Repository Pattern** : Content Collections Astro (MDX/JSON)
- **Retry avec Exponential Backoff** : EmailService (3 tentatives, jitter)
- **Injection de Dépendances** : Services abstraits via interfaces TypeScript

---

## 📂 Structure du Projet

```
src/
├── components/       # Composants React (Islands) + Astro
├── content/          # Content Collections (MDX projets, JSON certifs/skills)
├── errors/           # Classes erreur RFC 7807 (ApiError, ValidationError...)
├── i18n/             # Traductions FR/EN (JSON)
├── layouts/          # Layout.astro (SEO, OG, JSON-LD, hreflang)
├── middleware/        # Security headers middleware
├── pages/
│   ├── api/          # Edge Functions (contact.json, health)
│   ├── fr/           # Pages françaises (8 pages)
│   └── en/           # Pages anglaises (8 pages)
├── schemas/          # Zod validation schemas
├── services/         # Business logic (Contact, Email, Turnstile, RateLimit)
├── styles/           # Global CSS + @font-face (Inter, JetBrains Mono)
├── types/            # TypeScript types
└── utils/            # Logger, i18n, Intl, Sentry, validateEnv
```

---

## 🧞 Commandes

```bash
pnpm install          # Installer les dépendances
pnpm dev              # Dev server (localhost:4321)
pnpm build            # Build production
pnpm preview          # Preview du build
pnpm test             # Vitest (350+ tests unitaires)
pnpm test:ui          # Vitest avec interface web
pnpm test:e2e         # Playwright E2E (120+ tests)
pnpm test:contract    # Tests de contrat OpenAPI
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm typecheck        # TypeScript strict check
pnpm build:analyze    # Analyse du bundle (visualizer)
pnpm openapi:lint     # Validation schema OpenAPI (Spectral)
```

---

## 🔒 Variables d'Environnement

Copier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

### Variables requises (production)

| Variable                    | Description                        | Format        |
| --------------------------- | ---------------------------------- | ------------- |
| `RESEND_API_KEY`            | Clé API Resend (envoi d'emails)    | `re_xxxxxxxx` |
| `TURNSTILE_SECRET_KEY`      | Clé secrète Cloudflare Turnstile   | `0x4xxxxxxxx` |
| `SENTRY_DSN`                | DSN Sentry (monitoring erreurs)    | URL           |
| `CONTACT_RECIPIENT_EMAIL`   | Email de destination du formulaire | email         |
| `PUBLIC_TURNSTILE_SITE_KEY` | Clé site Cloudflare Turnstile      | string        |

### Déploiement Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Ajouter chaque variable pour les scopes Production + Preview

> 📖 Guide détaillé : [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

---

## 🔐 Sécurité

- **Security Headers** : CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Rate Limiting 3-Tier** : 10 req/h → 3 req/h (24h pénalité) → Blocage permanent
- **Anti-Spam** : Cloudflare Turnstile (score >0.7 bypass rate limit)
- **Validation** : Zod côté client ET serveur
- **Secrets** : Variables d'env uniquement (jamais hardcodé)

---

## 🧪 Tests

```bash
# Tests unitaires (Vitest)
pnpm test                                    # 350+ tests, 32 fichiers

# Tests E2E (Playwright)
pnpm test:e2e                                # 120+ tests sur Chromium

# Tests d'accessibilité (axe-core WCAG 2.1 AA)
pnpm test:e2e -- e2e/accessibility.spec.ts

# Tests de contrat (OpenAPI)
pnpm test:contract
```

---

## ♿ Accessibilité

- **Standard** : WCAG 2.1 niveau AA
- **Tests automatisés** : axe-core via Playwright (12 pages)
- **Navigation** : 100% accessible au clavier
- **Contraste** : ≥4.5:1 (texte normal), ≥3:1 (texte large)
- **Motion** : Support `prefers-reduced-motion`

---

## 📖 Documentation

| Document                                                       | Description                               |
| -------------------------------------------------------------- | ----------------------------------------- |
| [`00_BIBLE_PROJET.md`](00_BIBLE_PROJET.md)                     | Vision, KPIs, scope fonctionnel           |
| [`01_ARCHITECTURE_TECHNIQUE.md`](01_ARCHITECTURE_TECHNIQUE.md) | Architecture Jamstack, patterns, sécurité |
| [`02_NORMES_OPERATIONNELLES.md`](02_NORMES_OPERATIONNELLES.md) | SOLID, TDD, gestion erreurs RFC 7807      |
| [`openapi.yaml`](openapi.yaml)                                 | Contrat API OpenAPI 3.0                   |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                 | Architecture détaillée des services       |
| [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)         | Guide de déploiement Vercel               |
| [`MONITORING.md`](MONITORING.md)                               | Monitoring Sentry + alertes               |

---

## 🚀 Déploiement

Le projet se déploie automatiquement sur Vercel :

- **Push sur `main`** → Deploy production
- **Push sur `develop`** → Deploy preview
- **Pull Request** → Deploy preview + Lighthouse CI

### Checklist pré-production

- [ ] Variables d'environnement configurées sur Vercel
- [ ] `pnpm test` passe (350+ tests)
- [ ] `pnpm build` réussit
- [ ] Lighthouse >90 toutes catégories
- [ ] Tests de contrat passent (`openapi.yaml`)

---

## 📄 Licence

Projet personnel — © 2025 Esdras GBEDOZIN
