import type { NextRequest } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { emitEvent } from '@mabele/core-events'
import db from '@/lib/db'
import { OrangeMoneyRDC } from '@/../../services/payments/providers/orange-money-rdc'

const provider = new OrangeMoneyRDC()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') ?? '0.0.0.0'

  const rl = await rateLimit(`webhook-om:${ip}`, RATE_LIMITS.webhook)
  if (!rl.allowed) {
    return new Response('Too Many Requests', { status: 429 })
  }

  const rawBody = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  // Persist raw webhook first (for debugging / replay)
  const webhookEvent = await db.webhookEvent.create({
    data: {
      provider: 'ORANGE_MONEY',
      eventType: 'PAYMENT_CALLBACK',
      payload: JSON.parse(rawBody) as never,
      signature: headers['x-orange-signature'] ?? null,
      status: 'RECEIVED',
    },
  })

  // Verify signature
  const verification = await provider.verifyWebhook(headers, rawBody)
  if (!verification.valid) {
    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: 'FAILED', errorMessage: 'Invalid signature' },
    })
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = verification.payload ?? {}
  const orderId = String(payload.order_id ?? payload.pay_token ?? '')
  const status = verification.eventType?.toUpperCase()

  try {
    if (orderId) {
      const intent = await db.paymentIntent.findFirst({
        where: {
          OR: [{ reference: orderId }, { providerRef: orderId }],
        },
      })

      if (intent) {
        const newStatus =
          status === 'SUCCESS' || status === 'SUCCESSFUL'
            ? 'COMPLETED'
            : status === 'FAILED' || status === 'CANCELLED'
              ? 'FAILED'
              : null

        if (newStatus && intent.status === 'PENDING') {
          await db.paymentIntent.update({
            where: { id: intent.id },
            data: { status: newStatus as never, providerRef: String(payload.pay_token ?? orderId) },
          })

          await emitEvent(
            newStatus === 'COMPLETED' ? 'payment.completed' : 'payment.failed',
            {
              paymentId: intent.id,
              userId: intent.userId,
              amount: intent.amount,
              devise: intent.devise,
              type: intent.type,
              provider: 'ORANGE_MONEY',
            },
            { userId: intent.userId, aggregateId: intent.id, aggregateType: 'payment' },
          )
        }
      }
    }

    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: 'PROCESSED', processedAt: new Date(), eventType: status ?? 'UNKNOWN' },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        retries: { increment: 1 },
      },
    })
    return new Response('Internal Server Error', { status: 500 })
  }
}
