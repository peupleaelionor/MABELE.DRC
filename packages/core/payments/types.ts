import type { PaymentIntent } from '@prisma/client'

// ─── Payment Types ───────────────────────────────────────────────────────────

export type PaymentProvider =
  | 'AIRTEL_MONEY'
  | 'MPESA'
  | 'ORANGE_MONEY'
  | 'AFRICELL'
  | 'WALLET'
  | 'MANUAL'

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface InitiatePaymentInput {
  userId: string
  amount: number
  devise?: string
  type: 'LISTING_BOOST' | 'PREMIUM' | 'DEPOSIT' | 'PURCHASE' | 'SUBSCRIPTION'
  provider?: string
  metadata?: Record<string, unknown>
}

// ─── Result Types ────────────────────────────────────────────────────────────

export interface PaymentResult {
  id: string
  status: string
  reference?: string | null
  providerResponse?: Record<string, unknown> | null
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaymentPaginationOptions {
  page?: number
  limit?: number
  status?: string
}

export interface PaginatedPayments {
  payments: PaymentIntent[]
  total: number
  page: number
  limit: number
}
