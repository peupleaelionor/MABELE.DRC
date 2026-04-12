import type { NextRequest } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { emitEvent } from '@mabele/core-events'
import db from '@/lib/db'
import { AirtelMoneyRDC } from '@/../../services/payments/providers/airtel-money-rdc'

const provider = new AirtelMoneyRDC()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') ?? '0.0.0.0'

  const rl = await rateLimit(`webhook-am:${ip}`, RATE_LIMITS.webhook)
  if (!rl.allowed) {
    return new Response('Too Many Requests', { status: 429 })
  }

  const rawBody = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  const webhookEvent = await db.webhookEvent.create({
    data: {
      provider: 'AIRTEL_MONEY',
      eventType: 'PAYMENT_CALLBACK',
      payload: JSON.parse(rawBody) as never,
      signature: headers['x-airtel-signature'] ?? null,
      status: 'RECEIVED',
    },
  })

  const verification = await provider.verifyWebhook(headers, rawBody)
  if (!verification.valid) {
    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: 'FAILED', errorMessage: 'Invalid signature' },
    })
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = verification.payload ?? {}
  const tx = (payload.transaction ?? {}) as Record<string, unknown>
  const airtelRef = String(tx.airtel_money_id ?? tx.id ?? '')
  const txStatus = String(tx.status ?? verification.eventType ?? '').toUpperCase()

  try {
    if (airtelRef) {
      const intent = await db.paymentIntent.findFirst({
        where: { providerRef: airtelRef },
      })

      if (intent) {
        const newStatus =
          txStatus === 'TS' ? 'COMPLETED' : txStatus === 'TF' ? 'FAILED' : null

        if (newStatus && intent.status === 'PENDING') {
          await db.paymentIntent.update({
            where: { id: intent.id },
            data: { status: newStatus as never },
          })

          await emitEvent(
            newStatus === 'COMPLETED' ? 'payment.completed' : 'payment.failed',
            {
              paymentId: intent.id,
              userId: intent.userId,
              amount: intent.amount,
              devise: intent.devise,
              type: intent.type,
              provider: 'AIRTEL_MONEY',
            },
            { userId: intent.userId, aggregateId: intent.id, aggregateType: 'payment' },
          )
        }
      }
    }

    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: 'PROCESSED', processedAt: new Date(), eventType: txStatus },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    await db.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    return new Response('Internal Server Error', { status: 500 })
  }
}
