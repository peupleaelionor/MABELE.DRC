# MABELE — Super-Platform for the DRC 🇨🇩

> **La plateforme digitale tout-en-un pour 112 millions de Congolais**

MABELE (Terre en Lingala) is a unified digital super-platform for the Democratic Republic of Congo, built by **TechFlow Solutions**. It aggregates eight critical economic verticals into a single mobile-first application.

---

## 📐 Architecture

```
mabele/
├── apps/
│   └── web/                  # Next.js 14+ App Router (main web app)
├── packages/
│   ├── database/             # Prisma ORM + PostgreSQL schema
│   ├── shared/               # Types, utils, constants
│   └── config/               # Shared ESLint, TypeScript, Tailwind configs
├── infrastructure/           # Docker, Dockerfile, deploy configs
└── docs/                     # API, Deployment, Contributing docs
```

---

## 🧩 Modules

| Module | Color | Description |
|--------|-------|-------------|
| **Immobilier** | `#D4A017` 🟡 | Annonces immobilières — achat, vente, location |
| **Emploi** | `#26C6DA` 🔵 | Offres d'emploi et candidatures |
| **Marché** | `#FF5252` 🔴 | Marketplace C2C et B2C |
| **AgriTech** | `#00C853` 🟢 | Produits agricoles et conseils |
| **NKISI** | `#B388FF` 🟣 | Facturation, devis, outils business |
| **Congo Data** | `#448AFF` 🔵 | Données économiques et tableaux de bord |
| **KangaPay** | `#FFB300` 🟠 | Mobile money, tontines, paiements |
| **Bima Santé** | `#FF4081` 🩷 | Assurance santé digitale |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS + CSS Variables
- **Database**: PostgreSQL via Prisma ORM
- **Monorepo**: Turborepo + pnpm workspaces
- **Auth**: NextAuth.js (phone/OTP)
- **Validation**: Zod
- **Infra**: Docker, Vercel, Railway

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mabele.git
cd mabele

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start infrastructure (PostgreSQL, Redis, Meilisearch)
docker-compose up -d

# Push database schema
pnpm db:push

# Seed the database
pnpm db:seed

# Start development
pnpm dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:web` | Start web app only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format with Prettier |
| `pnpm db:push` | Push Prisma schema |
| `pnpm db:seed` | Seed the database |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Prisma Studio |

---

## 🎨 Design System

### Colors
```
Background : #08080C  (near-black)
Text       : #F0F0F0  (off-white)
Primary    : #D4A017  (Gold — richness of Congo)
Secondary  : #006400  (Green — Congolese flag)
```

### Typography
- **Body**: DM Sans
- **Headings**: Playfair Display

### Border Radius
- Cards: `16px`
- Small elements: `10px`
- Hero sections: `24px`

---

## 📁 Environment Variables

See [`.env.example`](.env.example) for all required variables.

---

## 📚 Documentation

- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Mobile Money Integration](docs/MOBILE-MONEY.md)
- [Contributing Guide](docs/CONTRIBUTING.md)

---

## 🌍 Context

- **Population**: 112 million Congolais
- **Mobile penetration**: 67%
- **Digital plan**: $8.7Md Plan Numérique DRC 2025–2030
- **Languages**: French (primary UI), Lingala, Swahili (planned)

---

## 🏢 Built by TechFlow Solutions

© 2025 TechFlow Solutions. All rights reserved.
