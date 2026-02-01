# Architecture Services & Patterns

> **Documentation Technique - Architecture Backend**  
> Projet : Portfolio Professionnel  
> Epic : 5.3 - Documentation (EF-060)  
> Date : 1 février 2026

---

## 📐 Vue d'Ensemble de l'Architecture

### Stack Technologique

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  Next.js Static Pages + React Islands (client:idle)     │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│             VERCEL EDGE NETWORK (CDN)                    │
│  • Static Assets (99% du traffic)                       │
│  • Edge Functions (/api/*)                              │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐    ┌─────────┐   ┌──────────┐
   │ Resend │    │Turnstile│   │ Edge     │
   │ Email  │    │Cloudflare│  │ Config   │
   │ Service│    │ (CAPTCHA)│  │ (KV Store)│
   └────────┘    └─────────┘   └──────────┘
```

### Principes Architecturaux

1. **Jamstack** : Génération statique (Astro SSG) pour performance maximale
2. **Serverless** : Pas de serveur always-on, Edge Functions à la demande
3. **No Database** : Contenu versionné dans Git (Markdown/MDX)
4. **Edge-First** : Traitement au plus proche de l'utilisateur (Vercel Edge)

---

## 🏗️ Pattern d'Implémentation

### 1. Factory Pattern (EmailService)

**Objectif** : Créer le bon service email selon la configuration (Resend ou SendGrid).

**Diagramme de Classe** :

```
┌─────────────────────────┐
│   <<interface>>         │
│   EmailService          │
├─────────────────────────┤
│ + send(data): Promise   │
└──────────▲──────────────┘
           │
           │ implements
           │
    ┌──────┴──────┐
    │             │
┌───▼────────┐ ┌──▼─────────────┐
│  Resend    │ │  SendGrid      │
│  Email     │ │  Email         │
│  Service   │ │  Service       │
└────────────┘ └────────────────┘
       ▲               ▲
       │               │
       └───────┬───────┘
               │ creates
        ┌──────▼─────────┐
        │ EmailService   │
        │ Factory        │
        └────────────────┘
```

**Implémentation** :

```typescript
// src/services/email/EmailServiceFactory.ts
export function createEmailService(): EmailService {
  const provider = process.env.EMAIL_PROVIDER || 'resend';

  if (provider === 'resend') {
    return new ResendEmailService();
  } else if (provider === 'sendgrid') {
    return new SendGridEmailService();
  }

  throw new Error(`Unknown email provider: ${provider}`);
}
```

**Avantages** :

- ✅ Changement de provider sans toucher au code métier
- ✅ Testable avec mocks
- ✅ Respecte Open/Closed Principle (SOLID)

---

### 2. Retry Policy avec Exponential Backoff

**Objectif** : Réessayer les requêtes échouées avec délai progressif (réseau instable, rate limits).

**Logique de Retry** :

```
┌──────────────┐
│ API Call     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     Success
│ Execute      ├─────────────────► Return Result
└──────┬───────┘
       │ Failure
       ▼
┌──────────────┐
│ Retry Count  │
│ < Max (3)?   │
└──────┬───────┘
       │ Yes
       ▼
┌──────────────┐
│ Wait         │  Delay = base * 2^attempt
│ (Exponential)│  • 1st: 1s
└──────┬───────┘  • 2nd: 2s
       │          • 3rd: 4s
       │
       └─────► Retry Execute
       │ No
       ▼
┌──────────────┐
│ Throw Error  │
└──────────────┘
```

**Implémentation** :

```typescript
// src/services/email/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

**Usage dans EmailService** :

```typescript
async send(data: ContactEmailData): Promise<EmailServiceResult> {
  return retry(async () => {
    // Tentative d'envoi
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.status}`);
    }

    return { success: true };
  }, 3, 1000); // 3 tentatives, 1s base delay
}
```

**Cas d'Usage** :

- 🔄 Réseau temporairement indisponible (503 Service Unavailable)
- 🔄 Rate limit temporaire (429 Too Many Requests)
- ❌ **Ne pas retry** : Erreurs client (400, 401, 403) → échec immédiat

---

### 3. Strategy Pattern (Validation)

**Objectif** : Séparer les stratégies de validation (Zod client-side, Zod server-side, Turnstile).

**Diagramme** :

```
┌─────────────────────────┐
│   ValidationContext     │
├─────────────────────────┤
│ - strategy: Validator   │
│ + validate(data): bool  │
└──────────┬──────────────┘
           │ uses
           ▼
┌─────────────────────────┐
│   <<interface>>         │
│   ValidationStrategy    │
├─────────────────────────┤
│ + validate(data): bool  │
└──────────▲──────────────┘
           │ implements
    ┌──────┴──────┬──────────────┐
    │             │              │
┌───▼────────┐ ┌──▼─────────┐ ┌─▼──────────┐
│ ZodSchema  │ │ Turnstile  │ │ RateLimit  │
│ Validator  │ │ Validator  │ │ Validator  │
└────────────┘ └────────────┘ └────────────┘
```

**Implémentation** :

```typescript
// src/services/ContactService.ts
async processContactForm(data: ContactFormData): Promise<void> {
  // Strategy 1: Schema validation
  const validationResult = contactSchema.safeParse(data);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }

  // Strategy 2: Anti-spam
  const turnstileValid = await this.antiSpamService.verify(data.turnstileToken);
  if (!turnstileValid) {
    throw new ApiError(403, 'Turnstile verification failed');
  }

  // Strategy 3: Rate limiting
  const rateLimited = await this.rateLimitService.isRateLimited(ip);
  if (rateLimited.limited) {
    throw new RateLimitError(rateLimited.retryAfter);
  }

  // Execution
  await this.emailService.send(data);
}
```

---

### 4. Dependency Injection (Services)

**Objectif** : Injecter les dépendances au lieu de les créer (testabilité).

**Bad Practice** ❌ :

```typescript
class ContactService {
  constructor() {
    this.emailService = new ResendEmailService(); // ❌ Couplage fort
    this.turnstileService = new TurnstileService(); // ❌ Non testable
  }
}
```

**Good Practice** ✅ :

```typescript
class ContactService {
  constructor(
    private emailService: EmailService, // ✅ Injection
    private antiSpamService: AntiSpamService, // ✅ Interface
    private rateLimitService: RateLimitService
  ) {}
}

// Usage en production
const service = new ContactService(
  createEmailService(),
  new TurnstileService(process.env.TURNSTILE_SECRET),
  new RateLimitService(10, 3600000)
);

// Usage en tests
const service = new ContactService(
  mockEmailService, // ✅ Mock
  mockAntiSpamService, // ✅ Contrôlable
  mockRateLimitService
);
```

**Avantages** :

- ✅ Testable : Injection de mocks en tests
- ✅ Flexible : Changement de provider sans recompilation
- ✅ SOLID : Respecte Dependency Inversion Principle

---

## 🔐 Sécurité & Observabilité

### Security Headers (Middleware)

```typescript
// src/middleware/securityHeaders.ts
export function applySecurityHeaders(response: Response): Response {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;"
  );

  return response;
}
```

### Structured Logging (JSON)

```typescript
// src/utils/logger.ts
export const logger = {
  info(message: string, context: Record<string, any>) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message,
        ...context,
      })
    );
  },

  error(message: string, error: Error, context: Record<string, any>) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        ...context,
      })
    );
  },
};
```

**Exemple de log** :

```json
{
  "timestamp": "2026-02-01T12:34:56.789Z",
  "level": "INFO",
  "message": "Contact form processed successfully",
  "context": "api/contact",
  "requestId": "abc-123",
  "email": "user@example.com"
}
```

### Sentry Integration (Error Tracking)

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 0.1, // 10% des requêtes
});

export function captureException(error: Error, context: Record<string, any>) {
  Sentry.withScope((scope) => {
    scope.setContext('additional', context);
    Sentry.captureException(error);
  });
}
```

**Usage dans API handler** :

```typescript
try {
  await contactService.processContactForm(data);
} catch (error) {
  captureException(error as Error, {
    requestId,
    clientIp,
    userAgent: request.headers.get('user-agent'),
  });
  throw error;
}
```

---

## 📊 Diagrammes de Séquence

### Workflow: Soumission Formulaire Contact

```
Client          API Handler     ContactService    EmailService    Turnstile    RateLimit
  │                  │                │                │              │            │
  ├─POST /api/contact─►               │                │              │            │
  │                  │                │                │              │            │
  │                  ├─validate(data)─►                │              │            │
  │                  ◄────result──────┤                │              │            │
  │                  │                │                │              │            │
  │                  ├────────────────┼─verify(token)──►              │            │
  │                  ◄────────────────┼─────valid──────┤              │            │
  │                  │                │                │              │            │
  │                  ├────────────────┼────────────────┼──────────────┼─isLimited()─►
  │                  ◄────────────────┼────────────────┼──────────────┼───false─────┤
  │                  │                │                │              │            │
  │                  ├─process(data)─►                 │              │            │
  │                  │                ├─send(email)────►              │            │
  │                  │                │                ├─retry(1s)────►            │
  │                  │                │                ◄───success────┤            │
  │                  │                ◄────done────────┤              │            │
  │                  ◄─────200 OK─────┤                │              │            │
  ◄──{success:true}──┤                │                │              │            │
```

### Workflow: Retry avec Exponential Backoff

```
EmailService     Resend API
     │                │
     ├─send(email)────►
     │                │ ❌ 503 Service Unavailable
     ◄────error───────┤
     │                │
     ├─wait(1s)───────┤
     │                │
     ├─send(email)────► (Retry #1)
     │                │ ❌ Timeout
     ◄────error───────┤
     │                │
     ├─wait(2s)───────┤ (Exponential backoff)
     │                │
     ├─send(email)────► (Retry #2)
     │                │ ✅ 200 OK
     ◄────success─────┤
     │                │
     └─return result
```

---

## 🧪 Testing Strategy

### Niveaux de Tests

```
┌────────────────────────────────────────────────────┐
│                    E2E Tests                       │
│  Playwright - Workflow complet API + UI            │
├────────────────────────────────────────────────────┤
│              Contract Tests (OpenAPI)              │
│  Spectral + Prism - Validation spec                │
├────────────────────────────────────────────────────┤
│              Integration Tests                     │
│  Vitest - API handlers avec mock services          │
├────────────────────────────────────────────────────┤
│                 Unit Tests                         │
│  Vitest - Services, Utils, Components (≥80%)       │
└────────────────────────────────────────────────────┘
```

### TDD Cycle Appliqué

```
1. ✅ RED   : Écrire test qui échoue
2. ✅ GREEN : Code minimal pour passer
3. 🔵 REFACTOR : Améliorer sans changer comportement
4. ↩️ REPEAT : Feature suivante
```

**Exemple** :

```typescript
// 1. RED: Test d'abord
it('should retry 3 times on network error', async () => {
  let attempts = 0;
  const fn = vi.fn(() => {
    attempts++;
    if (attempts < 3) throw new Error('Network error');
    return Promise.resolve('success');
  });

  const result = await retry(fn, 3, 10);

  expect(fn).toHaveBeenCalledTimes(3);
  expect(result).toBe('success');
});

// 2. GREEN: Implémentation minimale
async function retry(fn, max, delay) {
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch {
      if (i < max - 1) await wait(delay);
    }
  }
}

// 3. REFACTOR: Améliorer (exponential backoff, types TS)
```

---

## 🚀 Déploiement & Monitoring

### Vercel Edge Functions

**Caractéristiques** :

- ⚡ Cold start <50ms (vs Lambda ~200ms)
- 🌍 Déployé dans 100+ villes (réseau Edge)
- 💰 Pay-per-execution (pas de serveur idle)
- 📦 Limite 1MB bundle size (optimisation forcée)

**Comparaison** :

| Métrique           | Edge Functions | Lambda (AWS) | Cloud Run (GCP) |
| ------------------ | -------------- | ------------ | --------------- |
| Cold Start         | 50ms           | 200ms        | 500ms           |
| Latence moyenne    | 10ms           | 50ms         | 80ms            |
| Scalabilité        | Infinie        | 1000 concur. | Config          |
| Pricing            | $0.65/1M req   | $0.20/1M req | $0.40/1M req    |
| Région utilisateur | Automatique    | Manuelle     | Manuelle        |

### Health Check Endpoint

```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2026-02-01T12:34:56.789Z",
  "services": {
    "resend": { "status": "up", "latency": 45 },
    "turnstile": { "status": "up", "latency": 32 },
    "rateLimit": { "status": "up" }
  }
}
```

**Monitoring Vercel** :

- Intégration Sentry pour erreurs
- Alertes email si `/api/health` DOWN >5min
- Dashboard Vercel Analytics (traffic, latence)

---

## 📝 Bonnes Pratiques

### ✅ DO

- Utiliser Dependency Injection pour testabilité
- Logger en JSON structuré (machine-readable)
- Implémenter retry avec exponential backoff
- Valider côté client ET serveur (Zod)
- Respecter SOLID (un fichier = une responsabilité)
- Tester avec TDD (test d'abord)

### ❌ DON'T

- Créer des services dans les constructeurs (couplage fort)
- Logger en texte brut (difficile à parser)
- Retry infiniment (max 3 tentatives)
- Valider uniquement côté client (sécurité)
- Mettre toute la logique dans le handler API (God class)
- Coder avant d'écrire le test (pas de TDD)

---

## 🔗 Références

- [Architecture Decision Records](./ADR.md)
- [OpenAPI Specification](../openapi.yaml)
- [Contract Testing Guide](./CONTRACT_TESTING.md)
- [Rate Limiting Strategy](./RATE_LIMITING_STRATEGY.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Auteur** : Esdras GBEDOZIN  
**Date** : 1 février 2026  
**Epic** : 5.3 - Documentation (EF-060)  
**Statut** : ✅ Validé
