# PROMPT.md — MABELE AI Agent Instructions

## Contexte du projet

Tu es un agent IA spécialisé dans le développement de la plateforme **MABELE** — la super-plateforme digitale de la République Démocratique du Congo, développée par **TechFlow Solutions**.

## Stack technique

- **Framework**: Next.js 14+ avec App Router
- **Langage**: TypeScript 5 (mode strict)
- **Styling**: Tailwind CSS + variables CSS personnalisées
- **Base de données**: PostgreSQL + Prisma ORM
- **Monorepo**: Turborepo + pnpm workspaces
- **Auth**: NextAuth.js (OTP par SMS)
- **Validation**: Zod

## Règles de design

### Couleurs
```
Background principal : #08080C
Texte principal      : #F0F0F0
Couleur primaire     : #D4A017 (Or/Gold — richesse du Congo)
Couleur secondaire   : #006400 (Vert — drapeau congolais)
```

### Couleurs par module
```
Immobilier  : #D4A017 (or/gold)
Emploi      : #26C6DA (teal)
Marché      : #FF5252 (rouge)
AgriTech    : #00C853 (vert)
NKISI       : #B388FF (violet)
Congo Data  : #448AFF (bleu)
KangaPay    : #FFB300 (orange)
Bima Santé  : #FF4081 (rose)
```

### Typographie
- **Corps**: DM Sans
- **Titres**: Playfair Display

### Rayons de bordure
- Cartes : `16px`
- Petits éléments : `10px`
- Sections hero : `24px`

## Structure des fichiers

```
apps/web/app/
├── layout.tsx              # Layout racine (thème sombre)
├── page.tsx                # Page d'accueil (landing)
├── globals.css             # Tailwind + tokens design
├── (auth)/
│   ├── login/page.tsx      # Connexion par téléphone/OTP
│   ├── register/page.tsx   # Inscription
│   └── onboarding/page.tsx # Assistant 3 étapes
└── (dashboard)/
    ├── layout.tsx          # Layout dashboard + navigation
    ├── immo/page.tsx       # Module Immobilier
    ├── emploi/page.tsx     # Module Emploi
    ├── market/page.tsx     # Module Marché
    ├── agri/page.tsx       # Module AgriTech
    ├── outils/page.tsx     # Module NKISI
    ├── data/page.tsx       # Module Congo Data
    └── finance/page.tsx    # Module KangaPay
```

## Règles de code

1. **TypeScript strict** — toujours typer explicitement
2. **Mobile-first** — commencer par le mobile, puis adapter au desktop
3. **'use client'** — ajouter uniquement quand nécessaire (événements, hooks)
4. **Composants fonctionnels** — toujours des arrow functions
5. **Nommage français** — les variables métier en français (prix, ville, etc.)
6. **Pas de `any`** — utiliser des types précis

## Conventions de nommage

```typescript
// Composants : PascalCase
const ImmoCard = () => {}

// Hooks : camelCase avec préfixe 'use'
const useImmoListings = () => {}

// Types : PascalCase avec suffixe descriptif
type ImmoListingProps = {}
interface UserProfile {}

// Constantes : SCREAMING_SNAKE_CASE
const MAX_PHOTOS = 10
const API_BASE_URL = ''

// Fonctions utilitaires : camelCase
const formatPrice = () => {}
```

## Modules et responsabilités

### Immobilier
- Liste/recherche d'annonces (achat, vente, location)
- Filtres: ville, type, prix, surface
- Carte interactive Mapbox
- Vérification titre foncier (badge)
- Upload photos/vidéo 360°

### Emploi
- Offres d'emploi avec candidature directe
- Types: CDI, CDD, Freelance, Stage, Intérim
- Filtres: ville, catégorie, salaire, remote
- CV upload
- Badge "Urgent"

### Marché (Marketplace)
- C2C et B2C
- Catégories: Électronique, Véhicules, Vêtements, etc.
- États: Neuf, Occasion, Reconditionné
- Chat intégré (à venir)

### AgriTech
- Vente de produits agricoles
- Unités: kg, tonne, sac, litre
- Labels: Bio, Certifié
- Conseil agricole IA (à venir)

### NKISI (Outils Business)
- Création de devis et factures PDF
- Numérotation automatique
- Suivi des paiements
- Statistiques business

### Congo Data
- Données économiques DRC
- Tableaux de bord interactifs
- Sources: Banque Mondiale, BCC, INS
- Export CSV/Excel

### KangaPay (Finance)
- Mobile money (Airtel, M-Pesa, Orange)
- Tontines numériques avec score de confiance
- Historique des transactions
- QR Code de paiement

### Bima Santé
- Comparateur d'assurances santé
- Souscription digitale
- Gestion des sinistres
- Annuaire médical

## Gestion des erreurs

```typescript
// Utiliser Zod pour la validation
const schema = z.object({
  phone: z.string().regex(/^(\+243|0)[0-9]{9}$/),
})

// Toujours gérer les erreurs async
try {
  const data = await fetchData()
} catch (error) {
  console.error('Erreur:', error)
  throw new Error('Message utilisateur')
}
```

## Format des prix

```typescript
// CDF (Franc Congolais)
formatPrice(50000, 'CDF') // → "50.000 FC"

// USD
formatPrice(25, 'USD') // → "25 $"
```

## Format des téléphones DRC

```
+243 81 XXX XXXX  (Airtel)
+243 82 XXX XXXX  (Vodacom)
+243 84 XXX XXXX  (Orange)
+243 89 XXX XXXX  (Africell)
```

## Provinces DRC (26 provinces)

Kinshasa, Kongo-Central, Kwango, Kwilu, Mai-Ndombe, Kasaï, Kasaï-Central, Kasaï-Oriental, Lomami, Sankuru, Maniema, Sud-Kivu, Nord-Kivu, Ituri, Haut-Uélé, Bas-Uélé, Tshopo, Mongala, Nord-Ubangi, Sud-Ubangi, Équateur, Tshuapa, Tanganyika, Haut-Lomami, Lualaba, Haut-Katanga

## Instructions pour l'agent

1. **Toujours** consulter les types dans `packages/shared/types/index.ts` avant de créer un composant
2. **Toujours** utiliser les constantes de `packages/shared/constants/index.ts`
3. **Toujours** utiliser les utilitaires de `packages/shared/utils/index.ts`
4. **Jamais** d'informations sensibles en dur dans le code
5. **Toujours** penser à l'accessibilité (aria-label, alt, etc.)
6. **Toujours** optimiser les images avec `next/image`
7. **Toujours** utiliser `next/link` pour la navigation interne

## Commandes utiles

```bash
pnpm dev              # Démarrer en développement
pnpm build            # Builder le projet
pnpm db:push          # Pousser le schéma Prisma
pnpm db:seed          # Seeder la base de données
pnpm db:studio        # Ouvrir Prisma Studio
pnpm lint             # Linter le code
pnpm format           # Formater le code
```
