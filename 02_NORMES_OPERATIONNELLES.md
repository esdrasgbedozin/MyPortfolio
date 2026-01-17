# 02_NORMES_OPERATIONNELLES.md

> **Document des Normes de Développement & QA**  
> Projet : Portfolio Professionnel d'Ingénieur Informatique  
> Date : 17 janvier 2026  
> Version : 1.0  
> Statut : ✅ **VALIDÉ**

---

## 1. Principes de Développement (The Golden Rules)

### 1.1 Principes SOLID Appliqués à l'Architecture Jamstack

#### S - Single Responsibility Principle (SRP)

**Principe** : Une classe/module/composant ne doit avoir qu'une seule raison de changer.

**Application dans le projet** :

❌ **Mauvais exemple** (composant monolithique) :
```typescript
// ❌ ProjectCard.tsx - Trop de responsabilités
export function ProjectCard({ project }: { project: Project }) {
  // Responsabilité 1: Rendu UI
  // Responsabilité 2: Logique de filtrage
  // Responsabilité 3: Formatage des dates
  // Responsabilité 4: Gestion de l'état du filtre
  
  const [filters, setFilters] = useState<Filters>({});
  
  const formatDate = (date: string) => {
    // Logique de formatage...
  };
  
  const matchesFilter = (project: Project, filters: Filters) => {
    // Logique de filtrage...
  };
  
  return (
    <div>
      {/* Rendu UI complexe */}
    </div>
  );
}
```

✅ **Bon exemple** (séparation des responsabilités) :
```typescript
// ✅ utils/date.ts - Responsabilité: Formatage des dates
export function formatProjectDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long'
  }).format(new Date(date));
}

// ✅ utils/projectFilters.ts - Responsabilité: Logique de filtrage
export function matchesFilters(project: Project, filters: Filters): boolean {
  if (filters.technology && !project.technologies.includes(filters.technology)) {
    return false;
  }
  if (filters.category && project.category !== filters.category) {
    return false;
  }
  return true;
}

// ✅ components/react/ProjectCard.tsx - Responsabilité: Rendu UI uniquement
import { formatProjectDate } from '@/utils/date';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      <time dateTime={project.date}>
        {formatProjectDate(project.date, locale)}
      </time>
      <p>{project.description}</p>
      <div className="technologies">
        {project.technologies.map(tech => (
          <span key={tech} className="badge">{tech}</span>
        ))}
      </div>
    </article>
  );
}

// ✅ components/react/ProjectList.tsx - Responsabilité: Gestion état + orchestration
import { ProjectCard } from './ProjectCard';
import { matchesFilters } from '@/utils/projectFilters';

export function ProjectList({ projects, locale }: ProjectListProps) {
  const [filters, setFilters] = useState<Filters>({});
  
  const filteredProjects = projects.filter(p => matchesFilters(p, filters));
  
  return (
    <div>
      <ProjectFilters filters={filters} onChange={setFilters} />
      <div className="project-grid">
        {filteredProjects.map(project => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
}
```

**Règle d'or** : Un fichier = une responsabilité. Si vous devez écrire "et" dans la description du fichier, il fait trop de choses.

---

#### D - Dependency Inversion Principle (DIP)

**Principe** : Dépendre des abstractions, pas des implémentations concrètes.

**Application dans le projet** :

❌ **Mauvais exemple** (couplage fort avec Resend) :
```typescript
// ❌ api/contact.ts - Couplé directement à Resend
import { Resend } from 'resend';

export default async function handler(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Logique de validation...
  
  // Impossible de changer de service email sans réécrire tout le handler
  await resend.emails.send({
    from: 'contact@portfolio.dev',
    to: process.env.ADMIN_EMAIL,
    subject: `Contact: ${data.name}`,
    text: data.message
  });
  
  return new Response('Success', { status: 200 });
}
```

✅ **Bon exemple** (abstraction via interface) :
```typescript
// ✅ services/email/types.ts - Abstraction
export interface EmailService {
  send(email: EmailPayload): Promise<EmailResult>;
}

export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ✅ services/email/resend.ts - Implémentation Resend
import { Resend } from 'resend';
import type { EmailService, EmailPayload, EmailResult } from './types';

export class ResendEmailService implements EmailService {
  private client: Resend;
  
  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }
  
  async send(email: EmailPayload): Promise<EmailResult> {
    try {
      const result = await this.client.emails.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html
      });
      
      return {
        success: true,
        messageId: result.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// ✅ services/email/sendgrid.ts - Implémentation SendGrid (fallback)
import sgMail from '@sendgrid/mail';
import type { EmailService, EmailPayload, EmailResult } from './types';

export class SendGridEmailService implements EmailService {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }
  
  async send(email: EmailPayload): Promise<EmailResult> {
    try {
      await sgMail.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// ✅ services/email/factory.ts - Factory pour instanciation
import type { EmailService } from './types';
import { ResendEmailService } from './resend';
import { SendGridEmailService } from './sendgrid';

export function createEmailService(): EmailService {
  const provider = process.env.EMAIL_PROVIDER || 'resend';
  
  switch (provider) {
    case 'resend':
      return new ResendEmailService(process.env.RESEND_API_KEY!);
    case 'sendgrid':
      return new SendGridEmailService(process.env.SENDGRID_API_KEY!);
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

// ✅ api/contact.ts - Handler découplé
import { createEmailService } from '@/services/email/factory';
import type { EmailService } from '@/services/email/types';

// Injection de dépendance via la factory
const emailService: EmailService = createEmailService();

export default async function handler(req: Request) {
  // Logique de validation...
  
  // Le handler ne sait pas quelle implémentation est utilisée
  const result = await emailService.send({
    from: 'contact@portfolio.dev',
    to: process.env.ADMIN_EMAIL!,
    subject: `Contact: ${data.name}`,
    text: data.message
  });
  
  if (!result.success) {
    return new Response(result.error, { status: 500 });
  }
  
  return new Response('Success', { status: 200 });
}
```

**Avantages** :
- ✅ Changement de provider email = 1 ligne dans `.env` (pas de code)
- ✅ Tests unitaires faciles (mock de `EmailService`)
- ✅ Stratégie de fallback simple (try Resend, then SendGrid)

**Règle d'or** : Jamais de `new` dans les handlers. Toujours via factory/DI.

---

### 1.2 Autres Principes SOLID (Application Résumée)

#### O - Open/Closed Principle
**Application** : Les composants Astro/React sont extensibles via composition (props, children) sans modification du code source.

Exemple :
```typescript
// Base extensible via props
function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={variants[variant]} {...props} />;
}

// Extension sans modifier Button
<Button variant="secondary">Click me</Button>
```

#### L - Liskov Substitution Principle
**Application** : Toutes les implémentations d'`EmailService` sont interchangeables sans casser le code.

#### I - Interface Segregation Principle
**Application** : Interfaces TypeScript spécifiques (pas de god-interfaces).

Exemple :
```typescript
// ❌ Mauvais
interface MegaService {
  sendEmail(): void;
  fetchProjects(): void;
  validateForm(): void;
  // ... 20 autres méthodes
}

// ✅ Bon
interface EmailService { send(): void; }
interface ProjectRepository { fetch(): void; }
interface FormValidator { validate(): void; }
```

---

### 1.3 Design Patterns Imposés

#### Pattern 1 : Factory Pattern

**Usage** : Instanciation des services (email, analytics, etc.)

**Exemple** : Voir `createEmailService()` ci-dessus (section D du SOLID)

**Règle** : Tous les services externes DOIVENT être instanciés via factory.

---

#### Pattern 2 : Repository Pattern (Content Collections)

**Usage** : Accès aux données de contenu (projets, certifications)

**Implémentation** :
```typescript
// repositories/projectRepository.ts
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export class ProjectRepository {
  /**
   * Récupère tous les projets d'une locale spécifique
   */
  async getAllByLocale(locale: string): Promise<CollectionEntry<'projects'>[]> {
    const allProjects = await getCollection('projects');
    return allProjects.filter(p => p.slug.endsWith(`.${locale}`));
  }
  
  /**
   * Récupère les projets publics uniquement
   */
  async getPublicProjects(locale: string): Promise<CollectionEntry<'projects'>[]> {
    const projects = await this.getAllByLocale(locale);
    return projects.filter(p => p.data.visibility === 'public');
  }
  
  /**
   * Récupère un projet par slug (sans extension locale)
   */
  async getBySlug(slug: string, locale: string): Promise<CollectionEntry<'projects'> | undefined> {
    const projects = await this.getAllByLocale(locale);
    return projects.find(p => p.slug.startsWith(slug));
  }
  
  /**
   * Récupère les projets mis en avant (featured)
   */
  async getFeaturedProjects(locale: string): Promise<CollectionEntry<'projects'>[]> {
    const projects = await this.getPublicProjects(locale);
    return projects.filter(p => p.data.featured === true)
                   .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
                   .slice(0, 3);
  }
}

// Usage dans les pages Astro
const projectRepo = new ProjectRepository();
const projects = await projectRepo.getPublicProjects('fr');
```

**Règle** : JAMAIS de `getCollection()` direct dans les pages. Toujours via Repository.

---

#### Pattern 3 : Strategy Pattern (Validation)

**Usage** : Validation des formulaires avec stratégies interchangeables

**Implémentation** :
```typescript
// validators/types.ts
export interface ValidationStrategy<T> {
  validate(data: T): ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// validators/contactFormValidator.ts
import { z } from 'zod';
import type { ValidationStrategy, ValidationResult } from './types';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export class ContactFormValidator implements ValidationStrategy<unknown> {
  validate(data: unknown): ValidationResult {
    const result = contactSchema.safeParse(data);
    
    if (result.success) {
      return { valid: true, errors: {} };
    }
    
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      errors[issue.path[0]] = issue.message;
    });
    
    return { valid: false, errors };
  }
}

// Usage dans l'API
const validator = new ContactFormValidator();
const validation = validator.validate(req.body);

if (!validation.valid) {
  return Response.json(validation.errors, { status: 400 });
}
```

---

#### Pattern 4 : Builder Pattern (Email Templates)

**Usage** : Construction d'emails HTML complexes

**Implémentation** :
```typescript
// services/email/builder.ts
export class EmailBuilder {
  private from: string = '';
  private to: string = '';
  private subject: string = '';
  private text: string = '';
  private html?: string;
  
  setFrom(from: string): this {
    this.from = from;
    return this;
  }
  
  setTo(to: string): this {
    this.to = to;
    return this;
  }
  
  setSubject(subject: string): this {
    this.subject = subject;
    return this;
  }
  
  setText(text: string): this {
    this.text = text;
    return this;
  }
  
  setHtml(html: string): this {
    this.html = html;
    return this;
  }
  
  build(): EmailPayload {
    if (!this.from || !this.to || !this.subject || !this.text) {
      throw new Error('Missing required email fields');
    }
    
    return {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html
    };
  }
}

// Usage
const email = new EmailBuilder()
  .setFrom('contact@portfolio.dev')
  .setTo(process.env.ADMIN_EMAIL!)
  .setSubject(`Contact: ${data.name}`)
  .setText(data.message)
  .setHtml(generateHtmlTemplate(data))
  .build();

await emailService.send(email);
```

---

## 2. Stratégie de Test (TDD Workflow)

### 2.1 Stack de Test Confirmée

| Type de Test | Outil | Justification |
|-------------|-------|---------------|
| **Unit Tests** | Vitest | Rapide, compatible Vite ecosystem, syntaxe similaire à Jest |
| **Integration Tests** | Vitest | Même outil pour cohérence |
| **E2E Tests** | Playwright | Multi-browser, API moderne, screenshots/videos auto |
| **Component Tests** | Vitest + Testing Library | Tests React sans browser lourd |
| **Type Checking** | TypeScript (strict) | Évite bugs à la compilation |
| **Linting** | ESLint + TypeScript ESLint | Code quality automatique |
| **Formatting** | Prettier | Cohérence style |

**Installation** :
```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/user-event
pnpm add -D playwright @playwright/test
```

---

### 2.2 Cycle TDD Strict

```
┌─────────────────────────────────────────────────┐
│                  TDD CYCLE                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. 🔴 RED: Write Failing Test                  │
│     ├─ Test d'abord (pas de code prod)         │
│     ├─ Décrit le comportement attendu           │
│     └─ Test DOIT échouer (sinon test inutile)  │
│                                                  │
│  2. 🟢 GREEN: Write Minimal Code                │
│     ├─ Code minimal pour passer le test         │
│     ├─ Pas d'optimisation prématurée            │
│     └─ Test DOIT passer                         │
│                                                  │
│  3. 🔵 REFACTOR: Improve Code Quality           │
│     ├─ Nettoyage sans changer comportement      │
│     ├─ Élimination duplication                  │
│     ├─ Amélioration lisibilité                  │
│     └─ Tests DOIVENT rester verts               │
│                                                  │
│  4. ↩️  REPEAT: Next Feature                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### 2.3 Pattern AAA (Arrange-Act-Assert)

**Structure obligatoire pour tous les tests** :

```typescript
import { describe, it, expect } from 'vitest';
import { formatProjectDate } from '@/utils/date';

describe('formatProjectDate', () => {
  it('should format date in French locale', () => {
    // 🔧 ARRANGE: Préparation des données et du contexte
    const date = '2026-01-15';
    const locale = 'fr';
    const expectedOutput = 'janvier 2026';
    
    // 🎬 ACT: Exécution de l'action à tester
    const result = formatProjectDate(date, locale);
    
    // ✅ ASSERT: Vérification du résultat
    expect(result).toBe(expectedOutput);
  });
  
  it('should format date in English locale', () => {
    // 🔧 ARRANGE
    const date = '2026-01-15';
    const locale = 'en';
    const expectedOutput = 'January 2026';
    
    // 🎬 ACT
    const result = formatProjectDate(date, locale);
    
    // ✅ ASSERT
    expect(result).toBe(expectedOutput);
  });
  
  it('should throw error for invalid date', () => {
    // 🔧 ARRANGE
    const invalidDate = 'not-a-date';
    const locale = 'fr';
    
    // 🎬 ACT + ✅ ASSERT (combinés pour exceptions)
    expect(() => {
      formatProjectDate(invalidDate, locale);
    }).toThrow('Invalid date');
  });
});
```

**Règles AAA** :
- ✅ Sections séparées par ligne vide
- ✅ Commentaires AAA dans les tests complexes
- ✅ Une assertion par test (principe du test unitaire)
- ✅ Nom de test descriptif (`should ...` format)

---

### 2.4 Couverture de Code Minimale

| Type | Couverture Minimale | Cible Idéale |
|------|---------------------|--------------|
| **Branches** | 80% | 90% |
| **Lignes** | 80% | 90% |
| **Fonctions** | 80% | 90% |
| **Statements** | 80% | 90% |

**Configuration Vitest** (`vitest.config.ts`) :
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80
      },
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
        'tests/**'
      ]
    }
  }
});
```

---

### 2.5 Exemple Complet TDD

**Feature à implémenter** : Filtrer les projets par technologie

#### Étape 1: 🔴 RED - Test qui échoue

```typescript
// tests/unit/projectFilters.test.ts
import { describe, it, expect } from 'vitest';
import { filterByTechnology } from '@/utils/projectFilters';
import type { Project } from '@/types';

describe('filterByTechnology', () => {
  it('should return only projects with specified technology', () => {
    // ARRANGE
    const projects: Project[] = [
      { slug: 'project-1', title: 'Project 1', technologies: ['React', 'TypeScript'] },
      { slug: 'project-2', title: 'Project 2', technologies: ['Vue', 'TypeScript'] },
      { slug: 'project-3', title: 'Project 3', technologies: ['React', 'Node.js'] }
    ];
    const technology = 'React';
    
    // ACT
    const result = filterByTechnology(projects, technology);
    
    // ASSERT
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('project-1');
    expect(result[1].slug).toBe('project-3');
  });
});
```

**Résultat** : ❌ Test échoue (fonction n'existe pas)

#### Étape 2: 🟢 GREEN - Code minimal

```typescript
// src/utils/projectFilters.ts
import type { Project } from '@/types';

export function filterByTechnology(projects: Project[], technology: string): Project[] {
  return projects.filter(project => 
    project.technologies.includes(technology)
  );
}
```

**Résultat** : ✅ Test passe

#### Étape 3: 🔵 REFACTOR - Amélioration

```typescript
// src/utils/projectFilters.ts
import type { Project } from '@/types';

/**
 * Filtre les projets par technologie
 * @param projects - Liste des projets
 * @param technology - Technologie à rechercher (case-insensitive)
 * @returns Projets correspondants
 */
export function filterByTechnology(projects: Project[], technology: string): Project[] {
  const normalizedTech = technology.toLowerCase();
  
  return projects.filter(project =>
    project.technologies.some(tech => 
      tech.toLowerCase() === normalizedTech
    )
  );
}
```

**Ajout de test pour case-insensitive** :
```typescript
it('should be case-insensitive', () => {
  // ARRANGE
  const projects: Project[] = [
    { slug: 'project-1', title: 'Project 1', technologies: ['React'] }
  ];
  
  // ACT & ASSERT
  expect(filterByTechnology(projects, 'react')).toHaveLength(1);
  expect(filterByTechnology(projects, 'REACT')).toHaveLength(1);
  expect(filterByTechnology(projects, 'ReAcT')).toHaveLength(1);
});
```

**Résultat** : ✅ Tous les tests passent, code refactoré

---

## 3. Gestion des Erreurs & Logs

### 3.1 Standard RFC 7807 (Problem Details for HTTP APIs)

**Spécification** : [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807)

**Structure JSON obligatoire** :

```typescript
// types/errors.ts
export interface ProblemDetails {
  /**
   * URI identifiant le type d'erreur
   * @example "https://portfolio.dev/errors/validation-error"
   */
  type: string;
  
  /**
   * Résumé court lisible par l'humain
   * @example "Validation Error"
   */
  title: string;
  
  /**
   * Code HTTP
   * @example 400
   */
  status: number;
  
  /**
   * Explication détaillée de l'erreur
   * @example "The 'email' field must be a valid email address."
   */
  detail: string;
  
  /**
   * URI de la ressource concernée
   * @example "/api/contact"
   */
  instance: string;
  
  /**
   * Champs additionnels spécifiques
   * @example { "invalidFields": ["email", "name"] }
   */
  [key: string]: unknown;
}
```

**Implémentation** :

```typescript
// utils/errors.ts
import type { ProblemDetails } from '@/types/errors';

export class ApiError extends Error {
  constructor(
    public problemDetails: ProblemDetails
  ) {
    super(problemDetails.detail);
    this.name = 'ApiError';
  }
  
  toResponse(): Response {
    return Response.json(this.problemDetails, {
      status: this.problemDetails.status,
      headers: {
        'Content-Type': 'application/problem+json'
      }
    });
  }
}

// Erreurs prédéfinies
export class ValidationError extends ApiError {
  constructor(detail: string, instance: string, invalidFields: string[]) {
    super({
      type: 'https://portfolio.dev/errors/validation-error',
      title: 'Validation Error',
      status: 400,
      detail,
      instance,
      invalidFields
    });
  }
}

export class RateLimitError extends ApiError {
  constructor(instance: string, retryAfter: number) {
    super({
      type: 'https://portfolio.dev/errors/rate-limit',
      title: 'Rate Limit Exceeded',
      status: 429,
      detail: 'Too many requests. Please try again later.',
      instance,
      retryAfter
    });
  }
}

export class TurnstileError extends ApiError {
  constructor(instance: string) {
    super({
      type: 'https://portfolio.dev/errors/captcha-invalid',
      title: 'Captcha Validation Failed',
      status: 403,
      detail: 'The captcha challenge was not completed successfully.',
      instance
    });
  }
}

// Usage dans Edge Functions
export default async function handler(req: Request) {
  try {
    const validation = validator.validate(req.body);
    
    if (!validation.valid) {
      throw new ValidationError(
        'Invalid input data',
        '/api/contact',
        Object.keys(validation.errors)
      );
    }
    
    // ... logique métier
    
    return Response.json({ success: true });
    
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    
    // Erreur inconnue
    return Response.json({
      type: 'https://portfolio.dev/errors/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred.',
      instance: '/api/contact'
    } as ProblemDetails, { status: 500 });
  }
}
```

**Exemple de réponse d'erreur** :

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://portfolio.dev/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid input data",
  "instance": "/api/contact",
  "invalidFields": ["email", "name"]
}
```

---

### 3.2 Politique de Logs

#### Niveaux de Log (Ordre de Sévérité)

| Niveau | Usage | Exemple |
|--------|-------|---------|
| **DEBUG** | Informations de débogage détaillées | Valeurs de variables, étapes d'algo |
| **INFO** | Événements normaux du système | Requête traitée, email envoyé |
| **WARN** | Situations anormales mais gérées | Fallback sur SendGrid après échec Resend |
| **ERROR** | Erreurs nécessitant attention | Échec validation Turnstile, timeout API |

#### Format JSON Structuré (Obligatoire)

**Structure de log standardisée** :

```typescript
// utils/logger.ts
export interface LogEntry {
  timestamp: string;        // ISO 8601
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: string;         // Nom du module/fonction
  requestId?: string;       // Trace ID pour corrélation
  userId?: string;          // Si applicable
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private log(level: LogEntry['level'], message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: metadata?.context as string,
      requestId: metadata?.requestId as string,
      metadata
    };
    
    // En production, envoyer à service externe (Vercel Logs, Datadog, etc.)
    // En dev, console.log
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${level}] ${message}`, metadata);
    }
  }
  
  debug(message: string, metadata?: Record<string, unknown>) {
    if (process.env.LOG_LEVEL === 'DEBUG') {
      this.log('DEBUG', message, metadata);
    }
  }
  
  info(message: string, metadata?: Record<string, unknown>) {
    this.log('INFO', message, metadata);
  }
  
  warn(message: string, metadata?: Record<string, unknown>) {
    this.log('WARN', message, metadata);
  }
  
  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    this.log('ERROR', message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
}

export const logger = new Logger();
```

**Usage dans l'application** :

```typescript
// api/contact.ts
import { logger } from '@/utils/logger';

export default async function handler(req: Request) {
  const requestId = crypto.randomUUID();
  
  logger.info('Contact form submission received', {
    context: 'api/contact',
    requestId
  });
  
  try {
    const validation = validator.validate(req.body);
    
    if (!validation.valid) {
      logger.warn('Validation failed', {
        context: 'api/contact',
        requestId,
        errors: validation.errors
      });
      throw new ValidationError('Invalid input', '/api/contact', Object.keys(validation.errors));
    }
    
    const result = await emailService.send(email);
    
    if (!result.success) {
      logger.error('Email sending failed', new Error(result.error), {
        context: 'api/contact',
        requestId
      });
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    logger.info('Email sent successfully', {
      context: 'api/contact',
      requestId,
      messageId: result.messageId
    });
    
    return Response.json({ success: true });
    
  } catch (error) {
    logger.error('Unexpected error in contact handler', error as Error, {
      context: 'api/contact',
      requestId
    });
    
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Exemple de log JSON en production** :

```json
{
  "timestamp": "2026-01-17T14:32:15.123Z",
  "level": "ERROR",
  "message": "Email sending failed",
  "context": "api/contact",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "error": {
    "name": "Error",
    "message": "Connection timeout",
    "stack": "Error: Connection timeout\n    at ResendEmailService.send (/api/contact.ts:42:11)"
  }
}
```

---

## 4. Git Flow & Conventional Commits

### 4.1 Stratégie de Branches

```
main (production)
  ├── develop (integration)
  │    ├── feature/epic-1-presentation
  │    ├── feature/epic-2-projects-catalog
  │    ├── feature/epic-5-contact-form
  │    ├── bugfix/project-filter-bug
  │    └── hotfix/security-patch
  └── (hotfix direct si critique)
```

#### Branches Principales

| Branche | Rôle | Protection |
|---------|------|------------|
| **main** | Production (site live) | ✅ Protected, require PR, require CI pass |
| **develop** | Intégration (pré-production) | ✅ Protected, require PR |

#### Branches Éphémères

| Préfixe | Usage | Exemple | Durée de vie |
|---------|-------|---------|--------------|
| **feature/** | Nouvelle fonctionnalité | `feature/epic-2-projects-catalog` | Jusqu'à merge |
| **bugfix/** | Correction bug non-urgent | `bugfix/project-filter-locale` | Jusqu'à merge |
| **hotfix/** | Correction critique en prod | `hotfix/xss-vulnerability` | Merge direct main |
| **chore/** | Tâches maintenance | `chore/update-dependencies` | Jusqu'à merge |
| **docs/** | Documentation uniquement | `docs/add-api-documentation` | Jusqu'à merge |

#### Workflow Standard

```bash
# 1. Créer une feature branch depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/epic-2-projects-catalog

# 2. Développer (commits conventionnels)
git add .
git commit -m "feat(projects): add project filtering by technology"
git commit -m "test(projects): add unit tests for filters"
git commit -m "docs(projects): update README with filter usage"

# 3. Push et créer Pull Request
git push origin feature/epic-2-projects-catalog
# → Créer PR sur GitHub : feature/epic-2-projects-catalog → develop

# 4. Après merge, supprimer la branche
git branch -d feature/epic-2-projects-catalog
git push origin --delete feature/epic-2-projects-catalog
```

#### Workflow Hotfix (Urgent)

```bash
# Hotfix part directement de main
git checkout main
git pull origin main
git checkout -b hotfix/xss-vulnerability

# Fix + commit
git commit -m "fix(security): sanitize user input in contact form"

# Merge direct dans main ET develop
git checkout main
git merge hotfix/xss-vulnerability
git push origin main

git checkout develop
git merge hotfix/xss-vulnerability
git push origin develop

git branch -d hotfix/xss-vulnerability
```

---

### 4.2 Conventional Commits (Standard Obligatoire)

**Spécification** : [Conventional Commits v1.0.0](https://www.conventionalcommits.org/)

#### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

#### Types Autorisés

| Type | Description | Exemple |
|------|-------------|---------|
| **feat** | Nouvelle fonctionnalité | `feat(projects): add project filtering` |
| **fix** | Correction de bug | `fix(contact): validate email format` |
| **docs** | Documentation uniquement | `docs(readme): add setup instructions` |
| **style** | Formatage (pas de logique) | `style(button): fix indentation` |
| **refactor** | Refactoring (pas de feature/fix) | `refactor(email): extract service interface` |
| **perf** | Amélioration performance | `perf(images): add lazy loading` |
| **test** | Ajout/modification tests | `test(filters): add edge cases` |
| **chore** | Maintenance (deps, config) | `chore(deps): upgrade astro to 4.2` |
| **ci** | CI/CD | `ci(vercel): add preview deploy config` |
| **revert** | Annulation commit précédent | `revert: feat(projects): add filtering` |

#### Scopes Recommandés

| Scope | Description |
|-------|-------------|
| **projects** | Module projets |
| **certifications** | Module certifications |
| **skills** | Module compétences |
| **contact** | Formulaire de contact |
| **i18n** | Internationalisation |
| **ui** | Composants UI génériques |
| **security** | Sécurité |
| **deps** | Dépendances |

#### Règles du Subject

- ✅ Impératif présent ("add", pas "added" ou "adds")
- ✅ Minuscule (pas de majuscule initiale)
- ✅ Pas de point final
- ✅ Max 50 caractères
- ✅ Descriptif mais concis

#### Exemples de Commits Valides

```bash
feat(projects): add filtering by technology and category
fix(contact): validate email format before submission
docs(architecture): add C4 diagrams to technical doc
style(button): remove trailing whitespace
refactor(email): extract service interface for DI
perf(images): implement lazy loading on project cards
test(filters): add unit tests for edge cases
chore(deps): upgrade tailwind to v3.4.1
ci(github): add automated lighthouse checks
revert: feat(projects): add filtering by technology
```

#### Exemples de Commits Invalides

```bash
❌ Added new feature              # Pas d'impératif, pas de type/scope
❌ fix: Bug in contact form      # Subject doit être minuscule
❌ feat(projects): Add filter.   # Pas de point final
❌ FEAT(PROJECTS): ADD FILTER    # Tout en majuscules
❌ feat: add feature             # Scope manquant
```

#### Breaking Changes

**Format** :
```
feat(api)!: change contact endpoint response format

BREAKING CHANGE: The contact API now returns RFC 7807 format instead of plain JSON.

Before:
{ "success": true }

After:
{ "type": "...", "title": "...", "status": 200 }
```

**Règle** : `!` après le scope + section `BREAKING CHANGE:` dans le body.

---

### 4.3 Configuration Commitlint

**Installation** :
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
pnpm add -D husky lint-staged
```

**commitlint.config.js** :
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert']
    ],
    'scope-enum': [
      2,
      'always',
      ['projects', 'certifications', 'skills', 'contact', 'i18n', 'ui', 'security', 'deps']
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 50],
    'subject-full-stop': [2, 'never', '.']
  }
};
```

**Husky pre-commit hook** :
```bash
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
npx husky add .husky/pre-commit 'npx lint-staged'
```

**.husky/pre-commit** :
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**lint-staged config** (`package.json`) :
```json
{
  "lint-staged": {
    "*.{ts,tsx,astro}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## 5. BONUS : Fichier de Contexte (.cursorrules / .windsurf)

**Fichier à créer** : `.cursorrules` (racine du projet)

```markdown
# Portfolio Pro - Règles de Développement

## Stack Technique
- Framework: Astro 4.x (SSG + Islands)
- UI: React 18.x (composants interactifs uniquement)
- Styling: Tailwind CSS 3.x
- Language: TypeScript 5.x (Strict Mode)
- Tests: Vitest + Playwright
- Hosting: Vercel (Edge Functions)

## Architecture
- Pattern: Jamstack Statique avec Edge Functions
- Content: Markdown/MDX versionné dans Git
- i18n: Format `{slug}.{locale}.{extension}` (fr/en)
- Services: Injection de dépendances via Factory Pattern

## Principes SOLID
- **S**: Un fichier = une responsabilité
- **O**: Composants extensibles via props/composition
- **L**: Interfaces interchangeables (EmailService)
- **I**: Interfaces spécifiques (pas de god-interfaces)
- **D**: Dépendre d'abstractions (pas d'implémentations concrètes)

## Design Patterns Obligatoires
1. **Factory**: Instanciation services (`createEmailService()`)
2. **Repository**: Accès contenu (`ProjectRepository`)
3. **Strategy**: Validation (`ValidationStrategy`)
4. **Builder**: Construction emails complexes

## Tests (TDD Strict)
- Cycle: 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
- Pattern: AAA (Arrange-Act-Assert)
- Couverture: ≥80% (branches, lignes, fonctions)
- Nommage: `should + behavior` format

## Gestion Erreurs
- Standard: RFC 7807 (Problem Details for HTTP APIs)
- Format: JSON structuré avec type/title/status/detail/instance
- Classes: `ApiError`, `ValidationError`, `RateLimitError`

## Logs
- Format: JSON structuré obligatoire
- Niveaux: DEBUG, INFO, WARN, ERROR
- Champs: timestamp, level, message, context, requestId, metadata

## Git Flow
- Branches: `main` (prod), `develop` (intégration)
- Features: `feature/<epic-name>`
- Bugfix: `bugfix/<issue-name>`
- Hotfix: `hotfix/<critical-issue>` (merge direct main)

## Conventional Commits
Format: `<type>(<scope>): <subject>`

Types autorisés:
- feat, fix, docs, style, refactor, perf, test, chore, ci, revert

Scopes:
- projects, certifications, skills, contact, i18n, ui, security, deps

Règles subject:
- Impératif présent ("add" pas "added")
- Minuscule
- Max 50 caractères
- Pas de point final

## Sécurité
- Headers: X-Content-Type-Options, X-Frame-Options, CSP
- Rate Limiting: Max 5 req/heure/IP sur formulaire contact
- Anti-Spam: Cloudflare Turnstile obligatoire
- Secrets: Variables d'env (jamais hardcodé)
- Validation: Zod côté client ET serveur

## Performance
- Lighthouse: Score >90 obligatoire
- FCP: <2s
- Images: Lazy loading + Vercel Image Optimization
- CSS: Inline critique (<14KB)
- React: `client:idle` préféré à `client:load`

## Accessibilité
- Standard: WCAG 2.1 niveau AA
- Tests: 3 lecteurs d'écran (NVDA, JAWS, VoiceOver)
- Navigation: 100% accessible au clavier
- Contraste: ≥4.5:1 (texte normal), ≥3:1 (texte large)
- Motion: Support `prefers-reduced-motion`

## Code Style
- Linter: ESLint + TypeScript ESLint
- Formatter: Prettier
- Pre-commit: Husky + lint-staged
- Type Checking: `pnpm typecheck` avant commit

## Commandes Utiles
```bash
pnpm dev              # Dev server
pnpm build            # Production build
pnpm preview          # Preview build
pnpm test             # Run tests
pnpm test:ui          # Vitest UI
pnpm test:e2e         # Playwright E2E
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm typecheck        # TypeScript check
```

## Règles de Review
1. Tous les tests passent (CI)
2. Couverture ≥80%
3. Aucune erreur TypeScript
4. Lighthouse >90
5. Commit conventionnel respecté
6. Documentation à jour si API change
```

---

**Document rédigé par** : GitHub Copilot (Lead Developer & QA Lead Mode)  
**Pour** : Esdras GBEDOZIN - Ingénieur Informatique  
**Date** : 17 janvier 2026  
**Statut** : ✅ **VALIDÉ - Document de Référence**
