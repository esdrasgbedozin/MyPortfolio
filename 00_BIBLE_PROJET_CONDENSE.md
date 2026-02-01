# 00_BIBLE_PROJET.md

> **Document de Fondation Fonctionnelle**  
> Projet : Portfolio Professionnel d'Ingénieur Informatique  
> Date : 17 janvier 2026  
> Version : 1.2 - Version Condensée

---

## 1. Vision & Objectifs

### Proposition de Valeur

**"Le portfolio est lui-même la preuve de mes compétences techniques"**

Portfolio professionnel de nouvelle génération où l'architecture, la performance et le code démontrent l'expertise technique par l'exemple. Interface moderne bilingue (FR/EN) avec contenu structuré : projets, certifications, compétences.

### KPIs de Succès V1

| KPI                    | Objectif                    |
| ---------------------- | --------------------------- |
| **Performance**        | Lighthouse >90/100          |
| **Engagement**         | >60% consultent 3+ sections |
| **Temps sur site**     | >3 minutes                  |
| **Conversion contact** | >5%                         |
| **Accessibilité**      | WCAG 2.1 AA                 |
| **Chargement**         | <2s (FCP)                   |

---

## 2. Acteurs & Personas

### Recruteur Tech / Hiring Manager

**Contexte** : Évalue 20-30 profils/jour, consultation rapide (mobile), analyse technique approfondie  
**Besoins** : Compétences clés visibles, preuves concrètes (GitHub, démos), niveau technique clair, contact facile  
**Objectif** : Qualifier en <3 minutes

### Collaborateur / Développeur

**Contexte** : Cherche partenariat, évalue style de travail  
**Besoins** : Domaines d'expertise, méthodologies, repos open-source, profils sociaux  
**Objectif** : Identifier synergies techniques

### Admin (Propriétaire)

**Contexte** : Ingénieur informatique, mise à jour mensuelle  
**Besoins** : Ajout/modification simple de contenu, maintenance qualité, évolutivité  
**Objectif** : Portfolio à jour avec effort minimal

---

## 3. Dictionnaire du Domaine (Ubiquitous Language)

> Vocabulaire strict utilisé partout (code, doc, conversations)

### Entités Principales

**Portfolio** : Vitrine numérique complète (profil + projets + certifications + compétences)

**Projet** : Réalisation technique aboutie et démontrable

- Obligatoire : Titre, Description, Stack, Période, Statut
- Optionnel : Démo, Repository, Screenshots, Vidéo

**Certification** : Attestation officielle d'expertise

- Obligatoire : Nom, Organisme, Date, Identifiant
- Optionnel : Expiration, Badge, Lien vérification

**Compétence** : Capacité technique maîtrisée

- Catégories : Langage, Framework, Outil, Méthodologie
- Niveaux : Débutant, Intermédiaire, Avancé, Expert

**Profil** : Identité professionnelle (nom, titre, bio, photo, liens)

**Contact** : Action de communication visiteur → propriétaire

### Statuts & États

**Projet** : En Production | En Développement | Archivé | Prototype  
**Visibilité** : Public | Privé | Sur Demande

---

## 4. Scope Fonctionnel

### 4.1 Épics V1 (IN SCOPE)

**Epic 1 : Présentation & Identité**  
Page d'accueil professionnelle, photo, bio, liens sociaux (GitHub, LinkedIn)

**Epic 2 : Catalogue de Projets**  
Liste avec filtres (techno/catégorie), détails projet (description, stack, démo, repo), screenshots/vidéos

**Epic 3 : Certifications**  
Liste avec détails, badges numériques, liens de vérification

**Epic 4 : Compétences**  
Liste par catégorie, indication niveau de maîtrise

**Epic 5 : Contact**  
Formulaire validé (client + serveur), confirmation envoi, anti-spam (Turnstile)

**Epic 6 : Performance & UX**  
Responsive mobile-first, animations fluides, WCAG 2.1 AA, Lighthouse >90, mode sombre (détection auto)

**Epic 7 : Internationalisation**  
Bilingue FR/EN, détection auto, sélecteur manuel, URLs localisées, SEO multilingue (hreflang)

### 4.2 OUT OF SCOPE V1

❌ Blog, commentaires, RSS  
❌ Likes/partages sociaux  
❌ Dashboard analytics avancé, heatmaps  
❌ Authentification externe  
❌ Playground code, démos live, terminal  
❌ Marketplace/paiement

---

## 5. Stack Technique & Décisions

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend:    Astro (SSG + Islands)                         │
│  UI:          React (interactivité uniquement)              │
│  Styling:     Tailwind CSS + Design Tokens                  │
│  Language:    TypeScript (Strict Mode)                      │
│  Content:     Markdown/MDX (Git-versioned)                  │
│  i18n:        Astro i18n / astro-i18next (FR/EN)            │
│  Hosting:     Vercel (Edge + CDN)                           │
│  Analytics:   Plausible (RGPD-compliant)                    │
│  Contact:     Serverless Functions + Resend/SendGrid        │
│  Anti-Spam:   Cloudflare Turnstile                          │
└─────────────────────────────────────────────────────────────┘
```

### Architecture de Contenu i18n

**Format : `{slug}.{locale}.{extension}` (Standard industrie)**

```
content/
├── projects/
│   ├── portfolio-website.fr.mdx
│   ├── portfolio-website.en.mdx
│   ├── ecommerce-api.fr.mdx
│   └── ecommerce-api.en.mdx
├── certifications/
│   ├── aws-solutions-architect.fr.md
│   └── aws-solutions-architect.en.md
├── skills/
│   ├── skills.fr.json
│   └── skills.en.json
└── profile/
    ├── about.fr.mdx
    └── about.en.mdx

src/i18n/
├── fr.json    # Traductions UI (boutons, labels)
└── en.json
```

**Avantages** : Pas de duplication de structure, détection facile des traductions manquantes, Git-friendly, standard Next.js/Gatsby/Hugo/Astro

### Design System

**Style** : Minimalisme Technique (Clean Tech) - "Form follows function"

**Palette** :

- Dark Mode First (Slate/Gray Tailwind)
- Couleur d'accentuation unique (Bleu/Indigo/Vert émeraude)
- Contraste WCAG 2.1 AA

**Typographie** :

- Corps : Inter ou Geist Sans
- Technique : JetBrains Mono (monospace)

**Layout** : Bento Grid, whitespace généreux, mobile-first

**Animations** : Micro-interactions prioritaires, pas de parallax, support `prefers-reduced-motion`

### Contraintes Non-Négociables

✅ Lighthouse >90 (toutes catégories)  
✅ WCAG 2.1 AA + tests utilisateurs  
✅ SEO optimisé (meta, sitemap, structured data)  
✅ RGPD conforme (Plausible)  
✅ Responsive mobile-first  
✅ Mode sombre (détection système)  
✅ Bilingue FR/EN (URLs localisées)

### Données Clés

| Critère             | Valeur                         |
| ------------------- | ------------------------------ |
| **Contenu initial** | 15 projets max, 20 certifs max |
| **Mise à jour**     | Mensuelle (rebuild ~1-2 min)   |
| **Hébergement**     | Vercel (gratuit)               |
| **Langues**         | FR/EN dès V1                   |

---

## 6. Roadmap V2

**Priorités identifiées** :

1. **Extension i18n** : Langues additionnelles (ES, DE, PT), traduction collaborative, DeepL API
2. **Blog** : Articles techniques, tags/catégories, RSS
3. **Analytics avancé** : Dashboard personnalisé, funnels, heatmaps

**Vision long terme** : Plateforme éducative, système rendez-vous, études de cas détaillées

---

**Document rédigé par** : Esdras GBEDOZIN - Ingénieur Informatique  
**Pour** : Esdras GBEDOZIN - Ingénieur Informatique  
**Date** : 17 janvier 2026 (v1.2)  
**Statut** : ✅ **VALIDÉ - Document de Référence**
