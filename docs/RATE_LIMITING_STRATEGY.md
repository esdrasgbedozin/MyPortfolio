# Stratégie de Rate Limiting Progressive

> **Système de Protection Anti-Spam à 3 Tiers**  
> Projet : Portfolio Professionnel  
> Version : 2.0 (Mise à jour Epic 2.4)  
> Date : 1 février 2026

---

## Vue d'Ensemble

Système de rate limiting **progressif et intelligent** qui adapte les restrictions en fonction du comportement utilisateur, avec intégration du score Cloudflare Turnstile pour whitelist automatique.

---

## Architecture du Système

### Tier 1 : Utilisateur Standard (IP Propre)

**Quota** : **10 requêtes/heure**

**Conditions d'application** :

- Première visite de l'IP
- Aucune violation précédente
- Score Turnstile < 0.7 (utilisateurs normaux)

**Comportement** :

```typescript
// Requête 1-10 : 200 OK
{ limited: false, remainingRequests: 10-n, tier: 1 }

// Requête 11+ : 429 Too Many Requests
{
  limited: true,
  tier: 1,
  retryAfter: 3600, // secondes
  escalation: 'tier2' // Prochaine étape
}
```

**Cas d'usage** :

- Utilisateurs légitimes qui font plusieurs tests du formulaire
- Développeurs qui testent l'intégration
- Utilisateurs qui corrigent leur email après échec

---

### Tier 2 : Utilisateur Suspect (Pénalité 24h)

**Quota** : **3 requêtes/heure** pendant **24 heures**

**Conditions de déclenchement** :

- L'IP a dépassé Tier 1 (>10 req/heure) au moins 1 fois
- Premier blocage enregistré
- Pas encore en Tier 3

**Comportement** :

```typescript
// Requête 1-3 : 200 OK (avec avertissement)
{
  limited: false,
  remainingRequests: 3-n,
  tier: 2,
  warning: 'Vous êtes en période de surveillance (24h)',
  violationCount: 1
}

// Requête 4+ : 429 Too Many Requests
{
  limited: true,
  tier: 2,
  retryAfter: 3600,
  escalation: 'tier3_warning', // Avertissement sérieux
  message: '2 violations restantes avant blocage permanent'
}
```

**Durée de la pénalité** :

- 24 heures à partir du premier blocage
- Reset automatique si pas de nouvelle violation

**Cas d'usage** :

- Utilisateur qui a fait trop de tests légitimes
- Bot mal configuré (pas encore identifié comme malveillant)
- Réseau d'entreprise avec plusieurs utilisateurs partageant l'IP

---

### Tier 3 : Blocage Permanent (Intervention Requise)

**Quota** : **0 requête** (blocage total)

**Conditions de déclenchement** :

- L'IP a dépassé Tier 2 au moins **3 fois**
- Pattern de spam/DoS détecté

**Comportement** :

```typescript
// Toutes les requêtes : 403 Forbidden
{
  limited: true,
  tier: 3,
  blocked: true,
  message: 'IP bloquée pour activité suspecte. Contactez support@portfolio.dev',
  unlockRequired: true,
  violationHistory: [
    { date: '2026-02-01T10:00:00Z', tier: 1 },
    { date: '2026-02-01T11:30:00Z', tier: 2 },
    { date: '2026-02-01T13:00:00Z', tier: 2 }
  ]
}
```

**Processus de déblocage** :

1. Utilisateur contacte `support@portfolio.dev`
2. Admin vérifie logs Sentry + Vercel Analytics
3. Décision manuelle : déblocage ou maintien du ban
4. Si déblocage → Reset à Tier 1 avec surveillance

**Cas d'usage** :

- Bots malveillants confirmés
- Attaques DoS
- Spam automatisé répété
- Utilisateur légitime bloqué par erreur (déblocage manuel)

---

## Whitelist Automatique (Bypass Intelligent)

### Intégration Score Turnstile

**Critère de bypass** : Score Cloudflare Turnstile **>= 0.7**

**Comportement** :

```typescript
// Si score Turnstile >= 0.7 → Bypass rate limiting
{
  whitelisted: true,
  reason: 'turnstile_score_high',
  score: 0.85,
  bypassed: ['tier1', 'tier2', 'tier3']
}
```

**Logique d'application** :

1. Avant de vérifier rate limit, on vérifie le score Turnstile
2. Si `score >= 0.7` → Autoriser la requête (pas de compteur incrémenté)
3. Si `score < 0.7` → Appliquer rate limiting normal

**Avantages** :

- ✅ Utilisateurs humains vérifiés ne sont jamais bloqués
- ✅ Réduit les faux positifs (bureaux d'entreprise, VPN)
- ✅ Cloudflare ML identifie patterns humains vs bots

**Cas d'usage** :

- Utilisateur sur IP partagée (entreprise) mais identifié comme humain
- VPN/Proxy légitime avec bon score Turnstile
- Requêtes légitimes répétées (utilisateur corrige son email plusieurs fois)

---

## Implémentation Technique

### Structure de Données (Vercel Edge Config KV)

```typescript
interface RateLimitEntry {
  ip: string;
  tier: 1 | 2 | 3;
  count: number; // Requêtes dans la fenêtre actuelle
  windowStart: number; // Timestamp début fenêtre
  violationCount: number; // Nombre de blocages total
  violationHistory: {
    timestamp: number;
    tier: 1 | 2 | 3;
  }[];
  penaltyUntil?: number; // Tier 2: Timestamp fin pénalité 24h
  blocked: boolean; // Tier 3: Blocage permanent
}
```

### Fonction de Vérification

```typescript
async function checkRateLimit(ip: string, turnstileScore: number): Promise<RateLimitResult> {
  // 1. Whitelist si score Turnstile élevé
  if (turnstileScore >= 0.7) {
    return { limited: false, whitelisted: true };
  }

  // 2. Récupérer entrée IP
  const entry = await getEntry(ip);

  // 3. Tier 3: Blocage permanent
  if (entry?.blocked) {
    return {
      limited: true,
      tier: 3,
      blocked: true,
      message: 'Contactez support pour déblocage',
    };
  }

  // 4. Tier 2: Pénalité 24h
  if (entry?.penaltyUntil && Date.now() < entry.penaltyUntil) {
    return checkTier2Limit(entry);
  }

  // 5. Tier 1: Standard
  return checkTier1Limit(entry);
}
```

### Logique d'Escalade

```typescript
function escalateTier(entry: RateLimitEntry): RateLimitEntry {
  const updated = { ...entry };
  updated.violationCount++;
  updated.violationHistory.push({
    timestamp: Date.now(),
    tier: entry.tier,
  });

  if (updated.violationCount === 1) {
    // Premier blocage → Tier 2 (24h)
    updated.tier = 2;
    updated.penaltyUntil = Date.now() + 24 * 60 * 60 * 1000;
  } else if (updated.violationCount >= 3) {
    // 3ème blocage → Tier 3 (permanent)
    updated.tier = 3;
    updated.blocked = true;
    updated.penaltyUntil = undefined; // Plus de reset auto
  }

  return updated;
}
```

---

## Monitoring & Alertes

### Métriques Sentry

- **Tier 2 Activations** : Alerte si >10 IPs/jour en Tier 2
- **Tier 3 Blocks** : Notification immédiate admin
- **Whitelist Bypasses** : Log pour analyse patterns

### Dashboard Vercel

Graphiques :

- Répartition Tier 1/2/3 (dernières 24h)
- Taux de whitelist Turnstile (%)
- Top 10 IPs bloquées (Tier 3)
- Requêtes/heure avec tier color-coding

---

## Cas d'Usage & Scénarios

### Scénario 1 : Utilisateur Légitime (Happy Path)

```
1. Requête 1-3  : Score Turnstile 0.85 → Whitelist bypass ✅
2. Requête 4    : Score Turnstile 0.72 → Whitelist bypass ✅
3. Requête 5-10 : Score Turnstile 0.68 → Tier 1 (10 req OK) ✅
```

**Résultat** : Aucun blocage, expérience fluide

---

### Scénario 2 : Bot Mal Configuré

```
1. Requête 1-10  : Tier 1 → OK
2. Requête 11    : Tier 1 dépassé → 429 (escalation Tier 2)
3. Attend 2h, requête 12-14 : Tier 2 (3 req OK)
4. Requête 15    : Tier 2 dépassé → 429 (escalation Tier 3)
5. Requête 16+   : Tier 3 → 403 Forbidden permanent
```

**Résultat** : Bot identifié et bloqué après pattern suspect

---

### Scénario 3 : Bureau d'Entreprise (IP Partagée)

```
1. User A : 5 requêtes, score 0.80 → Whitelist bypass
2. User B : 3 requêtes, score 0.75 → Whitelist bypass
3. User C : 2 requêtes, score 0.65 → Tier 1 (10 req)
4. User D : 1 requête, score 0.90 → Whitelist bypass
```

**Résultat** : Score Turnstile distingue humains, pas de faux positifs

---

## Configuration & Tests

### Variables d'Environnement

```bash
# .env.production
RATE_LIMIT_TIER1_MAX=10          # Requêtes/heure Tier 1
RATE_LIMIT_TIER2_MAX=3           # Requêtes/heure Tier 2
RATE_LIMIT_TIER2_DURATION=86400  # Durée pénalité (24h en secondes)
RATE_LIMIT_TIER3_THRESHOLD=3     # Violations avant Tier 3
TURNSTILE_WHITELIST_SCORE=0.7    # Score minimum whitelist
```

### Tests E2E

```typescript
// e2e/rate-limiting-tiers.spec.ts
test('should escalate from Tier 1 to Tier 2 after 10 requests', async () => {
  const ip = '203.0.113.50';

  // Envoyer 11 requêtes
  for (let i = 0; i < 11; i++) {
    const res = await apiContext.post('/api/contact', {
      data: { ...validPayload },
      headers: { 'X-Forwarded-For': ip },
    });

    if (i < 10) {
      expect(res.status()).toBe(200);
    } else {
      expect(res.status()).toBe(429);
      const json = await res.json();
      expect(json.escalation).toBe('tier2');
    }
  }
});
```

---

## Maintenance & Déblocage

### Commande Admin (API Interne)

```bash
# Débloquer une IP manuellement
curl -X POST https://portfolio.dev/api/admin/unblock \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"ip": "203.0.113.50", "reason": "Utilisateur légitime vérifié"}'
```

### Logs Sentry

Chaque blocage Tier 3 génère un event Sentry :

```json
{
  "level": "warning",
  "message": "IP blocked permanently (Tier 3)",
  "extra": {
    "ip": "203.0.113.50",
    "violationCount": 3,
    "violationHistory": [...],
    "lastScore": 0.42
  }
}
```

---

## Évolutions Futures (Hors-Scope M7)

- [ ] Machine Learning pour détection pattern (au-delà du score Turnstile)
- [ ] Rate limiting basé sur User-Agent (bots identifiés)
- [ ] Whitelist manuelle via dashboard admin
- [ ] Geo-blocking par pays (si spam massif d'une région)

---

**Statut** : 📝 **Spécification Validée** - Implémentation à suivre dans Epic 2.4
