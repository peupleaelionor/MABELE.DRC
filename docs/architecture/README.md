# MABELE — Architecture Overview

## Vision

MABELE is national digital infrastructure for the Democratic Republic of Congo — a
super-platform aggregating 8 economic verticals (real estate, jobs, marketplace,
agritech, invoicing, data, fintech, health insurance) under one identity, one wallet,
one trust system, and one payment engine.

---

## Monorepo Structure

```
apps/
  web/              — Next.js 15 App Router (main consumer app)
  admin/            — Admin dashboard (planned)
  mobile/           — React Native (planned)

packages/
  core/
    auth/           — RBAC, permission model, guards, error helpers
    billing/        — Plan definitions, subscription service, entitlement checks
    events/         — In-process domain event bus
    logger/         — Structured logger (JSON, transport-swappable)
    rate-limit/     — Sliding-window rate limiter (in-memory → Redis)
    listings/       — Unified listing CRUD engine
    search/         — Query parser, Meilisearch + Qdrant adapter
    messaging/      — Conversations, messages, read receipts
    notifications/  — Notification service
    payments/       — Payment intent lifecycle
    wallet/         — Wallet credit/debit/transfer
    qr/             — QR payload builder, payment links
    merchant/       — Merchant tools, checkout
    fraud/          — Risk scoring (rule-based → LLM-ready)
    geo/            — Province/city/quartier hierarchy
    media/          — Upload abstraction, image processing

  agents/
    orchestrator/   — Central agent registry and runner
    copilot/        — User-visible MABELE Copilot (rule-based → LLM)
    search-agent/   — Query intent parsing, Meilisearch query builder
    fraud-agent/    — Risk scoring for payments, listings, accounts
    (+ more planned)

  database/
    prisma/         — PostgreSQL schema (Prisma ORM)
    seed.ts         — Demo data for dev/staging

  shared/
    i18n/           — FR (default), EN, Lingala, Swahili message catalogs
    types/          — Shared TypeScript types
    constants/      — Platform-wide constants
    utils/          — Shared utilities

  ui/
    tokens/         — Design tokens derived from MABELE logo

services/
  payments/
    provider.ts     — Universal PaymentProvider interface
    providers/
      orange-money-rdc.ts  — Orange Money RDC adapter
      airtel-money-rdc.ts  — Airtel Money RDC adapter (primary local rail)
      stripe.ts            — Stripe stub (cross-border optional)
    registry.ts     — Provider registry

  product/
    posthog.ts      — Analytics adapter (PostHog)
    unleash.ts      — Feature flag adapter (Unleash / DB fallback)

  comms/
    novu.ts         — Notification dispatch (Novu)

  automation/
    trigger.ts      — Background jobs (Trigger.dev / DB fallback)
```

---

## Payment Architecture

Local-first design:
1. **Airtel Money RDC** — primary (~35% DRC market share)
2. **Orange Money RDC** — secondary (~25%)
3. **M-Pesa (Vodacom)** — tertiary (~30%)
4. **Stripe** — optional, cross-border/international only

All providers implement `PaymentProvider` interface. Product code never imports
provider SDKs directly — only through the registry.

Webhook flow:
```
Provider → POST /api/webhooks/{provider}
         → signature verified
         → WebhookEvent persisted
         → PaymentIntent updated
         → DomainEvent emitted (payment.completed / payment.failed)
         → Notifications sent (via Novu)
```

Idempotency: every payment initiation accepts an `idempotencyKey`. Duplicate
requests within 24h return the cached response without creating a new intent.

---

## Security Model

- **Authentication**: Phone + OTP (NextAuth.js)
- **Authorization**: Role-based (USER → SUPER_ADMIN), permission-checked at API layer
- **Rate limiting**: Sliding-window per IP/user, configurable per endpoint
- **Webhook security**: HMAC-SHA256 signature verification
- **Audit logs**: All critical actions logged to `AuditLog` table
- **Domain events**: All platform events persisted to `DomainEvent` for tracing
- **KYC-ready**: `UserVerification` model with document + selfie support
- **Fraud scoring**: Rule-based risk scoring on payment initiation and account creation

---

## Billing Model

Citizens: **FREE forever** for core usage.

Business tiers (monthly USD):
| Plan       | Price  | Listings/mo | Boosts | Team | API |
|-----------|--------|------------|--------|------|-----|
| Free      | $0     | 5          | 0      | 1    | No  |
| Starter   | $9.99  | 30         | 5      | 1    | No  |
| Business  | $29.99 | 200        | 20     | 5    | Yes |
| Enterprise| $99.99 | Unlimited  | ∞      | ∞    | Yes |

Additional revenue: boosted listings, featured placement, verification fees,
transaction fees (optional), API usage, team seats, invoicing tools.

---

## Event-Driven Architecture

Key domain events:
- `user.registered`, `user.verified`
- `listing.created`, `listing.updated`, `listing.boosted`
- `payment.initiated`, `payment.completed`, `payment.failed`
- `wallet.credited`, `wallet.debited`, `wallet.transfer`
- `subscription.created`, `subscription.cancelled`
- `message.sent`, `conversation.created`
- `kyc.submitted`, `kyc.approved`
- `tontine.member_joined`, `tontine.round_completed`

Events power: notifications, analytics, fraud detection, AI agents, automation.

---

## i18n

| Locale | Language | Notes |
|--------|---------|-------|
| `fr`   | French  | Default — Kinshasa + business |
| `en`   | English | International + business |
| `ln`   | Lingala | Kinshasa + western DRC |
| `sw`   | Swahili | Eastern DRC (Kivu, Katanga) |

---

## PWA

- `manifest.json` — installable on Android/iOS
- `sw.js` — offline shell caching, network-first for navigation
- Theme color: `#D4A017` (MABELE gold)
- Background: `#0A0A0F` (deep dark)
