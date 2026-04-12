// ─── Stripe Provider (Optional — Cross-Border / Business Flows) ───────────────
// Stripe is NOT a local DRC payment rail. Use only for:
//  - International B2B payments
//  - Merchant payouts to international accounts
//  - Optional cross-border subscription billing
//
// NB: Stripe does not support DRC merchant accounts natively as of 2025.
//     This adapter is intentionally a stub — wire it when needed.

import type {
  PaymentProvider,
  PaymentInitiateInput,
  PaymentInitiateResult,
  PaymentStatusResult,
  RefundInput,
  RefundResult,
  WebhookVerification,
} from '../provider'
import { logger } from '../../../packages/core/logger/index'

export class StripeProvider implements PaymentProvider {
  readonly name = 'STRIPE'
  readonly displayName = 'Stripe'
  readonly currency = 'USD'
  readonly country = 'INTERNATIONAL'

  private log = logger.child({ module: 'payments', provider: 'stripe' })
  private webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  async initiatePayment(input: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    this.log.info('Stripe payment initiated (stub)', { reference: input.reference })
    // TODO: implement via `stripe` npm package when enabled
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18' })
    // const intent = await stripe.paymentIntents.create({ ... })
    return {
      providerRef: `stripe_stub_${input.reference}`,
      status: 'PENDING',
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentStatusResult> {
    this.log.info('Stripe status check (stub)', { providerRef })
    return { providerRef, status: 'PENDING' }
  }

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    this.log.info('Stripe refund (stub)', { providerRef: input.providerRef })
    return { refundRef: input.providerRef, status: 'PENDING' }
  }

  async verifyWebhook(
    headers: Record<string, string>,
    rawBody: string,
  ): Promise<WebhookVerification> {
    // TODO: use stripe.webhooks.constructEvent when enabled
    const signature = headers['stripe-signature'] ?? ''
    if (!signature || !this.webhookSecret) return { valid: false }

    try {
      const payload = JSON.parse(rawBody) as Record<string, unknown>
      return { valid: true, payload, eventType: String(payload.type ?? '') }
    } catch {
      return { valid: false }
    }
  }
}
