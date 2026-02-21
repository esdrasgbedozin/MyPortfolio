# Configuration Monitoring & Alertes Production

> **Epic 6.2 - EF-062-063 : Monitoring Production**  
> Date : 1 février 2026

---

## 🎯 Objectif

Mettre en place un système d'alertes automatiques pour détecter les problèmes de production avant que les utilisateurs ne les signalent. Combinaison **Sentry** (erreurs) + **Vercel** (performance/uptime) + **GitHub Actions** (health checks).

---

## 📊 Architecture Monitoring

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION ENVIRONMENT                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Edge Function /api/contact.json                             │
│         │                                                     │
│         ├──► [Error 5xx] ──────► Sentry Capture             │
│         │                              │                     │
│         │                              ▼                     │
│         │                      Sentry Alert Rules            │
│         │                              │                     │
│         │                              ├─► Email (Critical)  │
│         │                              ├─► Slack (Warning)   │
│         │                              └─► PagerDuty (P0)    │
│         │                                                     │
│         └──► [200 OK] ─────────► Vercel Analytics            │
│                                          │                   │
│                                          ▼                   │
│                              Vercel Deployment Checks        │
│                                          │                   │
│                                          ├─► Email (Failed)  │
│                                          └─► Webhook         │
│                                                               │
│  Endpoint /api/health (Healthcheck)                          │
│         │                                                     │
│         └──► GitHub Actions Cron (every 15min)               │
│                      │                                        │
│                      ├─► Status 200 ✓                        │
│                      └─► Status 5xx ✗ ──► GitHub Issue       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ SENTRY ALERTES (Erreurs)

### 1.1 Configuration Projet Sentry

**Prérequis** : Compte Sentry (gratuit jusqu'à 5K events/mois)

1. **Créer Projet Sentry**

   ```
   https://sentry.io/organizations/<your-org>/projects/new/
   Platform: Astro
   Team: portfolio-pro
   ```

2. **Copier DSN**

   ```
   Exemple: https://abc123@o456789.ingest.sentry.io/1234567
   ```

3. **Configurer Variables d'Environnement**

   **Vercel** :

   ```bash
   # Dashboard → Portfolio → Settings → Environment Variables
   Variable name: SENTRY_DSN
   Value: https://abc123@o456789.ingest.sentry.io/1234567
   Environments: Production, Preview
   ```

   **Local** (.env.local) :

   ```bash
   SENTRY_DSN=https://abc123@o456789.ingest.sentry.io/1234567
   ```

### 1.2 Alert Rules (Configuration Sentry)

**Navigation** : Sentry Dashboard → Alerts → Create Alert Rule

#### Rule 1: Critical Errors (5xx)

```yaml
Alert Name: '[P0] Critical API Error'
Condition: When the issue is first seen
Filters:
  - Environment: production
  - Tag status_code: 500|502|503|504
  - Tag endpoint: /api/contact.json
Actions:
  - Send email to: ogbedozin@gmail.com
  - Send Slack notification: #alerts-production
  - Create PagerDuty incident: High Priority
Frequency: Immediately (no throttling)
```

**Pourquoi** : Les erreurs 5xx indiquent un problème serveur critique qui empêche le formulaire de fonctionner.

#### Rule 2: High Error Rate

```yaml
Alert Name: '[P1] High API Error Rate'
Condition: When the issue is seen more than 10 times in 1 hour
Filters:
  - Environment: production
  - Tag endpoint: /api/contact.json
Actions:
  - Send email to: ogbedozin@gmail.com
  - Send Slack notification: #monitoring
Frequency: Max 1 alert per hour
```

**Pourquoi** : Un pic d'erreurs peut indiquer une attaque DDoS, un bug intermittent, ou un problème de dépendance (API email externe).

#### Rule 3: Rate Limiting Violations

```yaml
Alert Name: '[INFO] Rate Limit Abuse Detected'
Condition: When the issue is seen more than 20 times in 1 hour
Filters:
  - Environment: production
  - Tag error_type: RateLimitError
  - Tag status_code: 429
Actions:
  - Send email to: ogbedozin@gmail.com
  - Log to security audit trail
Frequency: Max 1 alert per 3 hours
```

**Pourquoi** : Détecter les tentatives de spam/brute-force pour ajuster les règles ou bloquer des IP.

#### Rule 4: New Error Types

```yaml
Alert Name: '[WARN] New Error Type in Production'
Condition: When a new issue is created
Filters:
  - Environment: production
  - Is unhandled: true
Actions:
  - Send email to: ogbedozin@gmail.com
  - Create GitHub issue automatically
Frequency: Daily digest (aggregated)
```

**Pourquoi** : Détecter les edge cases non prévus qui passent en production malgré les tests.

### 1.3 Sentry Performance Alerts

**Navigation** : Sentry → Performance → Alerts

```yaml
Alert Name: '[WARN] API Latency Spike'
Condition: When p95 transaction duration > 3000ms over 10 minutes
Filters:
  - Transaction: POST /api/contact.json
  - Environment: production
Actions:
  - Send Slack notification: #performance
Frequency: Max 1 alert per 30 minutes
```

**Pourquoi** : Une latence élevée peut indiquer un problème avec l'API email externe (Brevo/SendGrid timeout) ou un cold start Vercel.

---

## 2️⃣ VERCEL ALERTES (Deployment & Uptime)

### 2.1 Deployment Notifications

**Configuration** : Vercel Dashboard → Settings → Notifications

#### Build Failures

```yaml
Notification: Build Failed
Trigger: When deployment build fails
Delivery:
  - Email: ogbedozin@gmail.com
  - Webhook: https://hooks.slack.com/services/T00/B00/XXX (Slack incoming webhook)
  - GitHub Check: Failed (visible in PR)
```

**Exemple d'email** :

```
Subject: ❌ Build Failed: portfolio-pro (feature/new-ui)

Deployment ID: dpl_abc123
Branch: feature/new-ui
Commit: a1b2c3d "feat: add new component"
Error: TypeScript compilation error in src/components/Hero.tsx:42
Duration: 1m 23s

View logs: https://vercel.com/portfolio/deployments/dpl_abc123
```

#### Deployment Success (Optionnel)

```yaml
Notification: Deployment Succeeded
Trigger: When deployment reaches "Ready" state
Filters:
  - Environment: Production only
Delivery:
  - Slack: #deployments
  - GitHub Comment: '✅ Deployed to https://esdrasgbedozin.dev'
```

### 2.2 Vercel Checks (Health Monitoring)

**Prérequis** : Vercel Pro Plan ($20/mois, inclut Uptime Monitoring)

**Configuration** : Dashboard → Monitoring → Checks

```yaml
Check Name: API Health Endpoint
URL: https://esdrasgbedozin.dev/api/health
Method: GET
Expected Status: 200
Expected Body Contains: "status":"healthy"
Interval: Every 5 minutes
Regions: All (Washington DC, Frankfurt, Singapore)
Timeout: 10s
Retry: 3 times before alert
Notification:
  - Email: ogbedozin@gmail.com (after 2 consecutive failures)
  - PagerDuty: Create incident (after 3 consecutive failures)
```

**Alternative Gratuite** : GitHub Actions (voir section 3)

### 2.3 Vercel Analytics Alerts

**Configuration** : Dashboard → Analytics → Insights

```yaml
Alert: High 5xx Error Rate
Condition: When 5xx responses > 5% of total requests over 1 hour
Notification: Email
```

```yaml
Alert: Performance Degradation
Condition: When p75 TTFB > 1000ms over 30 minutes
Notification: Email + Slack
```

---

## 3️⃣ GITHUB ACTIONS HEALTH CHECKS (Gratuit)

**Alternative gratuite** aux Vercel Checks pour health monitoring.

### 3.1 Workflow Cron Job

**Fichier** : `.github/workflows/health-check.yml`

```yaml
name: Production Health Check

on:
  # Exécuter toutes les 15 minutes
  schedule:
    - cron: '*/15 * * * *'

  # Permettre exécution manuelle
  workflow_dispatch:

jobs:
  health-check:
    name: Check /api/health Endpoint
    runs-on: ubuntu-latest

    steps:
      - name: Check API Health
        id: health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://esdrasgbedozin.dev/api/health)

          if [ "$response" -ne 200 ]; then
            echo "❌ Health check FAILED: HTTP $response"
            echo "status=failed" >> $GITHUB_OUTPUT
            exit 1
          else
            echo "✅ Health check PASSED: HTTP $response"
            echo "status=success" >> $GITHUB_OUTPUT
          fi

      - name: Create GitHub Issue on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const issue = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Production Health Check Failed',
              body: `## Health Check Failure
              
              **Time**: ${new Date().toISOString()}
              **Endpoint**: https://esdrasgbedozin.dev/api/health
              **Status**: Failed to return HTTP 200
              
              ### Possible Causes
              - Edge Function crash
              - Vercel deployment issue
              - Network connectivity problem
              - Rate limiting (DDoS)
              
              ### Action Required
              1. Check Vercel deployment logs: https://vercel.com/portfolio/deployments
              2. Check Sentry errors: https://sentry.io/organizations/portfolio/issues/
              3. Verify API dependencies (Brevo/SendGrid status)
              
              cc @yourteam`,
              labels: ['bug', 'production', 'p0-critical']
            });

            console.log(`Created issue: ${issue.data.html_url}`);

      - name: Send Slack Notification on Failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "🚨 Production Health Check Failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*🚨 Production Health Check Failed*\n\n*Endpoint*: https://esdrasgbedozin.dev/api/health\n*Time*: ${{ github.event.repository.updated_at }}\n\n<https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Workflow Run>"
                  }
                }
              ]
            }
```

### 3.2 Multi-Region Health Check

**Avancé** : Tester depuis plusieurs régions géographiques (simuler utilisateurs mondiaux).

```yaml
strategy:
  matrix:
    region:
      - name: US East
        proxy: https://us-proxy.example.com
      - name: EU West
        proxy: https://eu-proxy.example.com
      - name: Asia Pacific
        proxy: https://ap-proxy.example.com

steps:
  - name: Health Check (${{ matrix.region.name }})
    run: |
      curl -x ${{ matrix.region.proxy }} -f https://esdrasgbedozin.dev/api/health || exit 1
```

---

## 4️⃣ DASHBOARD CONSOLIDÉ

### 4.1 Sentry Dashboard

**URL** : `https://sentry.io/organizations/<your-org>/dashboard/custom/`

**Widgets à ajouter** :

1. **Issues Overview (Last 24h)**
   - Type: Line chart
   - Metric: Count of issues
   - Group by: Environment (production/preview)

2. **Error Rate by Endpoint**
   - Type: Bar chart
   - Metric: Failure rate
   - Filter: Tag endpoint
   - Display: Top 5 endpoints

3. **Performance: API Latency**
   - Type: Line chart
   - Metric: p95(transaction.duration)
   - Filter: Transaction = POST /api/contact.json

4. **Most Common Errors**
   - Type: Table
   - Columns: Error type, Count, First seen, Last seen
   - Sort by: Count (descending)

5. **Geographic Distribution (Errors)**
   - Type: World map
   - Metric: Count of errors by country
   - Purpose: Détecter attaques ciblées

### 4.2 Vercel Dashboard

**URL** : `https://vercel.com/<team>/portfolio/analytics`

**Sections importantes** :

1. **Analytics → Performance**
   - TTFB (Time to First Byte)
   - FCP (First Contentful Paint)
   - LCP (Largest Contentful Paint)
   - Filter by: Top pages with issues

2. **Analytics → Audience**
   - Geographic distribution (vérifier edge caching)
   - Device breakdown (mobile vs desktop perf)
   - Browser compatibility issues

3. **Deployments → Logs**
   - Real-time logs (JSON structured)
   - Filter by: ERROR level
   - Search: "requestId" for debugging specific requests

4. **Speed Insights**
   - Core Web Vitals trends
   - Real user monitoring (RUM)
   - Lighthouse scores over time

### 4.3 Grafana (Optionnel - Avancé)

**Pour agrégation multi-sources** (Sentry + Vercel + Custom metrics).

**Setup** :

1. **Installer Grafana Cloud** (gratuit jusqu'à 10K séries métriques)

   ```
   https://grafana.com/products/cloud/
   ```

2. **Configurer Data Sources**
   - Sentry Plugin : `grafana-sentry-datasource`
   - Prometheus : Exporter métriques custom depuis Edge Functions
   - Loki : Logs structurés JSON

3. **Dashboard Example** :

   **Panel 1: API Success Rate (SLI)**

   ```promql
   # Percentage of successful API calls
   sum(rate(http_requests_total{status=~"2.."}[5m]))
   /
   sum(rate(http_requests_total[5m])) * 100
   ```

   **Panel 2: Error Budget Burn Rate**

   ```promql
   # SLO: 99.9% success rate (0.1% error budget)
   (1 - (sum(rate(http_requests_total{status=~"2.."}[1h])) / sum(rate(http_requests_total[1h])))) > 0.001
   ```

   **Panel 3: Latency Heatmap**
   - Type: Heatmap
   - Data: Sentry transaction durations
   - Buckets: 0-500ms, 500-1000ms, 1000-2000ms, 2000ms+

---

## 5️⃣ RUNBOOK (Procédures d'Intervention)

### Alert : [P0] Critical API Error

**Symptômes** :

- Sentry alerte : Erreur 500 sur `/api/contact.json`
- Formulaire de contact retourne erreur interne

**Actions immédiates** (SLA : 5 minutes) :

1. **Vérifier Vercel Deployment**

   ```bash
   # Check latest deployment
   vercel ls --prod

   # View logs
   vercel logs portfolio-pro --prod --follow
   ```

2. **Check Sentry Stack Trace**
   - Aller sur lien dans email alerte
   - Identifier ligne exacte du crash
   - Vérifier breadcrumbs (requête malformée ?)

3. **Rollback si nécessaire**

   ```bash
   # Rollback to previous deployment
   vercel rollback <deployment-id>
   ```

4. **Vérifier dépendances externes**
   - [Brevo Status](https://status.brevo.com/)
   - [Vercel Status](https://www.vercel-status.com/)
   - [Cloudflare Status](https://www.cloudflarestatus.com/) (Turnstile)

### Alert : [P1] High API Error Rate

**Symptômes** :

- > 10 erreurs en 1 heure sur `/api/contact.json`
- Peut être 429 (rate limit) ou 400 (validation)

**Actions** :

1. **Analyser patterns dans Sentry**
   - Filtrer par `requestId` : Même utilisateur qui spam ?
   - Filtrer par `clientIp` : Attaque depuis IP unique ?
   - Tag `error_type` : Quel type d'erreur domine ?

2. **Si Rate Limiting**

   ```bash
   # Check Redis rate limit keys (si Vercel KV)
   # Voir console Vercel KV dashboard
   # Pattern: rate_limit:tier_1:<IP>
   ```

3. **Si Validation Errors**
   - Vérifier récents changements dans `contactSchema.ts`
   - Tester formulaire manuellement sur production
   - Comparer schéma backend vs frontend

### Alert : Health Check Failed

**Symptômes** :

- GitHub Actions cron job failed
- `/api/health` retourne 5xx ou timeout

**Actions** :

1. **Test manuel**

   ```bash
   curl -v https://esdrasgbedozin.dev/api/health
   ```

2. **Check Vercel Function Logs**

   ```bash
   vercel logs --prod --since 1h
   ```

3. **Vérifier Vercel Quotas**
   - Dashboard → Usage
   - Function invocations limit atteint ?
   - Bandwidth limit dépassé ?

---

## 6️⃣ MÉTRIQUES SLO/SLI

### Service Level Objectives (SLO)

| Métrique             | Target | Measurement Window | Alert Threshold  |
| -------------------- | ------ | ------------------ | ---------------- |
| **Availability**     | 99.9%  | 30 jours           | <99.5% (7 jours) |
| **API Success Rate** | 99.5%  | 24 heures          | <99% (1 heure)   |
| **p95 Latency**      | <2s    | 1 heure            | >3s (sustained)  |
| **Error Budget**     | 0.5%   | 30 jours           | 50% consumed     |

### Service Level Indicators (SLI)

**Availability** :

```
SLI = (Successful Health Checks) / (Total Health Checks) * 100
Target: ≥99.9% (max 43 minutes downtime/month)
```

**API Success Rate** :

```
SLI = (HTTP 2xx responses) / (Total HTTP requests) * 100
Target: ≥99.5% (max 360 errors/month for 72K requests)
```

**Error Budget** :

```
Budget = (1 - SLO) * Total Requests
Example: (1 - 0.999) * 100,000 req/month = 100 erreurs autorisées
```

---

## 7️⃣ CHECKLIST DE MISE EN PRODUCTION

### Avant Déploiement

- [ ] **Sentry configuré**
  - [ ] DSN ajouté à Vercel env vars
  - [ ] 4 alert rules créées (Critical/High Rate/Rate Limit/New Errors)
  - [ ] Email notifications testées
  - [ ] Slack webhook configuré (optionnel)

- [ ] **Vercel Notifications**
  - [ ] Build failure emails activés
  - [ ] Deployment success notifications (production only)
  - [ ] Webhook Slack configuré (optionnel)

- [ ] **GitHub Actions Health Check**
  - [ ] Workflow `.github/workflows/health-check.yml` créé
  - [ ] Cron schedule: `*/15 * * * *` (every 15min)
  - [ ] Secret `SLACK_WEBHOOK_URL` ajouté (optionnel)
  - [ ] Test exécution manuelle : `gh workflow run health-check.yml`

- [ ] **Dashboards**
  - [ ] Sentry dashboard custom créé avec 5 widgets
  - [ ] Vercel Analytics → Performance vérifiée
  - [ ] Vercel Speed Insights activé

### Après Déploiement (Validation)

- [ ] **Déclencher alerte test**

  ```bash
  # Forcer erreur 500
  curl -X POST https://esdrasgbedozin.dev/api/contact.json \
    -H "Content-Type: application/json" \
    -d '{"trigger_error": true}'

  # Vérifier que Sentry capture l'erreur
  # Vérifier que email d'alerte est reçu
  ```

- [ ] **Vérifier Health Check**

  ```bash
  # Doit retourner HTTP 200 + JSON
  curl https://esdrasgbedozin.dev/api/health

  # Expected output:
  # {"status":"healthy","timestamp":"2026-02-01T12:00:00.000Z"}
  ```

- [ ] **Monitoring actif pendant 24h**
  - [ ] Check Sentry à T+1h, T+6h, T+24h
  - [ ] Vérifier aucune alerte intempestive
  - [ ] Valider métriques Vercel Analytics cohérentes

---

## 8️⃣ RESSOURCES & CONTACTS

### Documentation

- [Sentry Alerts Guide](https://docs.sentry.io/product/alerts/)
- [Vercel Monitoring](https://vercel.com/docs/concepts/observability/monitoring)
- [GitHub Actions Cron Syntax](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

### Outils Recommandés

- **Uptime Monitoring** : [UptimeRobot](https://uptimerobot.com/) (gratuit, 50 monitors)
- **Status Page** : [Statuspage.io](https://www.statuspage.io/) (communiquer incidents aux utilisateurs)
- **Incident Management** : [PagerDuty](https://www.pagerduty.com/) (alertes on-call rotation)

### Contacts

- **Email Équipe** : ogbedozin@gmail.com
- **Slack Channel** : `#alerts-production`
- **On-Call Rotation** : [PagerDuty Schedule](https://portfolio.pagerduty.com/schedules)

---

**Auteur** : Esdras GBEDOZIN - Ingénieur Informatique  
**Epic** : 6.2 - Monitoring Production (EF-062-063)  
**Date** : 1 février 2026  
**Status** : ✅ Configuration Complète
