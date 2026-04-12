// ─── MABELE Seed (stub — full seed in seed.full.ts) ──────────────────────────
// Run: pnpm db:seed
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  console.log('🌱 Seeding MABELE...')
  // Plans
  const planDefs = [
    { key: 'free', name: 'Gratuit', tier: 'FREE', priceMonthly: 0, priceYearly: 0, sortOrder: 0 },
    { key: 'starter', name: 'Starter Business', tier: 'STARTER', priceMonthly: 9.99, priceYearly: 89.99, sortOrder: 1 },
    { key: 'business', name: 'Business', tier: 'BUSINESS', priceMonthly: 29.99, priceYearly: 269.99, sortOrder: 2 },
    { key: 'enterprise', name: 'Enterprise', tier: 'ENTERPRISE', priceMonthly: 99.99, priceYearly: 899.99, sortOrder: 3 },
  ]
  for (const p of planDefs) {
    await prisma.plan.upsert({
      where: { key: p.key },
      create: { ...p, tier: p.tier as never, devise: 'USD', features: {}, limits: {}, isPublic: true },
      update: { priceMonthly: p.priceMonthly, priceYearly: p.priceYearly },
    })
  }
  // Feature flags
  const flags = [
    { key: 'kangapay_enabled', name: 'KangaPay', enabled: true },
    { key: 'tontine_enabled', name: 'Tontines', enabled: true },
    { key: 'qr_payments', name: 'QR Payments', enabled: true },
    { key: 'payment_links', name: 'Payment Links', enabled: true },
    { key: 'referral_program', name: 'Referral Program', enabled: true },
    { key: 'ai_copilot', name: 'AI Copilot', enabled: false },
    { key: 'bima_enabled', name: 'Bima Santé', enabled: false },
  ]
  for (const f of flags) {
    await prisma.featureFlag.upsert({
      where: { key: f.key },
      create: { ...f, modules: [], cities: [], countries: ['CD'], roles: [], planTiers: [], rolloutPct: 100 },
      update: { enabled: f.enabled },
    })
  }
  // Demo users
  const admin = await prisma.user.upsert({
    where: { phone: '+243850000005' },
    create: { phone: '+243850000005', name: 'Admin MABELE', email: 'admin@mabele.cd', role: 'ADMIN', ville: 'Kinshasa', province: 'Kinshasa', isVerified: true, locale: 'fr' },
    update: {},
  })
  const merchant = await prisma.user.upsert({
    where: { phone: '+243810000001' },
    create: { phone: '+243810000001', name: 'Jean-Pierre Kabila', email: 'jp@demo.mabele.cd', role: 'MERCHANT', ville: 'Kinshasa', province: 'Kinshasa', isVerified: true, locale: 'fr' },
    update: {},
  })
  await prisma.wallet.upsert({ where: { userId: admin.id }, create: { userId: admin.id, balance: 500, currency: 'USD', status: 'ACTIVE' }, update: {} })
  await prisma.wallet.upsert({ where: { userId: merchant.id }, create: { userId: merchant.id, balance: 1250, currency: 'USD', status: 'ACTIVE' }, update: {} })
  console.log('✅ MABELE seeded successfully!')
}
main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
