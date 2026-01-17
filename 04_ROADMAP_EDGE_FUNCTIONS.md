# 04_ROADMAP_EDGE_FUNCTIONS.md

> **Roadmap de Développement : Edge Functions & Services Serverless**  
> Projet : Portfolio Professionnel d'Ingénieur Informatique  
> Date : 17 janvier 2026  
> Version : 1.0  
> Statut : ✅ **VALIDÉ**

---

## Contexte

**Architecture** : Jamstack (Astro SSG) + Edge Functions (Vercel Serverless)

**Scope Edge Functions** :
- API de contact (formulaire)
- Services de validation (Zod, Turnstile)
- Services d'envoi d'emails (Resend/SendGrid)
- Health check endpoint

**Pas de Backend traditionnel** : Pas de serveur Node.js always-on, pas de base de données relationnelle.

**Stratégie TDD** : Test d'abord, puis implémentation minimale.

---

## Ordre d'Exécution Impératif

### Phase 1 : Setup & Infrastructure
### Phase 2 : Services de Base
### Phase 3 : API Contact (TDD)
### Phase 4 : Intégration & Déploiement

---

## PHASE 1 : SETUP & INFRASTRUCTURE

### Epic 1.1 : Initialisation du Projet

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-001** | Initialiser le projet Astro + Vercel adapter | - | 15min | `pnpm create astro@latest` exécuté, adapter Vercel installé |
| **EF-002** | Configurer TypeScript strict mode | EF-001 | 10min | `tsconfig.json` avec `strict: true`, compilation sans erreur |
| **EF-003** | Installer dépendances edge functions | EF-001 | 10min | `zod`, `resend`, `@sendgrid/mail` installés dans package.json |
| **EF-004** | Créer structure dossiers API | EF-001 | 10min | Arborescence `src/pages/api/` créée |

### Epic 1.2 : Configuration Linting & Formatage

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-005** | Installer ESLint + TypeScript ESLint | EF-001 | 15min | `.eslintrc.js` configuré, `pnpm lint` passe |
| **EF-006** | Installer Prettier | EF-001 | 10min | `.prettierrc` configuré, `pnpm format` passe |
| **EF-007** | Configurer Husky + lint-staged | EF-005, EF-006 | 15min | Pre-commit hook lint+format, test commit OK |

### Epic 1.3 : CI/CD Setup

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-008** | Créer workflow GitHub Actions | EF-001 | 20min | `.github/workflows/ci.yml` créé (lint, typecheck, test) |
| **EF-009** | Configurer Vercel project | EF-001 | 15min | Projet Vercel lié au repo, deploy preview OK |

---

## PHASE 2 : SERVICES DE BASE (TDD)

### Epic 2.1 : Service de Validation

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-010** | ✅ TEST : Créer test schema validation contact | EF-003 | 30min | Test Vitest pour validation Zod contact form (RED) |
| **EF-011** | ✅ CODE : Implémenter schema Zod contact | EF-010 | 20min | Schema Zod avec name, email, message validés (GREEN) |
| **EF-012** | 🔵 REFACTOR : Extraire types TypeScript | EF-011 | 15min | Types `ContactFormData` exportés, schema refactoré |
| **EF-013** | ✅ TEST : Validation edge cases | EF-012 | 30min | Tests email invalide, message trop long, etc. (RED) |
| **EF-014** | ✅ CODE : Gérer edge cases validation | EF-013 | 20min | Tous les tests de validation passent (GREEN) |

### Epic 2.2 : Service Anti-Spam (Turnstile)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-015** | ✅ TEST : Créer test vérification Turnstile | EF-003 | 30min | Test mock API Turnstile (RED) |
| **EF-016** | ✅ CODE : Implémenter service Turnstile | EF-015 | 40min | Fonction `verifyTurnstile(token)` avec fetch API Cloudflare (GREEN) |
| **EF-017** | 🔵 REFACTOR : Extraire interface service | EF-016 | 20min | Interface `AntiSpamService`, classe `TurnstileService` |
| **EF-018** | ✅ TEST : Mock Turnstile pour tests | EF-017 | 30min | Mock service Turnstile pour CI (GREEN) |

### Epic 2.3 : Service Email (Factory Pattern)

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-019** | ✅ TEST : Définir interface EmailService | EF-003 | 20min | Interface `EmailService` avec méthode `send()` |
| **EF-020** | ✅ TEST : Créer test envoi email Resend | EF-019 | 30min | Test mock Resend API (RED) |
| **EF-021** | ✅ CODE : Implémenter ResendEmailService | EF-020 | 40min | Classe `ResendEmailService` implements `EmailService` (GREEN) |
| **EF-022** | ✅ TEST : Créer test envoi email SendGrid | EF-019 | 30min | Test mock SendGrid API (RED) |
| **EF-023** | ✅ CODE : Implémenter SendGridEmailService | EF-022 | 40min | Classe `SendGridEmailService` implements `EmailService` (GREEN) |
| **EF-024** | ✅ TEST : Créer test factory pattern | EF-021, EF-023 | 30min | Test `createEmailService()` retourne bon service (RED) |
| **EF-025** | ✅ CODE : Implémenter factory email | EF-024 | 30min | Factory retourne Resend ou SendGrid selon env var (GREEN) |
| **EF-026** | 🔵 REFACTOR : Stratégie fallback | EF-025 | 40min | Si Resend fail, retry avec SendGrid (tests passent) |

### Epic 2.4 : Service Rate Limiting

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-027** | ✅ TEST : Créer test rate limiting IP | - | 40min | Test max 5 req/heure par IP (RED) |
| **EF-028** | ✅ CODE : Implémenter rate limiter | EF-027 | 60min | Vercel Edge Config KV store, fonction `isRateLimited(ip)` (GREEN) |
| **EF-029** | 🔵 REFACTOR : Cleanup rate limit store | EF-028 | 30min | Auto-cleanup après 1h, tests passent |

---

## PHASE 3 : API CONTACT (TDD STRICT)

### Epic 3.1 : Endpoint Contact - Cas Nominal

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-030** | ✅ TEST : Test endpoint /api/contact (200 OK) | EF-011, EF-016, EF-025 | 40min | Test intégration POST /api/contact avec mock services (RED) |
| **EF-031** | ✅ CODE : Créer handler /api/contact.ts | EF-030 | 60min | Handler avec validation + email + response 200 (GREEN) |
| **EF-032** | 🔵 REFACTOR : Extraire logique métier | EF-031 | 30min | Service `ContactService` séparé du handler, tests passent |

### Epic 3.2 : Endpoint Contact - Cas d'Erreur

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-033** | ✅ TEST : Test validation échouée (400) | EF-031 | 30min | Test avec email invalide → 400 + RFC 7807 (RED) |
| **EF-034** | ✅ CODE : Gérer erreur validation | EF-033 | 30min | Handler retourne ProblemDetails 400 (GREEN) |
| **EF-035** | ✅ TEST : Test Turnstile invalide (403) | EF-031 | 30min | Test avec token Turnstile invalide → 403 (RED) |
| **EF-036** | ✅ CODE : Gérer erreur Turnstile | EF-035 | 30min | Handler retourne ProblemDetails 403 (GREEN) |
| **EF-037** | ✅ TEST : Test rate limit dépassé (429) | EF-031, EF-028 | 30min | Test avec >5 req/heure → 429 + Retry-After (RED) |
| **EF-038** | ✅ CODE : Gérer rate limit | EF-037 | 30min | Handler vérifie rate limit, retourne 429 (GREEN) |
| **EF-039** | ✅ TEST : Test erreur envoi email (500) | EF-031 | 30min | Test avec email service en échec → 500 (RED) |
| **EF-040** | ✅ CODE : Gérer erreur interne | EF-039 | 30min | Handler catch exceptions, retourne 500 (GREEN) |

### Epic 3.3 : Logs & Monitoring

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-041** | ✅ TEST : Créer test logger JSON | - | 30min | Test logger structure JSON (RED) |
| **EF-042** | ✅ CODE : Implémenter logger | EF-041 | 40min | Classe `Logger` avec info/warn/error (GREEN) |
| **EF-043** | 🔵 REFACTOR : Intégrer logger dans handler | EF-042, EF-031 | 30min | Logs sur chaque requête /api/contact, tests passent |
| **EF-044** | ✅ TEST : Test corrélation requestId | EF-043 | 30min | Test requestId propagé dans tous les logs (RED) |
| **EF-045** | ✅ CODE : Ajouter requestId | EF-044 | 30min | Générer UUID requestId, passer dans context (GREEN) |

---

## PHASE 4 : HEALTH CHECK & FINITIONS

### Epic 4.1 : Endpoint Health

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-046** | ✅ TEST : Test endpoint /api/health (200) | - | 30min | Test GET /api/health retourne status healthy (RED) |
| **EF-047** | ✅ CODE : Créer handler /api/health.ts | EF-046 | 40min | Handler retourne timestamp + status (GREEN) |
| **EF-048** | ✅ TEST : Test checks dépendances | EF-047 | 40min | Test vérification Resend + Turnstile UP/DOWN (RED) |
| **EF-049** | ✅ CODE : Implémenter checks | EF-048 | 50min | Handler ping services, retourne détails (GREEN) |

### Epic 4.2 : Variables d'Environnement

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-050** | Créer fichier .env.example | EF-001 | 10min | Template avec toutes les vars nécessaires |
| **EF-051** | Documenter variables Vercel | EF-050 | 15min | README avec instructions config Vercel env vars |
| **EF-052** | ✅ TEST : Test env vars manquantes | - | 30min | Test throw error si RESEND_API_KEY absent (RED) |
| **EF-053** | ✅ CODE : Valider env vars au startup | EF-052 | 30min | Fonction `validateEnv()` avec Zod (GREEN) |

### Epic 4.3 : Sécurité Headers

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-054** | Configurer headers sécurité Vercel | EF-009 | 20min | `vercel.json` avec CSP, X-Frame-Options, etc. |
| **EF-055** | ✅ TEST : Test headers présents | EF-054 | 30min | Test e2e vérifie headers sur réponse (RED → GREEN) |

---

## PHASE 5 : INTÉGRATION & DÉPLOIEMENT

### Epic 5.1 : Tests d'Intégration

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-056** | Créer tests e2e avec Playwright | EF-031 | 60min | Suite Playwright teste workflow complet contact |
| **EF-057** | Tester contrat OpenAPI | EF-031 | 40min | Validation avec Dredd ou Postman, contrat respecté |
| **EF-058** | Tester rate limiting e2e | EF-028, EF-056 | 40min | Test e2e envoie 6 requêtes, 6ème = 429 |

### Epic 5.2 : Documentation

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-059** | Générer documentation API | EF-057 | 30min | Swagger UI déployé sur /api-docs (via openapi.yaml) |
| **EF-060** | Documenter architecture services | EF-026 | 40min | README.md section Architecture avec diagrammes |
| **EF-061** | Créer guide déploiement Vercel | EF-009 | 30min | Guide step-by-step deploy + config env vars |

### Epic 5.3 : Monitoring Production

| ID | Titre | Dépendance | Durée | Critère de Fin |
|----|-------|-----------|-------|----------------|
| **EF-062** | Configurer alertes Vercel | EF-009 | 20min | Alertes email si /api/health DOWN ou erreur rate élevé |
| **EF-063** | Créer dashboard logs | EF-043 | 40min | Dashboard Vercel logs filtrés par niveau ERROR |

---

## Résumé des Phases

| Phase | Tâches | Durée Totale | Dépendances |
|-------|--------|--------------|-------------|
| **Phase 1** : Setup | 9 | ~2h30 | - |
| **Phase 2** : Services | 21 | ~10h30 | Phase 1 |
| **Phase 3** : API Contact | 16 | ~8h | Phase 2 |
| **Phase 4** : Health & Finitions | 10 | ~5h | Phase 3 |
| **Phase 5** : Intégration | 8 | ~5h | Phase 4 |
| **TOTAL** | **64 tâches** | **~31h** | Séquentielles |

---

## Règles d'Exécution

### Légende Granularité

- ✅ **TEST** : Écrire le test d'abord (RED)
- ✅ **CODE** : Implémenter le code minimal (GREEN)
- 🔵 **REFACTOR** : Améliorer sans changer comportement (tests restent verts)

### Durée par Tâche

- **Setup/Config** : 10-20 minutes
- **Test unitaire** : 20-40 minutes
- **Implémentation** : 30-60 minutes
- **Refactoring** : 15-40 minutes
- **Documentation** : 30-40 minutes

**Règle d'or** : Aucune tâche >2h. Si besoin, découper.

### Cycle TDD Obligatoire

```
1. ✅ TEST (RED) : Écrire test qui échoue
2. ✅ CODE (GREEN) : Code minimal pour passer
3. 🔵 REFACTOR : Améliorer qualité
4. ↩️ REPEAT : Prochaine feature
```

### Points de Synchronisation

| Milestone | Tâches Bloquantes | Validation |
|-----------|-------------------|------------|
| **M1** : Setup OK | EF-001 à EF-009 | CI passe, deploy preview OK |
| **M2** : Services OK | EF-010 à EF-029 | Tous les tests unitaires passent (≥80% couverture) |
| **M3** : API Contact OK | EF-030 à EF-045 | Tests e2e passent, contrat OpenAPI respecté |
| **M4** : Production Ready | EF-046 à EF-063 | Health check UP, monitoring actif, doc complète |

---

**Document rédigé par** : GitHub Copilot (Technical PM & Scrum Master Mode)  
**Pour** : Esdras GBEDOZIN - Ingénieur Informatique  
**Date** : 17 janvier 2026  
**Statut** : ✅ **VALIDÉ - Roadmap Exécutable**
