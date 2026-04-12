// ─── Domain Event Types ───────────────────────────────────────────────────────

export type DomainEventType =
  // User events
  | 'user.registered'
  | 'user.verified'
  | 'user.role_changed'
  // Listing events
  | 'listing.created'
  | 'listing.updated'
  | 'listing.deleted'
  | 'listing.boosted'
  | 'listing.status_changed'
  // Message events
  | 'message.sent'
  | 'conversation.created'
  // Payment events
  | 'payment.initiated'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  // Subscription events
  | 'subscription.created'
  | 'subscription.renewed'
  | 'subscription.cancelled'
  | 'subscription.expired'
  // Billing events
  | 'billing.invoice_generated'
  // Wallet events
  | 'wallet.credited'
  | 'wallet.debited'
  | 'wallet.transfer'
  // Trust events
  | 'trust.score_updated'
  | 'trust.badge_earned'
  // Moderation events
  | 'report.submitted'
  | 'report.resolved'
  // KYC events
  | 'kyc.submitted'
  | 'kyc.approved'
  | 'kyc.rejected'
  // Tontine events
  | 'tontine.created'
  | 'tontine.member_joined'
  | 'tontine.round_completed'
  // Referral events
  | 'referral.created'
  | 'referral.converted'
  // Analytics
  | 'search.performed'
  | 'listing.viewed'

export interface DomainEventPayload {
  [key: string]: unknown
}

export interface DomainEventEnvelope<T extends DomainEventPayload = DomainEventPayload> {
  id: string
  type: DomainEventType
  aggregateId?: string
  aggregateType?: string
  userId?: string
  payload: T
  createdAt: Date
}

export type EventHandler<T extends DomainEventPayload = DomainEventPayload> = (
  event: DomainEventEnvelope<T>,
) => Promise<void> | void

// ─── Specific Event Payloads ──────────────────────────────────────────────────

export interface UserRegisteredPayload extends DomainEventPayload {
  userId: string
  phone: string
  locale: string
  referralCode?: string
}

export interface ListingCreatedPayload extends DomainEventPayload {
  listingId: string
  type: string
  userId: string
  ville?: string
  price?: number
}

export interface PaymentCompletedPayload extends DomainEventPayload {
  paymentId: string
  userId: string
  amount: number
  devise: string
  type: string
  provider?: string
}

export interface SubscriptionCreatedPayload extends DomainEventPayload {
  subscriptionId: string
  userId: string
  planKey: string
  planTier: string
  cycle: string
}
