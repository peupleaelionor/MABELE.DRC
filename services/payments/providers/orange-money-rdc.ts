import { createHmac } from 'crypto'
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

// ─── Orange Money RDC Provider ─────────────────────────────────────────────────
// Orange Money is the leading mobile money network in DRC (~25% share).
// Docs: https://developer.orange.com/apis/om-webpay-congobrazza/getting-started
// This adapter wraps the Orange Money WebPay API.
// Swap ORANGE_BASE_URL for the correct RDC endpoint when available.

interface OrangeConfig {
  clientId: string
  clientSecret: string
  merchantId: string
  baseUrl: string
  webhookSecret: string
  currency?: string
}

interface OrangeToken {
  access_token: string
  expires_at: number
}

export class OrangeMoneyRDC implements PaymentProvider {
  readonly name = 'ORANGE_MONEY'
  readonly displayName = 'Orange Money RDC'
  readonly currency = 'CDF'
  readonly country = 'CD'

  private config: OrangeConfig
  private tokenCache?: OrangeToken
  private log = logger.child({ module: 'payments', provider: 'orange-money-rdc' })

  constructor(config?: Partial<OrangeConfig>) {
    this.config = {
      clientId: config?.clientId ?? process.env.ORANGE_CLIENT_ID ?? '',
      clientSecret: config?.clientSecret ?? process.env.ORANGE_CLIENT_SECRET ?? '',
      merchantId: config?.merchantId ?? process.env.ORANGE_MERCHANT_ID ?? '',
      baseUrl: config?.baseUrl ?? process.env.ORANGE_BASE_URL ?? 'https://api.orange.com/orange-money-webpay/cd/v1',
      webhookSecret: config?.webhookSecret ?? process.env.ORANGE_WEBHOOK_SECRET ?? '',
      currency: config?.currency ?? 'CDF',
    }
  }

  private async getToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expires_at > Date.now() + 60_000) {
      return this.tokenCache.access_token
    }

    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`,
    ).toString('base64')

    const res = await fetch(`${this.config.baseUrl.replace('/v1', '')}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!res.ok) {
      const text = await res.text()
      this.log.error('Orange Money token fetch failed', { status: res.status, body: text })
      throw new Error('Impossible d\'obtenir le token Orange Money')
    }

    const data = await res.json() as { access_token: string; expires_in: number }
    this.tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    }
    return this.tokenCache.access_token
  }

  async initiatePayment(input: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    try {
      const token = await this.getToken()

      const body = {
        merchant_key: this.config.merchantId,
        currency: input.currency || this.currency,
        order_id: input.reference,
        amount: input.amount,
        return_url: input.callbackUrl ?? process.env.NEXT_PUBLIC_APP_URL + '/api/payments/callback',
        cancel_url: input.callbackUrl ?? process.env.NEXT_PUBLIC_APP_URL + '/api/payments/cancel',
        notif_url: process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/orange-money',
        lang: 'fr',
        reference: input.reference,
      }

      const res = await fetch(`${this.config.baseUrl}/webpayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await res.json() as {
        pay_token?: string
        payment_url?: string
        status?: string
        message?: string
        notif_token?: string
      }

      if (!res.ok || !data.pay_token) {
        this.log.error('Orange Money payment initiation failed', { data, status: res.status })
        return { providerRef: input.reference, status: 'FAILED', rawResponse: data }
      }

      this.log.info('Orange Money payment initiated', { reference: input.reference })

      return {
        providerRef: data.pay_token,
        status: 'PENDING',
        redirectUrl: data.payment_url,
        rawResponse: data,
      }
    } catch (err) {
      this.log.error('Orange Money initiatePayment error', err)
      throw err
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentStatusResult> {
    try {
      const token = await this.getToken()

      const res = await fetch(
        `${this.config.baseUrl}/paymentstatus?order_id=${providerRef}`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        },
      )

      const data = await res.json() as {
        status?: string
        amount?: number
        txnid?: string
        message?: string
      }

      const statusMap: Record<string, PaymentStatusResult['status']> = {
        SUCCESS: 'COMPLETED',
        FAILED: 'FAILED',
        PENDING: 'PENDING',
        PROCESSING: 'PROCESSING',
        CANCELLED: 'FAILED',
      }

      return {
        providerRef,
        status: statusMap[data.status?.toUpperCase() ?? ''] ?? 'PENDING',
        amount: data.amount,
        currency: this.currency,
        rawResponse: data,
      }
    } catch (err) {
      this.log.error('Orange Money getPaymentStatus error', err)
      throw err
    }
  }

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    // Orange Money RDC refunds go through merchant portal / manual for now
    this.log.warn('Orange Money refund requested — manual process required', {
      providerRef: input.providerRef,
    })
    return { refundRef: input.providerRef, status: 'PENDING' }
  }

  async verifyWebhook(
    headers: Record<string, string>,
    rawBody: string,
  ): Promise<WebhookVerification> {
    try {
      const signature = headers['x-orange-signature'] ?? headers['authorization'] ?? ''
      if (!this.config.webhookSecret) {
        // No secret configured — accept but log warning
        this.log.warn('Orange Money webhook secret not configured')
        return { valid: true, payload: JSON.parse(rawBody) }
      }

      const expected = createHmac('sha256', this.config.webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (signature !== expected && !signature.endsWith(expected)) {
        this.log.warn('Orange Money webhook signature mismatch')
        return { valid: false }
      }

      const payload = JSON.parse(rawBody) as Record<string, unknown>
      return {
        valid: true,
        payload,
        eventType: String(payload.status ?? 'UNKNOWN'),
        providerRef: String(payload.order_id ?? payload.pay_token ?? ''),
      }
    } catch {
      return { valid: false }
    }
  }
}
