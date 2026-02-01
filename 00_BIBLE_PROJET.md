# 00_BIBLE_PROJET.md

> **Document de Fondation Fonctionnelle**  
> Projet : Portfolio Professionnel d'Ingénieur Informatique  
> Date : 17 janvier 2026  
> Version : 1.1 - Décisions Validées

---

## 1. Vision & Objectifs (Elevator Pitch)

### 1.1 Problème Résolu

Les portfolios professionnels traditionnels souffrent de plusieurs limitations critiques :

- **Statisme** : Présentations figées qui ne reflètent pas la dynamique et l'évolution des compétences
- **Manque de différenciation** : Portfolios génériques qui ne permettent pas de se démarquer dans un marché concurrentiel
- **Preuve limitée** : Affichage de réalisations sans démonstration concrète des compétences techniques
- **Expérience utilisateur médiocre** : Navigation peu intuitive, performance faible, design daté
- **Crédibilité insuffisante** : Difficulté à prouver l'expertise technique de manière tangible

### 1.2 Solution Proposée

Un portfolio professionnel de nouvelle génération qui sert à la fois de vitrine et de démonstration technique :

- Interface moderne, performante et professionnelle
- Architecture technique exemplaire qui démontre les compétences par l'exemple
- Expérience utilisateur optimisée pour maximiser l'engagement des visiteurs cibles
- Système de présentation structuré : projets, certifications, réalisations, compétences
- Évolutivité garantie pour accompagner la progression de carrière

### 1.3 Proposition de Valeur Unique

**"Le portfolio est lui-même la preuve de mes compétences techniques"**

- Le code source et l'architecture démontrent la maîtrise technique
- La performance et l'UX reflètent l'attention aux détails et aux bonnes pratiques
- L'évolutivité du système prouve la capacité à concevoir des solutions pérennes
- Le professionnalisme du rendu inspire confiance immédiatement

### 1.4 KPIs de Succès

**Critères de succès mesurables pour la V1 (MVP) :**

| KPI                            | Objectif                                             | Méthode de Mesure            |
| ------------------------------ | ---------------------------------------------------- | ---------------------------- |
| **Taux d'engagement**          | >60% des visiteurs consultent au moins 3 sections    | Analytics                    |
| **Temps moyen sur le site**    | >3 minutes                                           | Analytics                    |
| **Performance technique**      | Score Lighthouse >90/100 (toutes catégories)         | Lighthouse CI                |
| **Taux de conversion contact** | >5% des visiteurs utilisent le formulaire de contact | Analytics + Backend          |
| **Accessibilité**              | Conformité WCAG 2.1 niveau AA                        | Audits automatisés + manuels |
| **Taux de rebond**             | <40%                                                 | Analytics                    |
| **Temps de chargement**        | <2s (First Contentful Paint)                         | WebPageTest / Lighthouse     |

---

## 2. Acteurs & Personas

### 2.1 Recruteur Tech Senior

**Profil :**

- Expérience : 5-10 ans dans le recrutement IT
- Contexte : Examine 20-30 profils par jour
- Environnement : Consultation rapide, souvent sur mobile

**Besoins :**

- Identifier rapidement les compétences clés
- Valider l'expérience avec des preuves concrètes
- Évaluer le niveau technique via les réalisations
- Accéder facilement aux informations de contact

**Frustrations :**

- Sites trop lents ou mal optimisés sur mobile
- Informations techniques difficiles à trouver
- Manque de preuves concrètes (GitHub, démos, etc.)
- Absence de certifications ou formations visibles

**Objectifs :**

- Qualifier le candidat en <3 minutes
- Obtenir une vision claire du niveau d'expertise
- Identifier la correspondance avec le poste

---

### 2.2 Hiring Manager / Lead Tech

**Profil :**

- Responsable technique cherchant à renforcer son équipe
- Évalue la capacité à s'intégrer techniquement et culturellement
- Analyse approfondie du background technique

**Besoins :**

- Examiner la qualité du code (si accessible)
- Comprendre l'approche architecturale
- Évaluer la diversité des compétences techniques
- Identifier les projets pertinents pour le poste

**Frustrations :**

- Portfolios superficiels sans profondeur technique
- Impossibilité de voir le code source ou les repositories
- Descriptions de projets vagues ou marketées
- Manque de détails sur les technologies utilisées

**Objectifs :**

- Évaluer la compatibilité technique avec la stack
- Anticiper la courbe d'apprentissage
- Valider l'autonomie et la maturité technique

---

### 2.3 Pair / Collaborateur Potentiel

**Profil :**

- Développeur cherchant à collaborer sur des projets
- Évalue les compétences pour un partenariat
- S'intéresse à la communauté et aux contributions open-source

**Besoins :**

- Découvrir les domaines d'expertise
- Évaluer le style de travail et les méthodologies
- Identifier les projets collaboratifs potentiels
- Accéder aux profils sociaux (GitHub, LinkedIn, Twitter)

**Frustrations :**

- Absence de liens vers les repositories
- Manque d'informations sur les contributions open-source
- Pas de moyens de contact direct

**Objectifs :**

- Identifier des synergies techniques
- Initier une collaboration
- Élargir son réseau professionnel

---

### 2.4 Visiteur Curieux / Junior

**Profil :**

- Développeur junior ou étudiant
- Cherche l'inspiration et des références
- S'intéresse aux parcours et aux technologies

**Besoins :**

- S'inspirer pour son propre portfolio
- Découvrir des technologies et frameworks modernes
- Comprendre les parcours de carrière possibles
- Apprendre de l'expérience d'un senior

**Frustrations :**

- Portfolios trop complexes à comprendre
- Manque de contexte sur les projets
- Absence d'informations sur le parcours

**Objectifs :**

- Trouver l'inspiration
- Identifier des technologies à apprendre
- Comprendre les attentes du marché

---

### 2.5 Admin (Propriétaire du Portfolio)

**Profil :**

- Ingénieur informatique, propriétaire du portfolio
- Besoin de maintenir et faire évoluer le contenu
- Volonté d'ajouter de nouvelles réalisations facilement

**Besoins :**

- Ajouter/modifier des projets, certifications, compétences
- Mettre à jour les informations personnelles
- Suivre les performances du site (analytics)
- Maintenir la qualité technique du code

**Frustrations :**

- Systèmes complexes nécessitant des déploiements lourds
- Processus d'ajout de contenu fastidieux
- Difficultés à maintenir la cohérence visuelle

**Objectifs :**

- Maintenir le portfolio à jour avec un effort minimal
- Garantir la performance et la qualité
- Faire évoluer le portfolio avec sa carrière

---

## 3. Dictionnaire du Domaine (Ubiquitous Language)

> **Règle d'or** : Ce vocabulaire doit être utilisé de manière stricte et cohérente dans tout le projet (code, documentation, conversations).

### 3.1 Entités Métier Principales

#### **Portfolio**

- **Définition** : Vitrine numérique professionnelle complète présentant l'identité, les compétences, les réalisations et les accomplissements d'un professionnel de l'informatique.
- **Synonymes interdits** : Site web, CV en ligne
- **Composition** : Profil + Collection de Projets + Collection de Certifications + Compétences + Moyens de Contact

#### **Projet**

- **Définition** : Réalisation technique concrète, aboutie et démontrable, ayant une durée de vie définie, un objectif clair et un résultat tangible.
- **Caractéristiques obligatoires** : Titre, Description, Stack technique, Période de réalisation, Statut
- **Caractéristiques optionnelles** : Lien démo, Lien repository, Captures d'écran, Vidéo, Metrics
- **Exclusions** : Ne pas confondre avec "Expérience Professionnelle" (qui peut contenir plusieurs projets)
- **Exemples** : Application web e-commerce, API REST, Outil CLI, Library open-source

#### **Certification**

- **Définition** : Attestation officielle délivrée par un organisme reconnu validant une compétence ou une expertise spécifique.
- **Caractéristiques obligatoires** : Nom, Organisme émetteur, Date d'obtention, Identifiant unique (si applicable)
- **Caractéristiques optionnelles** : Date d'expiration, Badge numérique, Lien de vérification, Score/niveau
- **Exclusions** : Ne pas confondre avec "Formation" (processus d'apprentissage) ou "Diplôme" (titre académique)
- **Exemples** : AWS Certified Solutions Architect, Kubernetes CKA, Microsoft Azure Developer Associate

#### **Compétence (Skill)**

- **Définition** : Capacité technique maîtrisée et mise en œuvre dans un contexte professionnel ou projet personnel.
- **Caractéristiques obligatoires** : Nom, Catégorie, Niveau de maîtrise
- **Catégories** : Langage de programmation, Framework/Library, Outil/Plateforme, Méthodologie, Soft skill
- **Niveaux de maîtrise** : Débutant, Intermédiaire, Avancé, Expert
- **Exclusions** : Ne pas confondre avec "Technologie" (terme générique) ou "Outil" (terme plus restrictif)

#### **Stack Technique**

- **Définition** : Ensemble cohérent de technologies (langages, frameworks, outils, plateformes) utilisées pour réaliser un Projet spécifique.
- **Composition** : Frontend + Backend + Base de données + Infrastructure + Outils de développement
- **Usage** : Toujours associée à un Projet, jamais isolée

#### **Profil**

- **Définition** : Identité professionnelle du propriétaire du Portfolio, incluant informations personnelles, présentation, et éléments de contact.
- **Caractéristiques obligatoires** : Nom, Titre professionnel, Description courte, Photo professionnelle, Liens sociaux
- **Caractéristiques optionnelles** : Bio longue, Localisation, Disponibilité, Centres d'intérêt

#### **Contact**

- **Définition** : Action initiée par un visiteur pour entrer en communication avec le propriétaire du Portfolio.
- **Caractéristiques obligatoires** : Nom, Email, Message
- **Caractéristiques optionnelles** : Entreprise, Téléphone, Objet, Type de demande
- **Workflow** : Soumission → Validation → Envoi → Confirmation

### 3.2 Concepts Transversaux

#### **Visiteur**

- **Définition** : Toute personne accédant au Portfolio, authentifiée ou non.
- **Types** : Anonyme, Identifié (via analytics), Recruteur, Pair, etc.
- **Note** : Ne pas confondre avec "Utilisateur" (terme réservé pour les systèmes avec authentification)

#### **Réalisation**

- **Définition** : Terme générique englobant tout accomplissement professionnel (Projet, Contribution open-source, Publication, Conférence).
- **Usage** : Utilisé dans les contextes où la distinction exacte n'est pas nécessaire

#### **Contribution**

- **Définition** : Participation à un projet open-source, qu'elle soit ponctuelle ou régulière.
- **Caractéristiques** : Repository, Type (code, documentation, review), Période, Description

#### **Catégorie de Projet**

- **Définition** : Classification fonctionnelle d'un Projet selon son domaine d'application.
- **Exemples** : Web Application, Mobile App, CLI Tool, Library/Framework, API/Microservice, DevOps/Infrastructure, Data Engineering, IA/ML

### 3.3 États et Statuts

#### **Statut de Projet**

- **En Production** : Déployé et accessible publiquement
- **En Développement** : Travail en cours, non finalisé
- **Archivé** : Complété mais plus maintenu
- **Prototype** : Preuve de concept, non destiné à la production

#### **Niveau de Visibilité**

- **Public** : Visible par tous les visiteurs
- **Privé** : Masqué (pour préparation ou projets confidentiels)
- **Sur Demande** : Informations complètes accessibles uniquement via contact

### 3.4 Actions Métier

#### **Publier un Projet**

- Rendre un Projet visible sur le Portfolio
- Pré-requis : Toutes les informations obligatoires renseignées

#### **Archiver un Projet**

- Marquer un Projet comme non actif tout en le gardant visible

#### **Soumettre un Contact**

- Envoyer un message via le formulaire de contact

#### **Filtrer les Projets**

- Appliquer des critères de sélection sur la liste des Projets (par technologie, catégorie, statut)

---

## 4. Scope Fonctionnel (Macro)

### 4.1 Épics & Fonctionnalités Macro

#### **Epic 1 : Présentation & Identité Professionnelle**

**Objectif** : Permettre au visiteur de découvrir qui est le propriétaire du portfolio

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux voir une présentation claire et professionnelle pour comprendre rapidement qui est cette personne
- En tant que visiteur, je veux voir une photo professionnelle pour humaniser le contact
- En tant que visiteur, je veux accéder aux liens sociaux (GitHub, LinkedIn, etc.) pour approfondir ma recherche
- En tant que visiteur, je veux voir un titre/rôle professionnel clair pour identifier l'expertise principale

---

#### **Epic 2 : Catalogue de Projets**

**Objectif** : Présenter les réalisations techniques de manière structurée et engageante

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux voir une liste de projets avec aperçu pour explorer les réalisations
- En tant que visiteur, je veux filtrer les projets par technologie/catégorie pour trouver ce qui m'intéresse
- En tant que visiteur, je veux voir les détails d'un projet (description, stack, démo, repo) pour évaluer la complexité
- En tant que visiteur, je veux voir des captures d'écran ou vidéos pour visualiser le résultat
- En tant que admin, je veux pouvoir ajouter/modifier un projet facilement pour maintenir le portfolio à jour

**User Stories (OUT OF SCOPE V1)** :

- Système de likes ou de commentaires sur les projets
- Recherche full-text avancée
- Export de portfolio au format PDF

---

#### **Epic 3 : Certifications & Accomplissements**

**Objectif** : Valider l'expertise par des certifications officielles et accomplissements reconnus

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux voir la liste des certifications obtenues pour valider l'expertise
- En tant que visiteur, je veux voir les détails d'une certification (date, organisme, badge) pour vérifier son authenticité
- En tant que visiteur, je veux accéder aux liens de vérification pour confirmer la validité

**User Stories (OUT OF SCOPE V1)** :

- Timeline interactive des certifications
- Système de badges gamifiés
- Statistiques de progression

---

#### **Epic 4 : Compétences Techniques**

**Objectif** : Présenter l'éventail des compétences techniques maîtrisées

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux voir la liste des compétences organisées par catégorie pour comprendre l'éventail technique
- En tant que visiteur, je veux voir le niveau de maîtrise pour chaque compétence pour évaluer l'expertise
- En tant que admin, je veux pouvoir ajouter/modifier des compétences facilement

**User Stories (OUT OF SCOPE V1)** :

- Graphiques radar ou visualisations avancées
- Système d'auto-évaluation dynamique
- Endorsements de compétences par des tiers

---

#### **Epic 5 : Contact & Networking**

**Objectif** : Faciliter la prise de contact professionnelle

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux remplir un formulaire de contact pour entrer en relation
- En tant que visiteur, je veux recevoir une confirmation d'envoi pour être rassuré
- En tant que admin, je veux recevoir les messages de contact pour répondre aux opportunités
- En tant que visiteur, je veux voir les informations de contact alternatives (email, LinkedIn) pour choisir mon canal

**User Stories (OUT OF SCOPE V1)** :

- Système de prise de rendez-vous intégré (Calendly)
- Chat en temps réel
- Système de ticketing

---

#### **Epic 6 : Performance & Expérience Utilisateur**

**Objectif** : Garantir une expérience fluide, rapide et accessible

**User Stories (IN SCOPE V1)** :

- En tant que visiteur, je veux un site qui se charge rapidement (<2s) pour ne pas perdre de temps
- En tant que visiteur mobile, je veux une interface adaptée à mon écran pour naviguer confortablement
- En tant que visiteur avec déficience visuelle, je veux un site accessible pour pouvoir consulter le contenu
- En tant que visiteur, je veux une navigation intuitive pour trouver rapidement l'information
- En tant que visiteur, je veux des animations fluides et professionnelles pour une expérience agréable

**Requirements techniques IN SCOPE V1** :

- Responsive design (mobile-first)
- Score Lighthouse >90 (Performance, Accessibilité, Best Practices, SEO)
- Conformité WCAG 2.1 niveau AA
- Support navigateurs modernes (dernières versions Chrome, Firefox, Safari, Edge)

---

#### **Epic 7 : Internationalisation (i18n)**

**Objectif** : Rendre le portfolio accessible à une audience internationale dès le lancement

**User Stories (IN SCOPE V1)** :

- En tant que visiteur francophone, je veux consulter le portfolio en français pour comprendre le contenu dans ma langue
- En tant que visiteur anglophone, je veux consulter le portfolio en anglais pour accéder au contenu international
- En tant que visiteur, je veux que la langue soit détectée automatiquement selon mes préférences navigateur pour une expérience personnalisée
- En tant que visiteur, je veux pouvoir changer manuellement de langue via un sélecteur pour contrôler mon expérience
- En tant que admin, je veux gérer le contenu en français et en anglais via des fichiers séparés pour faciliter la maintenance

**Requirements techniques IN SCOPE V1** :

- Support Français (langue principale) et Anglais
- Détection automatique via `Accept-Language` header
- Sélecteur de langue visible et accessible
- URLs localisées : `/fr/projets`, `/en/projects`
- Fichiers de contenu séparés par langue (`content/fr/`, `content/en/`)
- Traductions des composants UI (boutons, labels, messages)
- SEO multilingue (hreflang tags)

**User Stories (OUT OF SCOPE V1)** :

- Support d'autres langues (espagnol, allemand, etc.)
- Traduction automatique
- Gestion collaborative des traductions
- Interface de traduction en ligne

---

### 4.2 IN SCOPE - V1 (MVP)

**Fonctionnalités essentielles pour le lancement** :

✅ **Présentation**

- Page d'accueil avec présentation professionnelle
- Photo et informations de contact
- Liens vers réseaux sociaux (GitHub, LinkedIn, etc.)

✅ **Projets**

- Liste de projets avec filtres par technologie/catégorie
- Page de détail par projet (description, stack, démo, repo)
- Captures d'écran et/ou vidéos

✅ **Certifications**

- Liste des certifications avec détails
- Badges numériques et liens de vérification

✅ **Compétences**

- Liste organisée par catégorie
- Indication du niveau de maîtrise

✅ **Contact**

- Formulaire de contact fonctionnel
- Validation côté client et serveur
- Confirmation d'envoi

✅ **Performance & UX**

- Design responsive (mobile-first)
- Animations et transitions fluides
- Accessibilité WCAG 2.1 AA
- SEO optimisé
- **Mode sombre/clair avec détection automatique des préférences système**
- Support `prefers-reduced-motion` pour accessibilité

✅ **Administration**

- Système de gestion de contenu basé sur fichiers Markdown/MDX versionnés
- Processus simple d'ajout/modification de projets, certifications, compétences
- Workflow "Docs as Code" (commit, PR, review, merge)

✅ **Internationalisation (i18n)**

- Support bilingue Français/Anglais dès le lancement
- Détection automatique de la langue (préférences navigateur)
- Sélecteur de langue manuel accessible
- URLs localisées par langue
- Contenu traduit : pages, projets, certifications, UI
- SEO multilingue (hreflang)

---

### 4.3 OUT OF SCOPE - V1 (MVP)

**Fonctionnalités reportées aux versions ultérieures** :

❌ **Blog & Content Management**

- Articles de blog
- Système de commentaires
- Flux RSS

❌ **Social & Community**

- Likes, partages, commentaires
- Intégration social login
- Système de recommandations

❌ **Advanced Analytics**

- Dashboard d'analytics avancé
- Heatmaps
- A/B testing

❌ **Authentification Externe**

- Login visiteurs
- Espace personnel
- Favoris

❌ **Interactivité Avancée**

- Playground de code interactif
- Démos live intégrées
- Terminal émulé

❌ **Marketplace/Services**

- Vente de services/formations
- Système de paiement
- Booking/calendrier

❌ **Advanced Features**

- Recherche full-text avancée
- Recommandations de projets similaires
- Système de tags avancé avec filtres multiples

---

## 5. Décisions Validées & Stack Technique

> **Section critique** : Réponses aux questions ouvertes et décisions architecturales confirmées.

### 5.1 Contenu & Stratégie de Données

#### **Volume de Contenu Initial (Q1)**

✅ **Décision validée** :

- **Projets** : Jusqu'à 15 projets au lancement (peut être inférieur)
- **Certifications** : Jusqu'à 20 certifications au lancement (peut être inférieur)

**Implications techniques** :

- Volume suffisamment faible pour éviter la pagination en V1
- Rendu statique de toutes les pages au build time (SSG)
- Pas de lazy loading complexe nécessaire
- Filtres côté client performants sans backend

#### **Source de Vérité du Contenu (Q2)**

✅ **Décision validée** : **Fichiers Markdown/MDX versionnés dans Git**

**Justification** :

- **Philosophie "Docs as Code"** : Le contenu suit le même cycle de vie que le code (commit, PR, review, merge) - preuve de compétence en soi
- **Performance** : Pas de base de données à requêter, pas d'API CMS externe qui ralentit le build
- **Sécurité** : Pas de base de données à pirater, surface d'attaque minimale
- **Simplicité** : Pas d'infrastructure additionnelle à maintenir
- **Coût** : Hébergement gratuit sur Vercel/Netlify

**Architecture de contenu i18n** :

**✅ Approche retenue : Fichiers avec suffixe de langue (Standard recommandé)**

```
content/
├── projects/
│   ├── portfolio-website.fr.mdx      # Version française
│   ├── portfolio-website.en.mdx      # Version anglaise
│   ├── ecommerce-api.fr.mdx
│   ├── ecommerce-api.en.mdx
│   └── shared/                       # Données partagées (optionnel)
│       └── portfolio-website.json    # Métadonnées communes (dates, tech stack)
├── certifications/
│   ├── aws-solutions-architect.fr.md
│   ├── aws-solutions-architect.en.md
│   └── ...
├── skills/
│   ├── skills.fr.json                # Compétences traduites
│   └── skills.en.json
└── profile/
    ├── about.fr.mdx
    └── about.en.mdx

src/i18n/
├── fr.json                           # Traductions UI (boutons, labels, messages)
└── en.json
```

**Justification de cette architecture** :

✅ **Évite la duplication de structure** : Un seul dossier `projects/`, pas de duplication `fr/projects/` et `en/projects/`

✅ **Facilite la détection des traductions manquantes** : Dans le même dossier, on voit immédiatement si `project-x.en.mdx` existe

✅ **Standard de l'industrie** : Utilisé par Next.js i18n, Gatsby, Hugo, et recommandé par Astro

✅ **Simplifie le versioning Git** : Les modifications sur un projet apparaissent côte à côte dans l'historique

✅ **Permet les métadonnées partagées** : Dossier `shared/` pour éviter la duplication des données techniques (dates, stack, liens GitHub)

**Exemple de métadonnées partagées** (`shared/portfolio-website.json`) :

```json
{
  "id": "portfolio-website",
  "slug": "portfolio-website",
  "publishedAt": "2026-01-15",
  "technologies": ["Astro", "React", "TypeScript", "Tailwind"],
  "github": "https://github.com/user/portfolio",
  "demo": "https://portfolio.dev",
  "featured": true,
  "category": "web-application"
}
```

**Frontmatter dans les fichiers traduits** (seul le contenu textuel) :

```yaml
---
title: 'Mon Portfolio Professionnel' # FR
description: 'Portfolio moderne en Astro'
---
```

**Alternative plus simple** (si pas de métadonnées partagées nécessaires) :

```
content/
├── projects/
│   ├── project-1.fr.mdx
│   ├── project-1.en.mdx
│   └── ...
```

Tout le frontmatter est dans chaque fichier (duplication acceptable pour la simplicité).

---

**🔄 Migration depuis l'ancienne structure** :

```bash
# Avant : content/fr/projects/project-1.mdx
# Après  : content/projects/project-1.fr.mdx
```

**Règles de nommage** :

- Format : `{slug}.{locale}.{extension}`
- Slug identique entre langues : `project-1.fr.mdx` ⟷ `project-1.en.mdx`
- Locale ISO 639-1 : `fr`, `en` (2 lettres minuscules)

```

#### **Fréquence de Mise à Jour (Q3)**
✅ **Décision validée** : **Occasionnelle (mensuelle ou fin de projet)**

**Conséquences techniques validées** :
- ✅ Confirme définitivement le choix du **SSG (Static Site Generation)**
- Chaque modification nécessite un rebuild complet (~1-2 minutes)
- Pour une mise à jour mensuelle, ce délai est parfaitement acceptable
- En échange : **performance de navigation imbattable** pour le visiteur
- Le SSR (Server-Side Rendering) serait inutilement coûteux et complexe

---

### 5.2 Identité Visuelle & Design System

#### **Style Visuel (Q4)**
✅ **Décision validée** : **"Minimalisme Technique" (Clean Tech)**

**Principes directeurs** :
- Le design s'efface au profit du contenu et de la rapidité
- Pas d'animations lourdes ou superflues
- **"Form follows function"**

**Palette de Couleurs** :
- **Focus** : **Dark Mode First** (préférence des recruteurs tech/CTO)
- **Couleurs de fond** : Neutres et froides (Slate/Gray de Tailwind)
- **Couleur d'accentuation** : Une seule couleur forte pour les CTA
  - Options : Bleu électrique, Indigo, ou Vert émeraude
- **Contraste** : Optimisé pour WCAG 2.1 AA minimum

**Typographie** :
- **Corps de texte** : Sans-serif moderne (Inter ou Geist Sans)
- **Éléments techniques** : Font Monospace (JetBrains Mono) pour rappeler l'univers du code
- **Hiérarchie** : Très marquée pour faciliter le scan visuel

**Layout** :
- **Bento Grid** : Présentation des projets de manière structurée et dense
- **Whitespace** : Espaces blancs généreux pour la lisibilité
- **Responsive** : Mobile-first, breakpoints Tailwind standards

**Inspirations** :
- Documentations techniques modernes (Vercel, Stripe Docs)
- Portfolios d'ingénieurs orientés contenu (Josh W. Comeau, Lee Robinson)
- ❌ **À éviter** : Sites "Awwwards" trop lourds et superficiels

**Contraintes** :
- Interface intuitive et responsive
- Attirante mais sans compromis sur la performance

#### **Animations & Interactions (Q5)**
✅ **Décision validée** : **Sobre et fonctionnel**

**Règle d'or** : L'animation ne doit **jamais** retarder l'accès au contenu

**✅ Priorité absolue : Micro-interactions**
- Feedback immédiat sur les interactions utilisateur
- Hover sur les boutons (scale, couleur, ombre)
- Focus sur les inputs (ring, couleur)
- Transitions d'état fluides (loading, success, error)
- Objectif : Sensation de réactivité ("Snappy")

**❌ À éviter absolument**
- Parallax lourd
- Scroll-triggered animations complexes
- Animations qui dégradent le CLS (Cumulative Layout Shift)

**♿ Accessibilité obligatoire**
- Support de `prefers-reduced-motion` pour utilisateurs sensibles au mouvement
- Animations désactivables automatiquement

---

### 5.3 Stack Technique Confirmée

#### **Architecture Applicative (Q6)**
✅ **Décision validée** : **Stack non négociable**

**Framework principal** : **Astro**
- Architecture "Islands" pour le JavaScript minimal
- Zero JS par défaut (hydratation partielle)
- Performance native exceptionnelle
- Compatible avec React pour les composants interactifs

**UI Components** : **React**
- Utilisé **uniquement** pour les composants nécessitant de l'interactivité
- Exemples : Formulaire de contact, Filtres de projets, Theme toggle

**Styling** : **Tailwind CSS**
- Utility-first pour rapidité de développement
- PurgeCSS intégré (CSS minimal en production)
- Design tokens pour cohérence du Design System

**Langage** : **TypeScript (Mode Strict)**
- Sécurité des types
- Meilleure DX (autocomplétion, refactoring)
- Documentation vivante du code

**Raison du choix** :
> "C'est la seule combinaison qui garantit nativement les scores de performance (Core Web Vitals) visés tout en offrant une excellente expérience développeur (DX)."

#### **Hébergement & Infrastructure (Q7)**
✅ **Décision validée** : **Vercel**

**Justification** :
- Optimisation native pour Astro (Edge Adapter)
- Gestion automatique et optimisation des images (@astrojs/image)
- Previews de déploiement automatiques (CI/CD intégré)
- CDN global pour maximiser le score LCP (Largest Contentful Paint)
- Infrastructure "Zero-config" pour se concentrer sur le code applicatif
- Plan gratuit généreux pour un portfolio

**Alternatives évaluées** : Netlify (acceptable mais Vercel préféré)

#### **Domaine & Email (Q8)**
✅ **Décision validée** :

**Nom de domaine** : ❌ Non acquis actuellement
- **Stratégie** : Achat planifié comme jalon de validation de la phase finale
- **Développement** : Sous-domaine technique Vercel (ex: `portfolio-alpha.vercel.app`)
- **Staging** : Environnement de recette sur Vercel
- **Production** : Domaine personnalisé (ex: `prenom-nom.dev`) connecté au Go Live

**Email professionnel** : ✅ Déjà actif
- Servira de point de réception pour les notifications du formulaire de contact
- Intégration via API Serverless (Vercel Functions ou Resend)

---

### 5.4 Contact, Analytics & Conformité

#### **Gestion des Messages de Contact (Q9)**
✅ **Décision validée** : **Par email**

**Architecture technique** :
- Formulaire React avec validation (Zod ou React Hook Form)
- API Serverless (Vercel Functions) pour l'envoi
- Service d'envoi : Resend, SendGrid ou Nodemailer
- Anti-spam : Cloudflare Turnstile (alternative gratuite à reCAPTCHA, moins intrusive)
- Rate limiting côté API pour éviter les abus

#### **Analytics & RGPD (Q10)**
✅ **Décision validée** : **Conformité RGPD obligatoire**

**Solution recommandée** : **Plausible Analytics** ou **Vercel Analytics**
- Léger (<1KB)
- Privacy-first (pas de cookies)
- Conformité RGPD native
- Alternative : Fathom Analytics

**❌ À éviter** : Google Analytics (lourd, tracking invasif, RGPD complexe)

**Tracking prévu** :
- Pages vues
- Temps passé
- Taux de rebond
- Conversions (soumission formulaire contact)
- Sources de trafic

#### **Mode Sombre/Clair (Q11)**
✅ **Décision validée** : **IN SCOPE V1** ✅

**Features** :
- Toggle manuel Dark/Light Mode
- **Détection automatique** via `prefers-color-scheme`
- Persistance du choix utilisateur (localStorage)
- Transition fluide sans flash (inline script critical)

**Implémentation** :
- Tailwind CSS `dark:` classes
- Script de détection avant le render pour éviter FOUC (Flash of Unstyled Content)

---

### 5.5 Accessibilité & Tests

#### **Niveau d'Accessibilité (Q12)**
✅ **Décision validée** : **WCAG 2.1 niveau AA**

**Tests avec utilisateurs** : ✅ **Prévus**
- Tests avec utilisateurs en situation de handicap
- Validation avec lecteurs d'écran (NVDA, JAWS, VoiceOver)
- Tests de navigation au clavier
- Vérification des contrastes

**Outils de validation** :
- axe DevTools (audit automatisé)
- Lighthouse Accessibility Score
- WAVE (Web Accessibility Evaluation Tool)
- Tests manuels

---

### 5.6 SEO & Référencement

#### **Stratégie SEO (Q13)**
✅ **Décision validée** : **SEO basique, pas de stratégie de contenu agressive**

**Actions IN SCOPE V1** :
- Meta tags optimisés (title, description, Open Graph, Twitter Cards)
- Sitemap XML généré automatiquement
- robots.txt
- Structured Data (JSON-LD) pour les projets
- URLs sémantiques
- Performance technique (Core Web Vitals = facteur SEO)

**OUT OF SCOPE V1** :
- Stratégie de contenu SEO agressive
- Blog pour le référencement
- Link building

---

### 5.7 Évolutivité & Vision Long Terme

#### **Roadmap V2 - Priorités Identifiées**

**Priorité V2** :
1. **🌍 Extension i18n** - Ajout de nouvelles langues
   - Support de langues additionnelles (Espagnol, Allemand, Portugais, etc.)
   - Gestion collaborative des traductions
   - Interface de traduction en ligne
   - Traduction automatique assistée (DeepL API)

2. **📝 Blog** (si pertinent pour la visibilité)
   - Articles techniques
   - Système de tags et catégories
   - RSS Feed

3. **📊 Analytics avancé**
   - Dashboard personnalisé
   - Entonnoirs de conversion
   - Heatmaps (Hotjar, Clarity)

**Vision long terme** :
- Évolution possible vers une plateforme incluant du contenu éducatif
- Potentiel d'intégration d'un système de rendez-vous
- Possibilité d'ajouter des études de cas détaillées

---

## 6. Synthèse Technique

### Stack Technique Finale

```

┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE GLOBALE │
├─────────────────────────────────────────────────────────────┤
│ │
│ Frontend Framework: Astro (SSG + Islands Architecture) │
│ UI Components: React (interactivité uniquement) │
│ Styling: Tailwind CSS + Design Tokens │
│ Language: TypeScript (Strict Mode) │
│ Content: Markdown/MDX (Git-versioned) │
│ i18n: Astro i18n / astro-i18next (FR/EN) │
│ Hosting: Vercel (Edge + CDN) │
│ Analytics: Plausible / Vercel Analytics │
│ Contact: Serverless Functions (Vercel) │
│ Email Service: Resend / SendGrid │
│ Anti-Spam: Cloudflare Turnstile │
│ │
└─────────────────────────────────────────────────────────────┘

```

### Contraintes Non-Négociables

✅ **Performance** : Lighthouse Score >90 (toutes catégories)
✅ **Accessibilité** : WCAG 2.1 niveau AA obligatoire
✅ **SEO** : Optimisation technique native
✅ **RGPD** : Conformité totale (analytics privacy-first)
✅ **Responsive** : Mobile-first design
✅ **Mode Sombre** : Dark mode first + détection système
✅ **UX** : Micro-interactions fluides sans compromis performance
✅ **i18n** : Bilingue FR/EN dès V1 avec détection auto et URLs localisées

### Données Clés du Projet

| Critère | Valeur |
|---------|--------|
| **Contenu initial** | 15 projets max, 20 certifications max |
| **Mise à jour** | Mensuelle (rebuild ~1-2 minutes) |
| **Stack** | Astro + React + TypeScript + Tailwind |
| **Hébergement** | Vercel (plan gratuit) |
| **Score cible** | Lighthouse >90 |
| **Accessibilité** | WCAG 2.1 AA + tests utilisateurs |
| **Mode** | Dark first + toggle système |
| **Analytics** | Plausible (privacy-first) |
| **Langues** | FR/EN (i18n dès V1) |

---

**Document rédigé par** : Esdras GBEDOZIN - Ingénieur Informatique
**Pour** : Esdras GBEDOZIN - Ingénieur Informatique
**Date de création** : 17 janvier 2026
**Dernière mise à jour** : 17 janvier 2026 (v1.1)
**Statut** : ✅ **VALIDÉ - Document de Référence**
```
