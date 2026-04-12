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

// ─── Airtel Money RDC Provider ─────────────────────────────────────────────────
// Airtel Money is the leading mobile money network in DRC (~35% share).
// API Reference: https://developers.airtel.africa/documentation
// DRC country code: CD | Prefix: +243

interface AirtelConfig {
  clientId: string
  clientSecret: string
  baseUrl: string
  webhookSecret: string
  currency?: string
  country?: string
}

interface AirtelToken {
  access_token: string
  expires_at: number
}

export class AirtelMoneyRDC implements PaymentProvider {
  readonly name = 'AIRTEL_MONEY'
  readonly displayName = 'Airtel Money RDC'
  readonly currency = 'CDF'
  readonly country = 'CD'

  private config: AirtelConfig
  private tokenCache?: AirtelToken
  private log = logger.child({ module: 'payments', provider: 'airtel-money-rdc' })

  constructor(config?: Partial<AirtelConfig>) {
    this.config = {
      clientId: config?.clientId ?? process.env.AIRTEL_CLIENT_ID ?? '',
      clientSecret: config?.clientSecret ?? process.env.AIRTEL_CLIENT_SECRET ?? '',
      baseUrl: config?.baseUrl ?? process.env.AIRTEL_BASE_URL ?? 'https://openapi.airtel.africa',
      webhookSecret: config?.webhookSecret ?? process.env.AIRTEL_WEBHOOK_SECRET ?? '',
      currency: config?.currency ?? 'CDF',
      country: config?.country ?? 'CD',
    }
  }

  private async getToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expires_at > Date.now() + 60_000) {
      return this.tokenCache.access_token
    }

    const res = await fetch(`${this.config.baseUrl}/auth/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    if (!res.ok) {
      this.log.error('Airtel Money token fetch failed', { status: res.status })
      throw new Error("Impossible d'obtenir le token Airtel Money")
    }

    const data = await res.json() as {
      access_token: string
      expires_in: number
    }

    this.tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    }
    return this.tokenCache.access_token
  }

  private normalizePhone(phone: string): string {
    // Convert +243XXXXXXXXX → XXXXXXXXX (9 digits)
    return phone.replace(/^\+243/, '').replace(/^0/, '').replace(/\s/g, '')
  }

  async initiatePayment(input: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    try {
      const token = await this.getToken()
      const msisdn = this.normalizePhone(input.phone)

      const body = {
        reference: input.reference,
        subscriber: { country: this.country, currency: input.currency || this.currency, msisdn },
        transaction: {
          amount: input.amount,
          country: this.country,
          currency: input.currency || this.currency,
          id: input.reference,
        },
      }

      const res = await fetch(`${this.config.baseUrl}/merchant/v1/payments/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Country': this.country,
          'X-Currency': input.currency || this.currency,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json() as {
        data?: { transaction?: { id?: string; status?: string; airtel_money_id?: string } }
        status?: { code?: string; message?: string; result_code?: string }
      }

      const txStatus = data.data?.transaction?.status
      if (!res.ok || data.status?.result_code === 'DP00800001006') {
        this.log.error('Airtel Money payment failed', { data })
        return { providerRef: input.reference, status: 'FAILED', rawResponse: data }
      }

      const providerRef =
        data.data?.transaction?.airtel_money_id ??
        data.data?.transaction?.id ??
        input.reference

      this.log.info('Airtel Money payment initiated', {
        reference: input.reference,
        providerRef,
      })

      return {
        providerRef,
        status: txStatus === 'TS' ? 'COMPLETED' : 'PENDING',
        rawResponse: data,
      }
    } catch (err) {
      this.log.error('Airtel Money initiatePayment error', err)
      throw err
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentStatusResult> {
    try {
      const token = await this.getToken()

      const res = await fetch(
        `${this.config.baseUrl}/standard/v1/payments/${providerRef}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Country': this.country,
            'X-Currency': this.currency,
          },
        },
      )

      const data = await res.json() as {
        data?: {
          transaction?: {
            airtel_money_id?: string
            id?: string
            status?: string
            message?: string
          }
        }
      }

      const tx = data.data?.transaction
      const airtelStatusMap: Record<string, PaymentStatusResult['status']> = {
        TS: 'COMPLETED',
        TF: 'FAILED',
        TP: 'PENDING',
        AM: 'PROCESSING',
        REFUNDED: 'REFUNDED',
      }

      return {
        providerRef,
        status: airtelStatusMap[tx?.status ?? ''] ?? 'PENDING',
        currency: this.currency,
        failureReason: tx?.message,
        rawResponse: data,
      }
    } catch (err) {
      this.log.error('Airtel Money getPaymentStatus error', err)
      throw err
    }
  }

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    try {
      const token = await this.getToken()

      const res = await fetch(`${this.config.baseUrl}/standard/v1/payments/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Country': this.country,
          'X-Currency': this.currency,
        },
        body: JSON.stringify({
          transaction: { airtel_money_id: input.providerRef },
        }),
      })

      const data = await res.json() as { status?: { result_code?: string } }
      const ok = data.status?.result_code === 'ESB000010'

      return {
        refundRef: input.providerRef,
        status: ok ? 'COMPLETED' : 'FAILED',
        rawResponse: data,
      }
    } catch (err) {
      this.log.error('Airtel Money refundPayment error', err)
      throw err
    }
  }

  async verifyWebhook(
    headers: Record<string, string>,
    rawBody: string,
  ): Promise<WebhookVerification> {
    try {
      const signature = headers['x-airtel-signature'] ?? ''
      if (!this.config.webhookSecret) {
        this.log.warn('Airtel Money webhook secret not configured')
        return { valid: true, payload: JSON.parse(rawBody) }
      }

      const expected = createHmac('sha256', this.config.webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (signature !== expected) {
        this.log.warn('Airtel Money webhook signature mismatch')
        return { valid: false }
      }

      const payload = JSON.parse(rawBody) as Record<string, unknown>
      const tx = (payload.transaction ?? {}) as Record<string, unknown>
      return {
        valid: true,
        payload,
        eventType: String(tx.status ?? 'UNKNOWN'),
        providerRef: String(tx.airtel_money_id ?? tx.id ?? ''),
      }
    } catch {
      return { valid: false }
    }
  }
}
