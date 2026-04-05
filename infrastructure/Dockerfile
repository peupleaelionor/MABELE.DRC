# ── Stage 1: Dependencies ──────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
COPY packages/core/listings/package.json ./packages/core/listings/
COPY packages/core/search/package.json ./packages/core/search/
COPY packages/core/messaging/package.json ./packages/core/messaging/
COPY packages/core/notifications/package.json ./packages/core/notifications/
COPY packages/core/payments/package.json ./packages/core/payments/
COPY packages/core/features/package.json ./packages/core/features/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ── Stage 2: Builder ──────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy installed node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy all source files
COPY . .

# Generate Prisma client
RUN pnpm --filter=@mabele/database generate

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm --filter=@mabele/web build

# ── Stage 3: Runner ───────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
