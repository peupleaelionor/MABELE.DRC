// ─── Universal Payment Provider Abstraction ───────────────────────────────────
// All payment providers implement this interface.
// The core payment engine only depends on this contract, never on a specific SDK.
// Orange Money RDC and Airtel Money RDC are first-class citizens.
// Stripe is an optional adapter for cross-border / business flows.

export interface PaymentInitiateInput {
  /** Internal reference — must be idempotent */
  reference: string
  amount: number
  currency: string
  /** Phone number in E.164 format e.g. +243812345678 */
  phone: string
  description?: string
  callbackUrl?: string
  metadata?: Record<string, unknown>
}

export interface PaymentInitiateResult {
  providerRef: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  redirectUrl?: string
  deepLink?: string
  ussdCode?: string
  expiresAt?: Date
  rawResponse?: unknown
}

export interface PaymentStatusResult {
  providerRef: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  amount?: number
  currency?: string
  completedAt?: Date
  failureReason?: string
  rawResponse?: unknown
}

export interface RefundInput {
  providerRef: string
  amount?: number
  reason?: string
}

export interface RefundResult {
  refundRef: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  rawResponse?: unknown
}

export interface WebhookVerification {
  valid: boolean
  payload?: Record<string, unknown>
  eventType?: string
  providerRef?: string
}

export interface PaymentProvider {
  readonly name: string
  readonly displayName: string
  readonly currency: string
  readonly country: string

  initiatePayment(input: PaymentInitiateInput): Promise<PaymentInitiateResult>
  getPaymentStatus(providerRef: string): Promise<PaymentStatusResult>
  refundPayment(input: RefundInput): Promise<RefundResult>
  verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<WebhookVerification>
}
