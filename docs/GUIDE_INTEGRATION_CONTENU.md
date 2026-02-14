# 📝 Guide d'Intégration de Votre Contenu Réel

> **Quand l'utiliser** : Une fois M7 Frontend terminé (ou dès maintenant si vous êtes pressé)  
> **Durée estimée** : 2-4 heures pour tout personnaliser

---

## 🎯 Vue d'Ensemble

Ce guide vous aide à remplacer le contenu de démonstration par **VOS vraies informations** :

- Votre parcours professionnel
- Vos projets réels
- Vos certifications
- Vos compétences
- Vos coordonnées

---

## 1️⃣ Page About (À Propos)

### Fichiers à modifier

- **FR** : `src/pages/fr/about.astro`
- **EN** : `src/pages/en/about.astro`

### Sections à personnaliser

#### A. Stats Animés (lignes 10-20)

```javascript
const stats = [
  { value: 5, suffix: '+', label: "Années d'expérience" }, // 👈 Changez avec vos années
  { value: 30, suffix: '+', label: 'Projets livrés' }, // 👈 Nombre de vos projets
  { value: 15, suffix: '+', label: 'Technologies maîtrisées' }, // 👈 Comptez vos techs
  { value: 100, suffix: '%', label: 'Satisfaction client' }, // 👈 Gardez ou changez
];
```

#### B. Terminal (lignes 25-45)

```javascript
const terminalLines = [
  { type: 'command', content: 'whoami' },
  { type: 'output', content: 'Esdras GBEDOZIN - Ingénieur Full-Stack' }, // 👈 Votre titre
  { type: 'command', content: 'cat experience.txt' },
  { type: 'output', content: '5+ ans en développement web moderne' }, // 👈 Votre expérience
  { type: 'command', content: 'ls expertise/' },
  { type: 'output', content: 'Cloud Architecture | DevOps | React | Node.js' }, // 👈 Vos expertises
  // Ajoutez autant de lignes que vous voulez !
];
```

#### C. Timeline (lignes 50-80)

```javascript
const timelineItems = [
  {
    date: '2024', // 👈 Année
    type: 'certification', // 👈 Type: work/education/achievement/certification
    title: 'Azure Solutions Architect Expert', // 👈 Titre
    description: 'Certification Microsoft AZ-305', // 👈 Description
  },
  {
    date: '2023-2024',
    type: 'work',
    title: 'Lead Developer - TechCorp', // 👈 Votre poste + entreprise
    description: 'Architecture microservices sur Azure',
  },
  // Ajoutez vos expériences réelles
];
```

**Types disponibles** :

- `work` : Expérience professionnelle (violet)
- `education` : Formation (bleu)
- `achievement` : Réalisation (vert)
- `certification` : Certification (jaune)

---

## 2️⃣ Page Projects (Projets)

### Fichiers à modifier

- **Content** : `src/content/projects/*.mdx` (créez vos fichiers)
- **Config** : `src/content/config.ts` (définition du schéma)

### Créer un nouveau projet

1. **Créez un fichier MDX** : `src/content/projects/mon-projet.fr.mdx`

```mdx
---
title: 'Mon Projet E-commerce'
slug: 'mon-projet-ecommerce'
description: 'Plateforme e-commerce full-stack avec paiement Stripe'
category: 'fullstack'
status: 'completed'
featured: true
startDate: 2023-06-01
endDate: 2024-01-15
technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker']
links:
  - type: 'github'
    url: 'https://github.com/votreusername/projet'
  - type: 'live'
    url: 'https://monprojet.com'
image: '/images/projects/mon-projet.jpg' # Ajoutez votre image dans public/images/projects/
---

# Mon Projet E-commerce

## Contexte

Développement d'une plateforme e-commerce moderne...

## Technologies utilisées

- **Frontend** : React 18, TypeScript
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL

## Résultats

- 1000+ utilisateurs actifs
- 99.9% uptime
```

2. **Version anglaise** : Dupliquez en `mon-projet.en.mdx`

### Catégories disponibles

```typescript
category: 'frontend' | 'backend' | 'fullstack' | 'devops' | 'mobile' | 'other';
```

### Statuts disponibles

```typescript
status: 'in-progress' | 'completed' | 'archived';
```

---

## 3️⃣ Page Skills (Compétences)

### Fichiers à modifier

- **FR** : `src/pages/fr/skills/index.astro`
- **EN** : `src/pages/en/skills/index.astro`

### Modifier vos compétences (lignes 35-120)

```astro
{/* Langages */}
<ScrollReveal delay={100} client:idle>
  <div class="glass-effect rounded-xl p-8">
    <h2>Langages de programmation</h2>
    <div class="flex flex-wrap gap-3">
      <SkillBadge variant="primary">TypeScript</SkillBadge>
      {/* 👈 Gardez ou remplacez */}
      <SkillBadge variant="primary">JavaScript</SkillBadge>
      <SkillBadge variant="primary">Python</SkillBadge>
      <SkillBadge variant="secondary">Rust</SkillBadge>
      {/* 👈 Ajoutez les vôtres */}
      {/* Ajoutez autant de badges que nécessaire */}
    </div>
  </div>
</ScrollReveal>
```

**Variants disponibles** :

- `primary` : Compétences principales (bleu)
- `secondary` : Compétences secondaires (gris)
- `success` : Méthodologies (vert)

**Logos automatiques** :

Les technologies suivantes ont des logos automatiques :

- **Langages** : JavaScript, TypeScript, Python, Java, C#, SQL, PHP, Go, Rust
- **Frameworks** : React, Astro, Next.js, Node.js, Express, Spring Boot, Angular, Vue.js, Django, Flask
- **Cloud** : Azure, AWS, Vercel, Docker, Kubernetes, GitHub Actions, Terraform
- **Databases** : PostgreSQL, MongoDB, Redis, SQL Server

Pour ajouter d'autres logos, modifiez `src/data/techIcons.ts`.

---

## 4️⃣ Page Certifications

### Fichiers à modifier

- **FR** : `src/pages/fr/certifications/index.astro`
- **EN** : `src/pages/en/certifications/index.astro`

### Modifier vos certifications (lignes 28-70)

```astro
<ScrollReveal delay={100} client:load>
  <article class="glass-effect card-elevated rounded-xl p-6 h-full">
    <div class="flex items-start justify-between mb-4">
      <h3>Azure Solutions Architect Expert</h3>
      {/* 👈 Nom certification */}
      <Badge variant="success">Actif</Badge>
      {/* variant: success/warning/error */}
    </div>
    <p class="text-sm text-neutral-400 mb-2 font-semibold">Microsoft</p>
    {/* 👈 Organisme */}
    <p class="text-sm text-neutral-300 mb-4">Obtenue : Janvier 2024</p>
    {/* 👈 Date */}
    <p class="text-sm text-primary-400 font-mono">ID : AZ-305-2024-001</p>
    {/* 👈 ID */}
  </article>
</ScrollReveal>
```

**Variants Badge** :

- `success` : Actif (vert)
- `warning` : Expire bientôt (jaune)
- `error` : Expiré (rouge)

---

## 5️⃣ Page Contact

### Fichier à modifier

`src/components/ContactForm.tsx` (lignes 15-30)

### Configurer l'email de destination

```typescript
// Dans le fichier .env
RESEND_API_KEY=re_xxxxx              # Votre clé API Resend
RESEND_TO_EMAIL=votre@email.com      # 👈 Votre email
RESEND_FROM_EMAIL=noreply@votredomaine.com
```

### Cloudflare Turnstile (Anti-spam)

```typescript
// .env
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...  # 👈 Votre site key Turnstile
TURNSTILE_SECRET_KEY=0x4AAAAAAA...       # 👈 Votre secret key
```

**Obtenir vos clés** :

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sections → Turnstile
3. Créez un nouveau site
4. Copiez Site Key et Secret Key

---

## 6️⃣ Page Home (Accueil)

### Fichiers à modifier

- **FR** : `src/pages/fr/index.astro`
- **EN** : `src/pages/index.astro`

### Hero Section (lignes 10-30)

```astro
<Hero
  client:idle
  title="Esdras GBEDOZIN"
  {/* 👈 Votre nom */}
  tagline="Ingénieur Full-Stack & Architecte Cloud"
  {/* 👈 Votre titre */}
  description="Passionné par les architectures scalables et les solutions cloud innovantes"
  {/* 👈 Votre bio courte */}
  primaryCta={{
    label: 'Voir mes projets',
    href: '/fr/projects',
  }}
  secondaryCta={{
    label: 'Me contacter',
    href: '/fr/contact',
  }}
/>
```

---

## 7️⃣ Images & Assets

### Structure des dossiers

```
public/
  images/
    projects/          # 👈 Vos screenshots de projets
      projet-1.jpg
      projet-2.webp
    certifications/    # 👈 Logos de certifications (optionnel)
    avatar.jpg         # 👈 Votre photo de profil
```

### Optimisation recommandée

- **Format** : WebP ou AVIF (meilleur que JPG/PNG)
- **Taille max** : 1920px de largeur
- **Poids** : <200KB par image
- **Outils** : [Squoosh](https://squoosh.app/) ou [TinyPNG](https://tinypng.com/)

---

## 8️⃣ SEO & Métadonnées

### Fichier Layout (src/layouts/Layout.astro)

```astro
<head>
  <meta name="description" content="Portfolio Esdras GBEDOZIN - Développeur Full-Stack" />
  {/* 👈 Changez */}
  <meta name="author" content="Esdras GBEDOZIN" />
  {/* 👈 Votre nom */}

  {/* Open Graph */}
  <meta property="og:title" content="Portfolio Esdras GBEDOZIN" />
  {/* 👈 Changez */}
  <meta property="og:description" content="Développeur Full-Stack spécialisé en Cloud" />
  <meta property="og:image" content="/images/og-image.jpg" />
  {/* 👈 Image 1200x630px */}

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@votretwitter" />
  {/* 👈 Votre Twitter */}
</head>
```

---

## 9️⃣ Footer & Réseaux Sociaux

### Fichier à modifier

`src/components/Footer.astro` (lignes 10-30)

```astro
<footer>
  <div class="social-links">
    <a href="https://github.com/votreusername" aria-label="GitHub">
      {/* 👈 Votre GitHub */}
      <Github size={20} />
    </a>
    <a href="https://linkedin.com/in/votre-profil" aria-label="LinkedIn">
      {/* 👈 Votre LinkedIn */}
      <Linkedin size={20} />
    </a>
    <a href="mailto:votre@email.com" aria-label="Email">
      {/* 👈 Votre email */}
      <Mail size={20} />
    </a>
  </div>

  <p>&copy; {new Date().getFullYear()} Esdras GBEDOZIN. Tous droits réservés.</p>
  {/* 👈 Votre nom */}
</footer>
```

---

## 🔟 Traductions i18n

### Fichiers à modifier

- **FR** : `src/i18n/fr.json`
- **EN** : `src/i18n/en.json`

### Exemple

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À Propos",
    "projects": "Projets",
    "skills": "Compétences",
    "certifications": "Certifications",
    "contact": "Contact"
  },
  "footer": {
    "copyright": "© {year} Esdras GBEDOZIN. Tous droits réservés.", // 👈 Changez
    "madeWith": "Fait avec ❤️ et Astro"
  }
}
```

---

## ✅ Checklist Finale

Avant de déployer, vérifiez :

- [ ] Toutes les pages About, Projects, Skills, Certifications, Contact sont personnalisées
- [ ] Vos images sont ajoutées dans `public/images/`
- [ ] Le fichier `.env` est configuré (Resend, Turnstile)
- [ ] Les traductions FR/EN sont cohérentes
- [ ] Le Footer a vos liens sociaux
- [ ] Le SEO est personnalisé (title, description, OG tags)
- [ ] Testez le formulaire de contact (envoi d'email)
- [ ] Vérifiez que les logos de technologies s'affichent correctement

---

## 🚀 Déploiement

Une fois le contenu intégré :

```bash
# Build production
pnpm build

# Preview du build
pnpm preview

# Déployer sur Vercel (si configuré)
vercel --prod
```

---

## 📞 Besoin d'Aide ?

Si vous avez des questions lors de l'intégration :

1. Relisez les docs dans `docs/`
2. Consultez `ROADMAP_STATUS.md` pour l'état du projet
3. Vérifiez les exemples de code existants dans `src/pages/`

**Bon courage ! 🎨**
