# Deployment Guide — MABELE

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

---

## Local Development

```bash
# 1. Clone & install
git clone https://github.com/techflow/mabele.git
cd mabele
pnpm install

# 2. Environment
cp .env.example .env
# Edit .env with your values

# 3. Start infrastructure
docker-compose -f infrastructure/docker-compose.yml up -d

# 4. Database setup
pnpm db:push
pnpm db:seed

# 5. Start dev server
pnpm dev
# → http://localhost:3000
```

---

## Production Deployment — Vercel

### 1. Install Vercel CLI
```bash
pnpm install -g vercel
```

### 2. Configure environment variables
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Configure `vercel.json`
See `infrastructure/deploy/vercel.json` for the full config.

---

## Production Deployment — Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Create project
```bash
railway init
railway add postgresql
railway add redis
```

### 3. Set environment variables
```bash
railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set NEXTAUTH_SECRET="your-secret"
```

### 4. Deploy
```bash
railway up
```

---

## Docker Deployment (Self-hosted)

### Build image
```bash
docker build -f infrastructure/Dockerfile -t mabele-web:latest .
```

### Run with docker-compose
```bash
# Production compose (add to infrastructure/)
docker-compose -f infrastructure/docker-compose.yml up -d
docker run -d \
  --name mabele_web \
  --network mabele_network \
  -p 3000:3000 \
  --env-file .env \
  mabele-web:latest
```

---

## Database Migrations

```bash
# Development — push schema changes directly
pnpm db:push

# Production — use migrations
pnpm db:migrate

# Reset database (DANGER!)
pnpm db:push --force-reset
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char secret |
| `NEXTAUTH_URL` | ✅ | App URL (with https in prod) |
| `REDIS_URL` | ✅ | Redis connection string |
| `SMS_PROVIDER` | ✅ | africas_talking \| twilio \| vonage |
| `AFRICAS_TALKING_API_KEY` | ⚠️ | Required if SMS_PROVIDER=africas_talking |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ | Required for image uploads |
| `MEILISEARCH_HOST` | ⚠️ | Required for full-text search |

---

## Health Checks

```bash
# App health
curl https://mabele.cd/api/health

# Database
curl https://mabele.cd/api/health/db

# Response:
# { "status": "ok", "timestamp": "...", "version": "0.1.0" }
```

---

## Monitoring

Recommended monitoring stack:
- **Logs**: Vercel Logs / Railway Logs / Loki
- **Errors**: Sentry (`@sentry/nextjs`)
- **Analytics**: PostHog / Plausible
- **Uptime**: UptimeRobot / BetterStack

---

## Scaling Considerations

- Use **connection pooling** (PgBouncer) for PostgreSQL at scale
- Enable **Redis clustering** for high availability
- Use **CDN** (Cloudflare) in front of Vercel for DRC traffic
- Consider **edge functions** for OTP verification to reduce latency
