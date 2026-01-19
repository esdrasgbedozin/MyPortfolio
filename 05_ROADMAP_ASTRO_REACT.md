# 05_ROADMAP_ASTRO_REACT.md

> **Roadmap de Développement : Frontend Astro + React Islands**  
> Projet : Portfolio Professionnel d'Ingénieur Informatique  
> Date : 17 janvier 2026  
> Version : 1.0  
> Statut : ✅ **VALIDÉ**

---

## Contexte

**Architecture** : Jamstack SSG (Astro) + Islands Architecture (React interactif)

**Stratégie Mock-First** :
- Le Frontend consomme le **Mock Server** (Prism) immédiatement
- Ne pas attendre le Backend/Edge Functions réels
- Switch vers API réelle en Phase finale seulement

**Priorités** :
1. **Performance** : Lighthouse >90, FCP <2s
2. **Accessibilité** : WCAG 2.1 AA
3. **i18n** : Bilingue FR/EN dès le départ
4. **Dark Mode First** : Thème sombre par défaut

**Stratégie TDD** : Tests composants + tests e2e

---

## Ordre d'Exécution Impératif

### Phase 1 : Setup & Configuration
### Phase 2 : Design System & Composants UI (Dumb)
### Phase 3 : Routing & Pages Statiques
### Phase 4 : Content Collections (MDX)
### Phase 5 : Composants Interactifs (React Islands)
### Phase 6 : Intégration API Mock
### Phase 7 : i18n & Traductions
### Phase 8 : Optimisations & Déploiement

---

## PHASE 1 : SETUP & CONFIGURATION

### Epic 1.1 : Initialisation Projet

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-001** | Initialiser projet Astro | - | 15min | `pnpm create astro@latest` exécuté, template minimal |
| **FE-002** | Installer intégrations Astro | FE-001 | 15min | `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/mdx` installés |
| **FE-003** | Configurer TypeScript strict | FE-001 | 10min | `tsconfig.json` avec `strict: true`, compilation OK |
| **FE-004** | Configurer Tailwind CSS | FE-002 | 20min | `tailwind.config.mjs` avec design tokens, test classe fonctionne |
| **FE-005** | Installer React + dépendances UI | FE-002 | 15min | `react`, `react-dom`, `react-hook-form`, `zod` installés |

### Epic 1.2 : Outils de Développement

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-006** | Installer Vitest + Testing Library | FE-001 | 20min | Vitest configuré, premier test dummy passe |
| **FE-007** | Installer Playwright | FE-001 | 20min | Playwright installé, test e2e dummy passe |
| **FE-008** | Configurer ESLint + Prettier | FE-001 | 20min | `.eslintrc`, `.prettierrc`, `pnpm lint` et `pnpm format` passent |
| **FE-009** | Configurer Husky + lint-staged | FE-008 | 15min | Pre-commit hook lint+format+typecheck, test commit OK |

### Epic 1.3 : Mock Server Setup

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-010** | Installer Prism CLI | FE-001 | 10min | `@stoplight/prism-cli` installé |
| **FE-011** | Copier openapi.yaml dans projet | FE-010 | 5min | `openapi.yaml` dans `/api/` |
| **FE-012** | Tester mock server localement | FE-011 | 15min | `npx prism mock openapi.yaml` lance serveur sur :4010 |
| **FE-013** | Créer script npm dev:mock | FE-012 | 10min | `pnpm run dev:mock` lance Astro + Prism en parallèle |

---

## PHASE 2 : DESIGN SYSTEM & COMPOSANTS UI (DUMB)

### Epic 2.1 : Design Tokens

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-014** | Définir palette couleurs (Dark Mode First) | FE-004 | 30min | `tailwind.config` avec colors dark/light, test visuel OK |
| **FE-015** | Définir typographie | FE-004 | 20min | Font stack configurée, tailles h1-h6 + body |
| **FE-016** | Définir spacing scale | FE-004 | 15min | Scale 4/8/12/16/24/32/48/64px configurée |
| **FE-017** | Définir breakpoints responsive | FE-004 | 15min | sm/md/lg/xl/2xl configurés, test resize OK |

### Epic 2.2 : Composants Atomiques (Astro)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-018** | ✅ TEST : Test composant Button | FE-006 | 30min | Test Vitest variantes primary/secondary/ghost (RED) |
| **FE-019** | ✅ CODE : Créer composant Button.astro | FE-018 | 40min | Composant avec props variant/size/disabled (GREEN) |
| **FE-020** | ✅ TEST : Test composant Card | FE-006 | 30min | Test Card avec header/body/footer (RED) |
| **FE-021** | ✅ CODE : Créer composant Card.astro | FE-020 | 40min | Composant Card stylisé dark mode (GREEN) |
| **FE-022** | ✅ TEST : Test composant Badge | FE-006 | 20min | Test Badge avec colors (RED) |
| **FE-023** | ✅ CODE : Créer composant Badge.astro | FE-022 | 30min | Badge avec variantes success/warning/error (GREEN) |
| **FE-024** | ✅ TEST : Test composant Input | FE-006 | 30min | Test Input avec label/error (RED) |
| **FE-025** | ✅ CODE : Créer composant Input.astro | FE-024 | 40min | Input accessible avec ARIA (GREEN) |

### Epic 2.3 : Composants Layout (Astro)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-026** | ✅ TEST : Test layout BaseLayout | FE-006 | 30min | Test structure HTML5 semantic (RED) |
| **FE-027** | ✅ CODE : Créer BaseLayout.astro | FE-026 | 60min | Layout avec <head>, <header>, <main>, <footer> (GREEN) |
| **FE-028** | ✅ TEST : Test composant Header | FE-006 | 30min | Test navigation + logo (RED) |
| **FE-029** | ✅ CODE : Créer Header.astro | FE-028 | 50min | Header avec nav responsive + logo (GREEN) |
| **FE-030** | ✅ TEST : Test composant Footer | FE-006 | 20min | Test liens sociaux + copyright (RED) |
| **FE-031** | ✅ CODE : Créer Footer.astro | FE-030 | 40min | Footer avec liens + copyright (GREEN) |

---

## PHASE 3 : ROUTING & PAGES STATIQUES

### Epic 3.1 : Configuration Routing

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-032** | Configurer i18n routing Astro | FE-001 | 30min | `astro.config.mjs` avec locales fr/en, routing préfixé |
| **FE-033** | Créer structure pages i18n | FE-032 | 15min | Dossiers `pages/fr/` et `pages/en/` créés |

### Epic 3.2 : Page d'Accueil (Hero + Présentation)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-034** | ✅ TEST : Test page index.astro | FE-007 | 30min | Test e2e Playwright page accueil existe (RED) |
| **FE-035** | ✅ CODE : Créer page [lang]/index.astro | FE-034, FE-027 | 60min | Page avec Hero section + BaseLayout (GREEN) |
| **FE-036** | ✅ TEST : Test composant Hero | FE-006 | 30min | Test Hero avec titre + CTA (RED) |
| **FE-037** | ✅ CODE : Créer composant Hero.astro | FE-036 | 50min | Hero avec animation + boutons CTA (GREEN) |
| **FE-038** | 🔵 REFACTOR : Optimiser images Hero | FE-037 | 30min | Astro Image avec lazy loading, LCP <2s |

### Epic 3.3 : Page Projets (Liste)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-039** | ✅ TEST : Test page projets | FE-007 | 30min | Test e2e page /fr/projets existe (RED) |
| **FE-040** | ✅ CODE : Créer page [lang]/projets/index.astro | FE-039 | 50min | Page liste projets (placeholder) (GREEN) |
| **FE-041** | ✅ TEST : Test composant ProjectCard | FE-006 | 40min | Test ProjectCard avec mock data (RED) |
| **FE-042** | ✅ CODE : Créer ProjectCard.astro | FE-041, FE-021 | 60min | Card projet avec titre/techno/date (GREEN) |
| **FE-043** | 🔵 REFACTOR : Grid responsive projets | FE-042 | 30min | CSS Grid 1/2/3 colonnes selon breakpoint |

### Epic 3.4 : Page Certifications

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-044** | ✅ TEST : Test page certifications | FE-007 | 30min | Test e2e page /fr/certifications existe (RED) |
| **FE-045** | ✅ CODE : Créer page [lang]/certifications.astro | FE-044 | 50min | Page liste certifications (GREEN) |
| **FE-046** | ✅ TEST : Test composant CertificationBadge | FE-006 | 30min | Test badge avec logo + nom (RED) |
| **FE-047** | ✅ CODE : Créer CertificationBadge.astro | FE-046, FE-023 | 50min | Badge certification stylisé (GREEN) |

### Epic 3.5 : Page Compétences

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-048** | ✅ TEST : Test page compétences | FE-007 | 30min | Test e2e page /fr/competences existe (RED) |
| **FE-049** | ✅ CODE : Créer page [lang]/competences.astro | FE-048 | 50min | Page skills groupées par catégorie (GREEN) |
| **FE-050** | ✅ TEST : Test composant SkillCard | FE-006 | 30min | Test skill avec niveau (RED) |
| **FE-051** | ✅ CODE : Créer SkillCard.astro | FE-050 | 40min | Card skill avec barre niveau (GREEN) |

### Epic 3.6 : Page Contact (Formulaire)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-052** | ✅ TEST : Test page contact | FE-007 | 30min | Test e2e page /fr/contact existe (RED) |
| **FE-053** | ✅ CODE : Créer page [lang]/contact.astro | FE-052 | 40min | Page avec formulaire (placeholder) (GREEN) |

---

## PHASE 4 : CONTENT COLLECTIONS (MDX)

### Epic 4.1 : Configuration Content Collections

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-054** | Configurer Content Collections | FE-002 | 30min | `src/content/config.ts` avec schemas Zod |
| **FE-055** | Créer schema Project | FE-054 | 40min | Schema Zod pour projets (conforme openapi.yaml) |
| **FE-056** | Créer schema Certification | FE-054 | 30min | Schema Zod pour certifications |
| **FE-057** | Créer schema Skill | FE-054 | 20min | Schema Zod pour compétences |

### Epic 4.2 : Content Dummy (Tests)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-058** | Créer 3 projets dummy (FR/EN) | FE-055 | 40min | 3 fichiers `content/projects/*.{fr,en}.mdx` |
| **FE-059** | Créer 5 certifications dummy (FR/EN) | FE-056 | 30min | 5 fichiers `content/certifications/*.{fr,en}.md` |
| **FE-060** | Créer skills dummy (FR/EN) | FE-057 | 20min | `content/skills/skills.{fr,en}.json` |

### Epic 4.3 : Intégration Content dans Pages

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-061** | ✅ TEST : Test affichage projets réels | FE-007, FE-058 | 40min | Test e2e liste projets affiche 3 projets (RED) |
| **FE-062** | ✅ CODE : Intégrer getCollection dans page projets | FE-061 | 50min | Page projets affiche content real (GREEN) |
| **FE-063** | ✅ TEST : Test page détail projet | FE-007 | 40min | Test e2e /fr/projets/[slug] (RED) |
| **FE-064** | ✅ CODE : Créer page [lang]/projets/[slug].astro | FE-063 | 60min | Page détail avec MDX content (GREEN) |
| **FE-065** | 🔵 REFACTOR : SEO meta tags projet | FE-064 | 30min | Open Graph + Twitter Cards dynamiques |

---

## PHASE 5 : COMPOSANTS INTERACTIFS (REACT ISLANDS)

### Epic 5.1 : Theme Toggle (Dark/Light)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-066** | ✅ TEST : Test ThemeToggle component | FE-006 | 40min | Test React Testing Library toggle theme (RED) |
| **FE-067** | ✅ CODE : Créer ThemeToggle.tsx | FE-066 | 60min | Composant React avec useState + localStorage (GREEN) |
| **FE-068** | ✅ CODE : Intégrer dans Header | FE-067, FE-029 | 30min | Island `client:load` dans Header (GREEN) |
| **FE-069** | 🔵 REFACTOR : Détecter prefers-color-scheme | FE-068 | 30min | Auto-detect système + respect user choice |

### Epic 5.2 : Filtres Projets (Interactif)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-070** | ✅ TEST : Test ProjectFilter component | FE-006 | 40min | Test filtrage par technologie (RED) |
| **FE-071** | ✅ CODE : Créer ProjectFilter.tsx | FE-070 | 70min | Composant React avec filtres techno/catégorie (GREEN) |
| **FE-072** | ✅ CODE : Créer ProjectList.tsx (container) | FE-071 | 60min | Composant React qui gère state filtres (GREEN) |
| **FE-073** | ✅ CODE : Intégrer dans page projets | FE-072, FE-040 | 40min | Island `client:idle` dans page projets (GREEN) |
| **FE-074** | 🔵 REFACTOR : Persister filtres dans URL | FE-073 | 40min | Query params ?tech=react, SEO-friendly |

---

## PHASE 6 : INTÉGRATION API MOCK

### Epic 6.1 : Configuration API Client

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-075** | Créer service API client | FE-001 | 40min | `src/services/api.ts` avec fetch wrapper |
| **FE-076** | Configurer base URL mock | FE-075, FE-013 | 15min | Env var `PUBLIC_API_URL=http://localhost:4010/api` |
| **FE-077** | ✅ TEST : Test API client mock | FE-006, FE-076 | 40min | Test fetch /api/health retourne 200 (RED → GREEN) |

### Epic 6.2 : Formulaire Contact (React + API Mock)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-078** | ✅ TEST : Test ContactForm validation | FE-006 | 40min | Test React Hook Form + Zod validation (RED) |
| **FE-079** | ✅ CODE : Créer ContactForm.tsx | FE-078 | 90min | Form React avec validation Zod (GREEN) |
| **FE-080** | ✅ TEST : Test soumission mock API | FE-007, FE-079 | 40min | Test e2e submit form → mock retourne 200 (RED) |
| **FE-081** | ✅ CODE : Intégrer API mock dans form | FE-080, FE-075 | 50min | POST /api/contact vers mock server (GREEN) |
| **FE-082** | ✅ CODE : Gérer états loading/success/error | FE-081 | 50min | UI feedback utilisateur (GREEN) |
| **FE-083** | ✅ CODE : Intégrer Turnstile widget | FE-082 | 40min | Widget Cloudflare Turnstile (mock token) (GREEN) |
| **FE-084** | ✅ CODE : Intégrer dans page contact | FE-083, FE-053 | 30min | Island `client:visible` dans page contact (GREEN) |

---

## PHASE 7 : i18n & TRADUCTIONS

### Epic 7.1 : Configuration i18n

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-085** | Installer astro-i18next | FE-001 | 20min | Package installé, config de base |
| **FE-086** | Créer fichiers traductions FR | FE-085 | 60min | `src/i18n/fr.json` avec toutes les clés UI |
| **FE-087** | Créer fichiers traductions EN | FE-085 | 60min | `src/i18n/en.json` avec toutes les clés UI |
| **FE-088** | Créer helper t() pour traductions | FE-086, FE-087 | 30min | Fonction `t(key, locale)` dans utils |

### Epic 7.2 : Application Traductions

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-089** | Appliquer traductions Header | FE-088, FE-029 | 30min | Nav links traduits FR/EN |
| **FE-090** | Appliquer traductions Footer | FE-088, FE-031 | 20min | Footer traduit FR/EN |
| **FE-091** | Appliquer traductions pages | FE-088 | 60min | Tous les titres/labels traduits |
| **FE-091a** | ✅ TEST : Test formatage dates i18n | FE-006 | 30min | Test formatDate() FR vs EN (RED) |
| **FE-091b** | ✅ CODE : Créer utils i18n dates/nombres | FE-091a | 40min | Fonctions `formatDate()`, `formatNumber()` avec Intl API (GREEN) |
| **FE-091c** | 🔵 REFACTOR : Intégrer dans composants | FE-091b | 30min | Toutes dates/nombres utilisent Intl, tests passent |
| **FE-092** | ✅ TEST : Test switch langue | FE-007, FE-091c | 40min | Test e2e clic FR → EN change contenu + format dates (RED → GREEN) |

### Epic 7.3 : Détection Langue & SEO

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-093** | Implémenter détection langue navigateur | FE-032 | 30min | Auto-redirect vers /fr ou /en selon Accept-Language |
| **FE-094** | Ajouter hreflang tags | FE-091 | 30min | `<link rel="alternate" hreflang="fr">` sur toutes les pages |
| **FE-095** | Créer sitemap.xml multilingue | FE-094 | 30min | Sitemap avec URLs FR + EN |

---

## PHASE 8 : OPTIMISATIONS & DÉPLOIEMENT

### Epic 8.1 : Performance

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-096** | Optimiser images (Astro Image) | FE-038 | 40min | Toutes images lazy-load + webp, LCP <2s |
| **FE-097** | Inline CSS critique | FE-027 | 30min | CSS critique <14KB inline dans <head> |
| **FE-098** | Audit Lighthouse | FE-096, FE-097 | 30min | Score >90 toutes catégories |
| **FE-099** | Optimiser fonts (preload) | FE-015 | 20min | `<link rel="preload">` fonts critique |

### Epic 8.2 : Accessibilité

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-100** | Audit axe DevTools | FE-098 | 30min | 0 erreurs axe, warnings résolus |
| **FE-101** | Test navigation clavier | FE-100 | 40min | 100% site navigable au clavier |
| **FE-102** | Test lecteur d'écran (NVDA) | FE-101 | 50min | Toutes pages lisibles par lecteur |
| **FE-103** | Vérifier contrastes couleurs | FE-014 | 30min | Ratio ≥4.5:1 texte normal, ≥3:1 texte large |

### Epic 8.3 : SEO

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-104** | Créer meta tags dynamiques | FE-027 | 40min | Titre + description uniques par page |
| **FE-105** | Ajouter Open Graph images | FE-104 | 30min | OG images générées automatiquement |
| **FE-106** | Configurer robots.txt | FE-001 | 10min | `public/robots.txt` avec sitemap URL |
| **FE-107** | Ajouter JSON-LD structured data | FE-104 | 40min | Schema.org Person + WebSite |

### Epic 8.4 : CI/CD

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-108** | Créer workflow GitHub Actions | FE-009 | 30min | `.github/workflows/ci.yml` lint+test+build |
| **FE-109** | Configurer Vercel project | FE-001 | 20min | Projet Vercel lié, deploy preview OK |
| **FE-110** | Configurer env vars Vercel | FE-076 | 15min | `PUBLIC_API_URL` en production |
| **FE-111** | Tester deploy production | FE-110 | 30min | Deploy main → production fonctionne |

### Epic 8.5 : Switch API Mock → Réelle

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **FE-112** | Configurer env var API production | FE-110 | 10min | `PUBLIC_API_URL=https://portfolio.dev/api` |
| **FE-113** | Tester formulaire contact production | FE-112 | 20min | Soumission formulaire envoie email réel |
| **FE-114** | Valider contrat OpenAPI réel | FE-113 | 30min | API réelle respecte contrat (Dredd/Postman) |

---

## Résumé des Phases

| Phase | Tâches | Durée Totale | Dépendances |
|-------|--------|--------------|-------------|
| **Phase 1** : Setup | 13 | ~3h | - |
| **Phase 2** : Design System | 18 | ~9h | Phase 1 |
| **Phase 3** : Routing & Pages | 24 | ~14h | Phase 2 |
| **Phase 4** : Content Collections | 12 | ~6h30 | Phase 3 |
| **Phase 5** : React Islands | 9 | ~6h30 | Phase 4 |
| **Phase 6** : API Mock | 10 | ~6h30 | Phase 5 |
| **Phase 7** : i18n (+ dates/nombres) | 14 | ~7h40 | Phase 6 |
| **Phase 8** : Optimisations | 17 | ~8h | Phase 7 |
| **TOTAL** | **117 tâches** | **~61h40** | Séquentielles |

**Note** : Ajout de 3 tâches (+1h40) pour :
- Internationalisation dates/nombres avec Intl API (3 tâches)

---

## Règles d'Exécution

### Stratégie Mock-First

```
1. Frontend consomme Mock Server (Prism) dès le départ
2. Développement Frontend indépendant du Backend
3. Switch vers API réelle en FE-112 (dernière phase)
4. Validation contrat OpenAPI avant switch
```

### Cycle TDD Composants

```
1. ✅ TEST : Écrire test composant (Vitest ou Playwright)
2. ✅ CODE : Implémenter composant minimal
3. 🔵 REFACTOR : Améliorer sans changer interface
4. ↩️ REPEAT : Prochain composant
```

### Points de Synchronisation

| Milestone | Tâches Bloquantes | Validation |
|-----------|-------------------|------------|
| **M1** : Setup OK | FE-001 à FE-013 | Mock server lance, Astro dev OK |
| **M2** : Design System OK | FE-014 à FE-031 | Storybook (optionnel) ou page test composants |
| **M3** : Pages Statiques OK | FE-032 à FE-053 | Toutes pages accessibles, contenu dummy |
| **M4** : Content OK | FE-054 à FE-065 | Content collections fonctionnent, 3 projets affichés |
| **M5** : Interactivité OK | FE-066 à FE-084 | Theme toggle + filtres + form fonctionnent (mock) |
| **M6** : i18n OK | FE-085 à FE-095 | FR/EN complet, hreflang OK |
| **M7** : Production Ready | FE-096 à FE-114 | Lighthouse >90, API réelle OK |

### Switch vers API Réelle

**Quand ?** : Après FE-111 (deploy production OK) ET Backend Phase 5 terminée (voir 04_ROADMAP_EDGE_FUNCTIONS.md, tâche EF-063)

**Checklist avant switch** :
- [ ] Backend Edge Functions déployées en production
- [ ] Health check `/api/health` retourne 200 OK
- [ ] Contrat OpenAPI validé (Dredd/Postman passe)
- [ ] Env var `PUBLIC_API_URL` configurée sur Vercel
- [ ] Tests e2e formulaire contact passent

---

**Document rédigé par** : GitHub Copilot (Technical PM & Scrum Master Mode)  
**Pour** : Esdras GBEDOZIN - Ingénieur Informatique  
**Date** : 17 janvier 2026  
**Statut** : ✅ **VALIDÉ - Roadmap Exécutable**
