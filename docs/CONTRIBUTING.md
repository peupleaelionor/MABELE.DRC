# Contributing to MABELE

Thank you for your interest in contributing to MABELE! This guide will help you get started.

---

## Code of Conduct

Be respectful, inclusive, and constructive. We welcome contributions from all Congolais and friends of the DRC.

---

## Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/mabele.git
cd mabele
pnpm install
```

### 2. Create a branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Set up environment
```bash
cp .env.example .env
docker-compose -f infrastructure/docker-compose.yml up -d
pnpm db:push
pnpm db:seed
pnpm dev
```

---

## Project Structure

```
apps/web/app/
├── (auth)/         → Login, Register, Onboarding
├── (dashboard)/    → All module pages
└── api/            → API routes

packages/
├── database/       → Prisma schema + seed
├── shared/         → Types, utils, constants
└── config/         → ESLint, TypeScript, Tailwind
```

---

## Coding Standards

### TypeScript
- Always use **strict TypeScript** — no `any`
- Export types from `packages/shared/types/index.ts`
- Use `type` imports: `import type { User } from '@mabele/shared/types'`

### React Components
```typescript
// ✅ Good
const ImmoCard = ({ listing }: ImmoCardProps) => {
  return <div>...</div>
}

// ❌ Bad
function ImmoCard(props: any) {
  return <div>...</div>
}
```

### Naming Conventions
| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ImmoCard` |
| Hooks | camelCase + `use` prefix | `useImmoListings` |
| Types/Interfaces | PascalCase | `ImmoListingProps` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PHOTOS` |
| Utilities | camelCase | `formatPrice` |
| Files | kebab-case | `immo-card.tsx` |

### Design System
- Use **only** defined design tokens (no hardcoded colors/sizes)
- Mobile-first: start with mobile styles, add `sm:`, `md:`, `lg:` prefixes
- Use CSS classes from `globals.css` (`btn-primary`, `card-base`, etc.)

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add immo listing creation form
fix: correct phone validation for Orange Money prefix
docs: update mobile money integration guide
style: format immo page components
refactor: extract shared filter component
test: add unit tests for formatPrice utility
chore: update dependencies
```

---

## Pull Request Process

1. **Test your changes** locally
2. **Update documentation** if you change behavior
3. **Keep PRs focused** — one feature/fix per PR
4. **Write a clear description** explaining what and why
5. **Link related issues** with `Closes #123`

### PR Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to test the changes.

## Screenshots (if applicable)
Add screenshots for UI changes.
```

---

## Module Ownership

| Module | Lead | Status |
|--------|------|--------|
| Immobilier | Core team | 🟢 Active |
| Emploi | Core team | 🟢 Active |
| Marché | Core team | 🟡 In Progress |
| AgriTech | Core team | 🟡 In Progress |
| NKISI | Core team | 🟡 In Progress |
| Congo Data | Core team | 🔴 Planned |
| KangaPay | Core team | 🔴 Planned |
| Bima Santé | Core team | 🔴 Planned |

---

## Reporting Issues

Use GitHub Issues with the appropriate label:
- `bug` — Something is broken
- `feature` — New feature request
- `enhancement` — Improve existing functionality
- `documentation` — Doc improvements
- `question` — Questions about the project

---

## Contact

- **Email**: dev@mabele.cd
- **GitHub**: github.com/techflow-solutions/mabele
- **WhatsApp Business**: +243 81 000 0001

---

Made with ❤️ for the 🇨🇩 RDC by TechFlow Solutions.
