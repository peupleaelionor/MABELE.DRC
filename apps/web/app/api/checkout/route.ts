// ─── API: Checkout ─────────────────────────────────────────────────────────────
// Thin wrapper over /api/payments/initiate.
// Validates the request, runs fraud check, then delegates to payment registry.
import { z } from 'zod'
import { requirePermission, handleApiError, apiSuccess, ValidationError } from '@mabele/core-auth'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'
import { paymentRegistry } from '@/../../services/payments/registry'

const schema = z.object({
  amount:      z.number().positive(),
  currency:    z.string().default('USD'),
  provider:    z.enum(['ORANGE_MONEY', 'AIRTEL_MONEY', 'STRIPE', 'WALLET']),
  type:        z.enum(['PURCHASE', 'LISTING_BOOST', 'PREMIUM_SUBSCRIPTION', 'VERIFICATION_FEE', 'DEPOSIT', 'SUBSCRIPTION', 'TRANSFER', 'TONTINE', 'INVOICE_PAYMENT', 'LISTING_FEATURE']),
  phone:       z.string().optional(),
  description: z.string().max(500).optional(),
  itemId:      z.string().optional(),
  callbackUrl: z.string().url().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'payments:initiate')

    const rl = await rateLimit(`checkout:${user!.id}`, RATE_LIMITS.payment)
    if (!rl.allowed) {
      return Response.json(
        { success: false, error: 'Trop de tentatives. Réessayez dans 1 minute.', code: 'RATE_LIMITED' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    const { amount, currency, provider, type, phone, description, callbackUrl } = parsed.data

    // Generate unique reference
    const reference = `CHK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Persist intent
    const intent = await db.paymentIntent.create({
      data: {
        userId:      user!.id,
        amount,
        devise:      currency,
        provider,
        type:        type as never,
        status:      'PENDING',
        reference,
        callbackUrl: callbackUrl ?? null,
        metadata:    ({ itemId: parsed.data.itemId, description } ?? null) as never,
        expiresAt:   new Date(Date.now() + 30 * 60 * 1000),
      },
    })

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
      })

      await db.paymentIntent.update({
        where: { id: intent.id },
        data: {
          providerRef: providerResult.providerRef,
          status: providerResult.status as never,
        },
      })
    }

    return apiSuccess({
      id:          intent.id,
      reference,
      status:      providerResult?.status ?? 'PENDING',
      redirectUrl: providerResult?.redirectUrl,
      ussdCode:    providerResult?.ussdCode,
      deepLink:    providerResult?.deepLink,
      expiresAt:   intent.expiresAt,
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
