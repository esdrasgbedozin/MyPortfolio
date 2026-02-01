# Guide de Déploiement Vercel

> **Guide Complet : Déployer le Portfolio Pro sur Vercel**  
> Epic : 5.3 - Documentation (EF-061)  
> Date : 1 février 2026  
> Version : 1.0

---

## 📋 Prérequis

### Comptes & Services

- ✅ Compte GitHub (repository du projet)
- ✅ Compte Vercel (gratuit ou Pro)
- ✅ Compte Resend (email - Plan gratuit 100 emails/jour)
- ✅ Compte Cloudflare (Turnstile CAPTCHA - gratuit)
- ✅ Compte Sentry (monitoring - Plan gratuit 5K events/mois)

### Clés API à Obtenir

| Service    | Variable d'Env         | Obtention                                     |
| ---------- | ---------------------- | --------------------------------------------- |
| Resend     | `RESEND_API_KEY`       | https://resend.com/api-keys                   |
| Cloudflare | `TURNSTILE_SECRET_KEY` | https://dash.cloudflare.com/turnstile         |
| Sentry     | `SENTRY_DSN`           | https://sentry.io/settings/projects/          |
| Vercel     | `VERCEL_TOKEN`         | https://vercel.com/account/tokens (optionnel) |

---

## 🚀 Déploiement Initial

### Étape 1 : Connecter le Repository

1. **Aller sur Vercel** : https://vercel.com/new
2. **Importer projet** :
   - Cliquer "Add New Project"
   - Autoriser accès au repository GitHub
   - Sélectionner `MyPortfolio` repository

3. **Configuration Framework** :
   - Framework Preset: **Astro**
   - Build Command: `pnpm build` (détecté automatiquement)
   - Output Directory: `dist` (détecté automatiquement)
   - Install Command: `pnpm install`

### Étape 2 : Configurer les Variables d'Environnement

#### Variables Requises (Production)

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@portfolio.dev
RESEND_TO_EMAIL=ogbedozin@gmail.com

# Anti-Spam (Cloudflare Turnstile)
TURNSTILE_SECRET_KEY=0x4AAAAAAxxxxxxxxxxxxxxxxx
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAxxxxxxxxxxxxxxxxx

# Monitoring (Sentry)
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxx (pour source maps)

# Email Provider (Optionnel - fallback)
EMAIL_PROVIDER=resend
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx (si fallback activé)

# Public API URL (Frontend)
PUBLIC_API_URL=https://portfolio.dev/api
```

#### Ajouter dans Vercel Dashboard

1. Aller dans **Project Settings** → **Environment Variables**
2. Pour chaque variable :
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxxxxxx`
   - Environment: Cocher **Production**, **Preview**, **Development**
   - Cliquer **Save**

3. **Variables Public** (préfixe `PUBLIC_`) :
   - Exposées au client (bundle JavaScript)
   - Utilisées pour Turnstile Site Key, API URL

### Étape 3 : Déployer

1. **Cliquer "Deploy"**
   - Vercel lance le build automatiquement
   - Durée: ~2-3 minutes

2. **Vérifier le build** :

   ```
   ✓ Downloading dependencies (pnpm install)
   ✓ Building project (pnpm build)
   ✓ Uploading static files
   ✓ Edge Functions deployed
   ✓ Domain configured
   ```

3. **Accéder au site** :
   - URL temporaire : `myportfolio-xxxx.vercel.app`
   - URL production : Configurer domaine custom (étape suivante)

---

## 🌐 Configuration Domaine Custom

### Acheter/Configurer Domaine

**Recommandations** :

- Namecheap: ~$10/an (.com)
- Google Domains: ~$12/an
- Vercel Domains: ~$20/an (intégration native)

### Ajouter Domaine dans Vercel

1. **Project Settings** → **Domains**
2. **Add Domain** : `portfolio.dev`
3. **Configurer DNS** :

   **Option A : Nameservers Vercel (Recommandé)**

   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B : Enregistrements CNAME/A**

   ```
   Type  Name              Value
   A     @                 76.76.21.21 (Vercel IP)
   CNAME www               cname.vercel-dns.com
   ```

4. **SSL Automatique** :
   - Vercel génère certificat Let's Encrypt automatiquement
   - Activation HTTPS forcé dans 5-10 minutes

### Redirection www → root (Optionnel)

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://www.portfolio.dev/:path*",
      "destination": "https://portfolio.dev/:path*",
      "permanent": true
    }
  ]
}
```

---

## ⚙️ Configuration Avancée

### 1. Vercel Edge Config (Rate Limiting)

**Setup** :

1. **Créer Edge Config** :

   ```bash
   vercel edge-config create portfolio-rate-limit
   ```

2. **Obtenir token** :

   ```bash
   vercel edge-config token create --edge-config-id ecfg_xxx
   ```

3. **Ajouter variable d'environnement** :

   ```bash
   EDGE_CONFIG=https://edge-config.vercel.com/ecfg_xxx?token=yyy
   ```

4. **Tester** :
   ```bash
   curl https://edge-config.vercel.com/ecfg_xxx/item/rate-limit-192.168.1.1?token=yyy
   ```

### 2. Optimisation Build

**Configuration `vercel.json`** :

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "astro",
  "regions": ["iad1", "cdg1"], // US-East + Paris (Edge deployment)
  "functions": {
    "api/**/*.ts": {
      "memory": 128, // MB (128 = minimum, économique)
      "maxDuration": 10 // secondes (contact form <10s)
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com;"
        }
      ]
    }
  ],
  "crons": [
    {
      "path": "/api/cleanup-rate-limit",
      "schedule": "0 * * * *" // Toutes les heures
    }
  ]
}
```

### 3. Monitoring & Alertes

**Intégration Sentry** :

1. **Installer SDK** (déjà fait) :

   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Configurer Source Maps** :

   ```bash
   # Ajouter dans Environment Variables
   SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxx
   ```

3. **Vercel Integration** :
   - Aller dans **Integrations** → **Sentry**
   - Connecter compte Sentry
   - Sélectionner projet `portfolio-pro`
   - Activer auto-upload source maps

**Alertes Email** :

1. **Vercel Alerts** :
   - Project Settings → Notifications
   - Activer "Deployment Failed" → Email
   - Activer "Edge Function Error Rate >5%" → Email

2. **Sentry Alerts** :
   - Alerts → New Alert Rule
   - Condition: "Error count >10 in 5 minutes"
   - Action: Send email to `ogbedozin@gmail.com`

---

## 🧪 Tester le Déploiement

### 1. Health Check

```bash
curl https://portfolio.dev/api/health
```

**Réponse attendue** :

```json
{
  "status": "healthy",
  "timestamp": "2026-02-01T12:34:56.789Z",
  "version": "1.0.0",
  "services": {
    "resend": { "status": "up" },
    "turnstile": { "status": "up" },
    "rateLimit": { "status": "up" }
  }
}
```

### 2. Formulaire Contact

1. **Aller sur** : `https://portfolio.dev/fr/contact`
2. **Remplir formulaire** :
   - Nom: Test Deployment
   - Email: test@example.com
   - Message: Testing production deployment
3. **Résoudre Turnstile CAPTCHA**
4. **Soumettre** → Doit afficher "Message envoyé !"

### 3. Rate Limiting

```bash
# Envoyer 11 requêtes rapidement
for i in {1..11}; do
  curl -X POST https://portfolio.dev/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test","turnstileToken":"mock"}' \
    -w "\nStatus: %{http_code}\n\n"
done
```

**Résultat attendu** :

- Requêtes 1-10 : `200 OK` ou `403 Forbidden` (Turnstile invalide)
- Requête 11 : `429 Too Many Requests`

### 4. Performance (Lighthouse CI)

```bash
pnpm dlx @lhci/cli@latest \
  --collect.url=https://portfolio.dev \
  --upload.target=temporary-public-storage
```

**Scores minimums** :

- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥95

---

## 🔄 Workflow de Développement

### Branches & Environments

```
main (production)
  ↓
  ├─ develop (staging)
  │   ↓
  │   └─ feature/xxx (preview)
  │
  └─ hotfix/xxx (emergency fix)
```

**Vercel Déploiements** :

| Branch      | Environment | URL                                              | Auto-Deploy |
| ----------- | ----------- | ------------------------------------------------ | ----------- |
| `main`      | Production  | `https://portfolio.dev`                          | ✅ Oui      |
| `develop`   | Preview     | `https://myportfolio-git-develop.vercel.app`     | ✅ Oui      |
| `feature/*` | Preview     | `https://myportfolio-git-feature-xxx.vercel.app` | ✅ Oui      |

### Pull Request Flow

1. **Créer feature branch** :

   ```bash
   git checkout -b feature/new-epic
   ```

2. **Push & PR** :

   ```bash
   git push origin feature/new-epic
   # Créer PR sur GitHub
   ```

3. **Vercel Preview** :
   - Commentaire automatique dans PR
   - Lien preview : `https://myportfolio-git-feature-new-epic.vercel.app`
   - Tester avant merge

4. **Merge vers develop** :

   ```bash
   gh pr merge --squash --delete-branch
   ```

5. **Merge develop → main (Production)** :
   ```bash
   git checkout main
   git merge develop --no-ff
   git push origin main
   # → Déploiement production automatique
   ```

---

## 🐛 Troubleshooting

### Build Failed

**Symptôme** : Build échoue avec erreur TypeScript

**Solution** :

```bash
# Local : Vérifier TypeScript
pnpm typecheck

# Corriger erreurs
pnpm build

# Commit & push
git add -A && git commit -m "fix: TypeScript errors"
git push
```

### API 500 Internal Server Error

**Symptôme** : `/api/contact` retourne 500

**Debugging** :

1. **Vérifier logs Vercel** :
   - Project → Deployments → Latest → View Function Logs
   - Chercher `[ERROR]` dans les logs

2. **Variables d'environnement manquantes** :
   - Vérifier `RESEND_API_KEY` présent
   - Vérifier `TURNSTILE_SECRET_KEY` présent
   - Vérifier `SENTRY_DSN` présent (optionnel)

3. **Tester en local** :
   ```bash
   cp .env.example .env
   # Remplir variables
   pnpm dev
   # Test : http://localhost:4321/api/health
   ```

### Rate Limiting Non Fonctionnel

**Symptôme** : Peut envoyer >10 requêtes sans blocage

**Causes possibles** :

1. Edge Config non configuré → Vérifier `EDGE_CONFIG` variable
2. IP détection échoue → Vérifier `x-forwarded-for` header
3. Cache Edge Config → Attendre 60s propagation

**Test manuel** :

```bash
# Vérifier Edge Config
curl https://edge-config.vercel.com/ecfg_xxx/items?token=yyy
```

### Email Non Reçu

**Symptôme** : Formulaire OK (200) mais email non reçu

**Checklist** :

1. **Vérifier logs Resend** :
   - https://resend.com/emails
   - Chercher email dans "Recent"
   - Status: "Delivered" ou "Bounced"

2. **Vérifier spam** :
   - Dossier spam de `RESEND_TO_EMAIL`

3. **Tester Resend API** :
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"from":"noreply@portfolio.dev","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
   ```

---

## 📊 Monitoring Production

### Dashboard Vercel

**Métriques clés** :

- Requests/min : Trafic API
- 95th percentile latency : Performance
- Error rate : Stabilité
- Edge Function invocations : Utilisation

**Accès** : Project → Analytics

### Dashboard Sentry

**Métriques clés** :

- Errors/min : Stabilité backend
- Crash-free rate : Fiabilité
- Top errors : Priorisation debug

**Accès** : https://sentry.io/organizations/portfolio/issues/

### Alertes à Configurer

| Type        | Condition                | Action                      |
| ----------- | ------------------------ | --------------------------- |
| Deployment  | Build failed             | Email immédiat              |
| Performance | FCP >2s sur 5 requêtes   | Email + Slack               |
| Erreurs     | >10 erreurs en 5min      | Email + Sentry notification |
| Uptime      | `/api/health` DOWN >5min | SMS + Email                 |
| Rate Limit  | >100 IPs bloquées/jour   | Email investigation         |

---

## 🔐 Sécurité Production

### Headers de Sécurité

Vérifier avec :

```bash
curl -I https://portfolio.dev/api/health
```

**Headers attendus** :

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Secrets Rotation (Tous les 6 mois)

1. **Resend API Key** :
   - Créer nouvelle clé : https://resend.com/api-keys
   - Mettre à jour `RESEND_API_KEY` dans Vercel
   - Tester `/api/contact`
   - Supprimer ancienne clé

2. **Turnstile Secret** :
   - Cloudflare Dashboard → Turnstile → Rotate Secret
   - Mettre à jour `TURNSTILE_SECRET_KEY`
   - Tester CAPTCHA

3. **Sentry DSN** :
   - Régénérer si compromis (rare)

---

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/vercel/)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Sentry Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Auteur** : Esdras GBEDOZIN - Ingénieur Informatique
**Date** : 1 février 2026  
**Epic** : 5.3 - Documentation (EF-061)  
**Statut** : ✅ Production-Ready
