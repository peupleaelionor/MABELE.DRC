import type { PrismaClient, PaymentIntent, Prisma } from '@prisma/client'
import type {
  InitiatePaymentInput,
  PaymentResult,
  PaymentPaginationOptions,
  PaginatedPayments,
} from './types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PAY-${timestamp}-${random}`
}

function toPaymentResult(payment: PaymentIntent): PaymentResult {
  return {
    id: payment.id,
    status: payment.status,
    reference: payment.reference,
    providerResponse: payment.metadata as Record<string, unknown> | null,
  }
}

// ─── Initiate Payment ────────────────────────────────────────────────────────

export async function initiatePayment(
  prisma: PrismaClient,
  input: InitiatePaymentInput,
): Promise<PaymentResult> {
  const reference = generateReference()

  const payment = await prisma.paymentIntent.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      devise: input.devise ?? 'USD',
      type: input.type,
      provider: input.provider ?? null,
      status: 'PENDING',
      reference,
      metadata: (input.metadata as Prisma.InputJsonValue) ?? undefined,
    },
  })

  return toPaymentResult(payment)
}

// ─── Confirm Payment ─────────────────────────────────────────────────────────

export async function confirmPayment(
  prisma: PrismaClient,
  paymentId: string,
  providerData?: Record<string, unknown>,
): Promise<PaymentResult> {
  const existing = await prisma.paymentIntent.findUnique({
    where: { id: paymentId },
  })

  if (!existing) {
    throw new Error('Paiement introuvable')
  }

  if (existing.status !== 'PENDING' && existing.status !== 'PROCESSING') {
    throw new Error(`Impossible de confirmer un paiement avec le statut ${existing.status}`)
  }

  const mergedMetadata = {
    ...(existing.metadata as Record<string, unknown> | null),
    ...providerData,
    confirmedAt: new Date().toISOString(),
  }

  const payment = await prisma.paymentIntent.update({
    where: { id: paymentId },
    data: {
      status: 'COMPLETED',
      metadata: mergedMetadata as Prisma.InputJsonValue,
    },
  })

  return toPaymentResult(payment)
}

// ─── Fail Payment ────────────────────────────────────────────────────────────

export async function failPayment(
  prisma: PrismaClient,
  paymentId: string,
  reason?: string,
): Promise<PaymentResult> {
  const existing = await prisma.paymentIntent.findUnique({
    where: { id: paymentId },
  })

  if (!existing) {
    throw new Error('Paiement introuvable')
  }

  const mergedMetadata = {
    ...(existing.metadata as Record<string, unknown> | null),
    failureReason: reason ?? null,
    failedAt: new Date().toISOString(),
  }

  const payment = await prisma.paymentIntent.update({
    where: { id: paymentId },
    data: {
      status: 'FAILED',
      metadata: mergedMetadata as Prisma.InputJsonValue,
    },
  })

  return toPaymentResult(payment)
}

// ─── Refund Payment ──────────────────────────────────────────────────────────

export async function refundPayment(
  prisma: PrismaClient,
  paymentId: string,
): Promise<PaymentResult> {
  const existing = await prisma.paymentIntent.findUnique({
    where: { id: paymentId },
  })

  if (!existing) {
    throw new Error('Paiement introuvable')
  }

  if (existing.status !== 'COMPLETED') {
    throw new Error('Seuls les paiements complétés peuvent être remboursés')
  }

  const mergedMetadata = {
    ...(existing.metadata as Record<string, unknown> | null),
    refundedAt: new Date().toISOString(),
  }

  const payment = await prisma.paymentIntent.update({
    where: { id: paymentId },
    data: {
      status: 'REFUNDED',
      metadata: mergedMetadata as Prisma.InputJsonValue,
    },
  })

  return toPaymentResult(payment)
}

// ─── Get User Payments ───────────────────────────────────────────────────────

export async function getUserPayments(
  prisma: PrismaClient,
  userId: string,
  options: PaymentPaginationOptions = {},
): Promise<PaginatedPayments> {
  const page = Math.max(1, options.page ?? 1)
  const limit = Math.min(100, Math.max(1, options.limit ?? 20))
  const skip = (page - 1) * limit

  const where: Prisma.PaymentIntentWhereInput = { userId }
  if (options.status) {
    where.status = options.status as PaymentIntent['status']
  }

  const [payments, total] = await Promise.all([
    prisma.paymentIntent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.paymentIntent.count({ where }),
  ])

  return { payments, total, page, limit }
}

// ─── Get Payment By ID ───────────────────────────────────────────────────────

export async function getPaymentById(
  prisma: PrismaClient,
  paymentId: string,
): Promise<PaymentIntent | null> {
  const payment = await prisma.paymentIntent.findUnique({
    where: { id: paymentId },
  })

  return payment
}
