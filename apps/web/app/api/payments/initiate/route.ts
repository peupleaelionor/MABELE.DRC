import { z } from 'zod'
import { requirePermission, handleApiError, apiSuccess, ValidationError } from '@mabele/core-auth'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { emitEvent } from '@mabele/core-events'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'
import { paymentRegistry } from '@/../../services/payments/registry'

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  provider: z.enum(['ORANGE_MONEY', 'AIRTEL_MONEY', 'STRIPE', 'WALLET']),
  type: z.enum([
    'LISTING_BOOST',
    'PREMIUM_SUBSCRIPTION',
    'VERIFICATION_FEE',
    'LISTING_FEATURE',
    'DEPOSIT',
    'PURCHASE',
    'SUBSCRIPTION',
    'TRANSFER',
    'TONTINE',
    'INVOICE_PAYMENT',
  ]),
  phone: z.string().optional(),
  description: z.string().optional(),
  callbackUrl: z.string().url().optional(),
  idempotencyKey: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'payments:initiate')

    const rl = await rateLimit(`payment:${user!.id}`, RATE_LIMITS.payment)
    if (!rl.allowed) {
      return Response.json(
        { success: false, error: 'Trop de requêtes', code: 'RATE_LIMITED' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    const { amount, currency, provider, type, phone, description, callbackUrl, idempotencyKey, metadata } =
      parsed.data

    // Idempotency: return cached response if key already used
    if (idempotencyKey) {
      const existing = await db.idempotencyKey.findUnique({ where: { key: idempotencyKey } })
      if (existing?.response) {
        return Response.json(existing.response, { status: existing.status ?? 200 })
      }
    }

    // Generate unique reference
    const reference = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Persist intent first
    const intent = await db.paymentIntent.create({
      data: {
        userId: user!.id,
        amount,
        devise: currency,
        provider,
        type: type as never,
        status: 'PENDING',
        reference,
        idempotencyKey: idempotencyKey ?? null,
        callbackUrl: callbackUrl ?? null,
        metadata: (metadata ?? null) as never,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      },
    })

    // Call provider
    let providerResult
    if (provider !== 'WALLET') {
      const p = paymentRegistry.get(provider)
      providerResult = await p.initiatePayment({
        reference,
        amount,
        currency,
        phone: phone ?? user!.phone,
        description,
        callbackUrl,
        metadata,
      })

      // Update with provider ref
      await db.paymentIntent.update({
        where: { id: intent.id },
        data: {
          providerRef: providerResult.providerRef,
          status: providerResult.status as never,
        },
      })
    }

    await emitEvent(
      'payment.initiated',
      { paymentId: intent.id, userId: user!.id, amount, currency, type, provider },
      { userId: user!.id, aggregateId: intent.id, aggregateType: 'payment' },
    )

    const responseData = {
      id: intent.id,
      reference,
      status: providerResult?.status ?? 'PENDING',
      redirectUrl: providerResult?.redirectUrl,
      ussdCode: providerResult?.ussdCode,
      deepLink: providerResult?.deepLink,
      expiresAt: intent.expiresAt,
    }

    // Cache idempotency response
    if (idempotencyKey) {
      await db.idempotencyKey.upsert({
        where: { key: idempotencyKey },
        create: {
          key: idempotencyKey,
          userId: user!.id,
          endpoint: '/api/payments/initiate',
          response: responseData as never,
          status: 201,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        update: {},
      })
    }

    return apiSuccess(responseData, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
