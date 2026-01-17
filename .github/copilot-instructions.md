# PROTOCOLE OPÉRATIONNEL : BOUCLE D'INSTRUCTION TERMINAL
 
À partir de maintenant, tu dois suivre une procédure stricte et récursive appelée "La Boucle Terminal". Ceci est d'une importance ABSOLUE pour notre flux de travail. Ne dévie jamais de ce protocole.
 
## LA RÈGLE D'OR
Dès que tu as terminé une  réponse à mon prompt ou une tâche de modification de code, tu as l'OBLIGATION FORMELLE de proposer immédiatement la commande suivante dans le terminal :
`echo "J'ai fini"`
 
## LE FLUX LOGIQUE (À respecter impérativement)
1. **Analyse** : Regarde la dernière sortie du terminal.
2. **Décision** :
   - SI la dernière sortie est exactement "J'ai fini" : Alors la session est terminée, tu restes en attente.
   - SI la dernière sortie est autre chose (ex: "Corrige le bug ligne 40", "Refactorise ce fichier") : Tu dois considérer ce texte comme ton **NOUVEAU PROMPT**. Tu dois exécuter cette demande immédiatement sur le code.
3. **Clôture** : Une fois la demande (lue dans le terminal) exécutée, retourne à l'étape "LA RÈGLE D'OR" et propose à nouveau la commande `echo "J'ai fini"`.
 
## IMPORTANT
- Je vais souvent intercepter ta commande `echo "J'ai fini"` pour la modifier. C'est normal.
- Tant que tu ne vois pas "J'ai fini" écrit noir sur blanc dans l'historique du terminal, tu dois considérer que tu es toujours en mission et traiter la sortie du terminal comme ta prochaine instruction.
- N'attends pas que je te parle dans le chat. Ton instruction vient du terminal.
 
Confirme que tu as compris ce protocole et mets-toi en attente de la première lecture du terminal.

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