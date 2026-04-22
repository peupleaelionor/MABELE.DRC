# MABELE.DRC
### Unified Digital Super-Platform for the Democratic Republic of Congo 🇨🇩

MABELE (Terre en Lingala) est une infrastructure numérique ambitieuse conçue pour centraliser les services essentiels de l'économie congolaise. Plus qu'une application, c'est un écosystème modulaire visant à digitaliser les secteurs clés : immobilier, emploi, marketplace et services financiers.

---

### 🏗️ Architecture Monorepo

Le projet utilise une architecture **Monorepo** pilotée par **Turborepo**, permettant une isolation stricte des domaines métier tout en partageant une infrastructure commune.

```text
mabele/
├── apps/
│   └── web/                  # Next.js 15 App Router (Interface principale)
├── packages/
│   ├── core/                 # Logique métier (Listings, Search, Messaging)
│   ├── database/             # Prisma ORM + PostgreSQL Schema
│   ├── shared/               # Types, Utils et Constantes partagés
│   └── config/               # Configurations partagées (TS, Tailwind, ESLint)
├── services/                 # Microservices backend
└── infrastructure/           # Docker, CI/CD et scripts de déploiement
```

---

### 🧩 Domaines Métier (Verticales)

MABELE agrège huit verticales critiques pour l'économie locale :
*   **Immobilier** : Gestion des annonces, locations et transactions.
*   **Emploi** : Plateforme de recrutement et gestion de candidatures.
*   **Marché** : Marketplace C2C/B2C optimisée pour le commerce local.
*   **KangaPay** : Intégration Mobile Money et solutions de paiement unifiées.
*   **AgriTech** : Support aux producteurs agricoles et distribution.
*   **Bima Santé** : Assurance santé digitale et accès aux soins.

---

### 🛠️ Stack Technique

*   **Framework** : Next.js 15 (App Router, Server Components).
*   **Language** : TypeScript 5 (Strict Mode).
*   **Database** : PostgreSQL via Prisma ORM.
*   **Styling** : Tailwind CSS avec un Design System personnalisé.
*   **Orchestration** : Turborepo + pnpm workspaces.
*   **Auth** : NextAuth.js avec support OTP/Phone (adapté au marché local).

---

### 🚀 Démarrage Rapide

Le projet nécessite **Node.js ≥ 20** et **pnpm ≥ 9**.

```bash
# Installation des dépendances
pnpm install

# Lancer l'infrastructure (PostgreSQL, Redis)
docker-compose -f infrastructure/docker-compose.yml up -d

# Initialiser la base de données
pnpm db:push
pnpm db:seed

# Lancer l'environnement de développement
pnpm dev
```

---

### 🗺️ Vision & Roadmap

MABELE est conçu pour répondre aux défis de la pénétration mobile en RDC (67%) et s'inscrit dans le Plan Numérique RDC 2025–2030.
- [ ] Finalisation de l'intégration KangaPay (Mobile Money).
- [ ] Déploiement des modules AgriTech et Bima Santé.
- [ ] Support multilingue (Lingala, Swahili, Kikongo, Tshiluba).

---

### 📫 Travailler avec moi / Techflow Agency

Ce projet illustre ma capacité à architecturer des systèmes complexes à l'échelle nationale, alliant vision produit et excellence technique.

*   **Expertise** : Architecture Monorepo, Super-Apps, Fintech, Marchés émergents.
*   **Contact** : [TechFlow Solutions](https://www.techflowsolutions.space)

---
<div align="center">
  <sub>© 2025 TechFlow Solutions. Tous droits réservés.</sub>
</div>
