# Lighthouse CI - Guide de Test Performance

> **Epic 6.1 - EF-067 : Tests Performance Automatisés**  
> Date : 1 février 2026

---

## 🎯 Objectif

Valider automatiquement que le portfolio respecte les **budgets de performance** définis avant chaque déploiement en production. Lighthouse CI s'exécute dans la CI/CD GitHub Actions et **bloque le merge** si les scores sont en dessous des seuils.

---

## 📊 Budgets Performance

### Scores Lighthouse (0-1 scale)

| Catégorie          | Minimum | Description                                 |
| ------------------ | ------- | ------------------------------------------- |
| **Performance**    | 0.90    | Temps de chargement, Core Web Vitals        |
| **Accessibility**  | 0.95    | WCAG 2.1 AA, navigation clavier, contrastes |
| **Best Practices** | 0.90    | HTTPS, console errors, sécurité             |
| **SEO**            | 0.95    | Meta tags, structure HTML, mobile-friendly  |

### Core Web Vitals

| Métrique                           | Budget | Description                               |
| ---------------------------------- | ------ | ----------------------------------------- |
| **FCP** (First Contentful Paint)   | <2s    | Temps avant premier élément visible       |
| **LCP** (Largest Contentful Paint) | <2.5s  | Temps avant élément principal visible     |
| **CLS** (Cumulative Layout Shift)  | <0.1   | Stabilité visuelle (pas de décalages)     |
| **TBT** (Total Blocking Time)      | <300ms | Temps où le thread principal est bloqué   |
| **Speed Index**                    | <3s    | Vitesse d'affichage progressif de la page |

### Resource Budgets

| Type           | Budget | Exemple                                   |
| -------------- | ------ | ----------------------------------------- |
| **HTML**       | <50KB  | Page index.html                           |
| **JavaScript** | <150KB | Bundles React Islands (ContactForm, etc.) |
| **CSS**        | <30KB  | Tailwind CSS + styles custom              |
| **Images**     | <500KB | Total images sur une page                 |
| **Fonts**      | <100KB | Polices Inter/JetBrains Mono              |
| **Requests**   | <50    | Nombre total de requêtes HTTP             |

---

## 🚀 Exécution Locale

### Prérequis

```bash
# Build du projet
pnpm build

# Lancer serveur dev (nécessaire pour tests)
pnpm dev --host
```

### Lancer Lighthouse CI

```bash
# Test complet (8 pages FR/EN)
pnpm run lhci

# Résultats dans .lighthouseci/
```

### Interpréter les Résultats

**Succès** ✅ :

```
Running Lighthouse 8 time(s) on http://localhost:4321/
Run #1...success.
Run #2...success.
...
Done running Lighthouse!

Checking assertions against 8 run(s)...
✓ Performance score ≥ 0.9
✓ Accessibility score ≥ 0.95
✓ First Contentful Paint ≤ 2000ms
...
All assertions passed!
```

**Échec** ❌ :

```
✗ Performance score was 0.85, expected ≥ 0.9
  Details:
    - Largest Contentful Paint: 3200ms (budget: 2500ms)
    - Total Blocking Time: 450ms (budget: 300ms)

Assertion failures: 2
```

---

## 🛠️ Debugging Échecs

### Performance Score <0.9

**Causes communes** :

- Images non optimisées (pas de lazy-load)
- JavaScript trop lourd (>150KB bundle)
- Fonts non preload
- CSS non inline (critique)

**Solutions** :

1. **Images** : Utiliser Astro Image (`<Image />`)

   ```astro
   <Image src={img} alt="..." loading="lazy" />
   ```

2. **JavaScript** : Code-split React Islands

   ```astro
   <ContactForm client:idle />
   {/* Pas client:load */}
   ```

3. **Fonts** : Preload dans `<head>`

   ```html
   <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
   ```

4. **CSS** : Inline critique (<14KB)
   ```astro
   <style is:inline>
     /* Critical CSS */
   </style>
   ```

### FCP >2s ou LCP >2.5s

**Causes** :

- Images lourdes (>200KB)
- Fonts bloquent le rendu
- JavaScript bloque le parsing

**Solutions** :

```astro
---
// Preload hero image
const heroImg = await import('../assets/hero.webp');
---

<link rel="preload" as="image" href={heroImg.src} />

<!-- Lazy-load images hors viewport -->
<img loading="lazy" src="..." />
```

### CLS >0.1 (Layout Shift)

**Causes** :

- Images sans width/height
- Fonts FOUT (Flash Of Unstyled Text)
- Ads/embeds dynamiques

**Solutions** :

```astro
<!-- Toujours spécifier dimensions -->
<img width="800" height="600" ... />

<!-- Fonts avec font-display -->
<style>
  @font-face {
    font-display: swap; /* ou optional */
  }
</style>

<!-- Réserver espace pour contenu dynamique -->
<div style="min-height: 400px">
  <TurnstileWidget client:idle />
</div>
```

### Accessibility <0.95

**Causes** :

- Contrastes insuffisants (<4.5:1)
- Liens/boutons sans label
- Images sans alt
- Formulaires sans labels

**Solutions** :

```astro
<!-- Contraste suffisant -->
<p class="text-gray-800 dark:text-gray-200">...</p>

<!-- Labels obligatoires -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Alt texte descriptif -->
<img src="..." alt="Screenshot du projet e-commerce" />

<!-- Boutons accessibles -->
<button aria-label="Fermer modal">
  <Icon name="close" />
</button>
```

---

## 🔄 CI/CD GitHub Actions

### Workflow

```yaml
# .github/workflows/ci.yml
lighthouse:
  name: Lighthouse CI Performance Tests
  runs-on: ubuntu-latest
  needs: [build]
  steps:
    - uses: actions/checkout@v4
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-dist
        path: dist/
    - name: Run Lighthouse CI
      run: pnpm run lhci:ci
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Résultats dans PR

Lighthouse CI commente automatiquement les Pull Requests avec :

- Scores avant/après
- Différences de performance
- Captures d'écran
- Rapport détaillé

**Exemple de commentaire** :

```markdown
## Lighthouse CI Report

| Category       | Before | After | Change |
| -------------- | ------ | ----- | ------ |
| Performance    | 92     | 94    | +2     |
| Accessibility  | 98     | 98    | 0      |
| Best Practices | 91     | 91    | 0      |
| SEO            | 96     | 97    | +1     |

### Details

- FCP improved from 1.8s to 1.6s (-200ms)
- LCP stable at 2.1s
- CLS: 0.05 (excellent)

[View full report →](https://storage.googleapis.com/...)
```

---

## 📈 Monitoring Production

### Métriques à Surveiller

**Real User Monitoring (RUM)** :

- Vercel Analytics (inclus gratuitement)
- Google Analytics 4 (optionnel)

**Métriques clés** :

```
P75 FCP: <2.5s
P75 LCP: <3s
P75 CLS: <0.15
Bounce Rate: <40%
```

### Alertes

**Sentry Performance** :

- Alerte si P75 LCP >3s sur 1h
- Alerte si CLS >0.2 (mauvais UX)

**Vercel Monitoring** :

- Dashboard Analytics → Performance
- Alertes email si dégradation >10%

---

## 🎓 Bonnes Pratiques

### ✅ DO

1. **Lazy-load images** hors viewport initial
2. **Preload fonts** critiques (`<link rel="preload">`)
3. **Inline CSS critique** (<14KB)
4. **Code-split React** (client:idle vs client:load)
5. **Optimiser images** (WebP, tailles multiples)
6. **Tester sur slow 3G** (Lighthouse throttling)

### ❌ DON'T

1. ❌ Charger toutes les images en eager
2. ❌ Importer toutes les polices (1-2 max)
3. ❌ Utiliser `client:load` partout (préférer `:idle`)
4. ❌ Ignorer les warnings Lighthouse
5. ❌ Tester uniquement sur desktop
6. ❌ Déployer sans run Lighthouse CI

---

## 🔗 Ressources

- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Astro Performance Guide](https://docs.astro.build/en/guides/performance/)
- [Vercel Analytics](https://vercel.com/analytics)

---

**Auteur** : GitHub Copilot  
**Epic** : 6.1 - Performance Testing (EF-067)  
**Date** : 1 février 2026  
**Status** : ✅ Ready for Production
