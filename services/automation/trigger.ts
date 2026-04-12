// ─── Trigger.dev Background Jobs ─────────────────────────────────────────────
// Adapter layer for durable background jobs.
// When TRIGGER_API_KEY is set, jobs are dispatched to Trigger.dev.
// Otherwise falls back to DB-backed BackgroundJob queue for polling.

export interface JobPayload {
  type: string
  data: Record<string, unknown>
  delay?: number
  maxAttempts?: number
}

export interface JobResult {
  jobId: string
  queued: boolean
}

export interface JobAdapter {
  enqueue(payload: JobPayload): Promise<JobResult>
}

// ─── DB Fallback Adapter ──────────────────────────────────────────────────────

export class DbJobAdapter implements JobAdapter {
  constructor(
    private db: {
      backgroundJob: {
        create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>
      }
    },
  ) {}

  async enqueue(payload: JobPayload): Promise<JobResult> {
    const job = await this.db.backgroundJob.create({
      data: {
        queue: 'default',
        type: payload.type,
        payload: payload.data as never,
        status: 'QUEUED',
        maxAttempts: payload.maxAttempts ?? 3,
        runAt: payload.delay
          ? new Date(Date.now() + payload.delay)
          : new Date(),
      },
    })
    return { jobId: job.id, queued: true }
  }
}

// ─── Well-known Job Types ─────────────────────────────────────────────────────

export const JOBS = {
  // Messaging
  SEND_SMS: 'send_sms',
  SEND_EMAIL: 'send_email',
  SEND_PUSH: 'send_push',
  // Payments
  PAYMENT_RETRY: 'payment_retry',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  // Listings
  LISTING_EXPIRY_CHECK: 'listing_expiry_check',
  LISTING_BOOST_EXPIRY: 'listing_boost_expiry',
  // Media
  IMAGE_OPTIMIZE: 'image_optimize',
  // Analytics
  ANALYTICS_FLUSH: 'analytics_flush',
  // Growth
  ONBOARDING_REMINDER: 'onboarding_reminder',
  INCOMPLETE_LISTING: 'incomplete_listing',
  REENGAGEMENT: 'reengagement',
  // Tontine
  TONTINE_REMINDER: 'tontine_reminder',
  TONTINE_ROUND_ADVANCE: 'tontine_round_advance',
  // Moderation
  MODERATION_ESCALATION: 'moderation_escalation',
  // KYC
  KYC_REVIEW_REMINDER: 'kyc_review_reminder',
} as const

export type JobType = (typeof JOBS)[keyof typeof JOBS]
