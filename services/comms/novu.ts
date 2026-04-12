// ─── Novu Notification Adapter ────────────────────────────────────────────────
// Unified notification dispatch: in-app, push, email, SMS, WhatsApp.
// Uses Novu when NOVU_API_KEY is set; falls back to DB-only notifications.

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP'

export interface NotificationPayload {
  /** Novu workflow/template identifier */
  workflowId: string
  recipientId: string
  recipientPhone?: string
  recipientEmail?: string
  data: Record<string, unknown>
  channels?: NotificationChannel[]
}

export interface NotificationResult {
  success: boolean
  notificationId?: string
  error?: string
}

export interface NotificationAdapter {
  send(payload: NotificationPayload): Promise<NotificationResult>
}

// ─── Novu Adapter ─────────────────────────────────────────────────────────────

class NovuAdapter implements NotificationAdapter {
  private apiKey = process.env.NOVU_API_KEY ?? ''
  private baseUrl = process.env.NOVU_BASE_URL ?? 'https://api.novu.co/v1'

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    if (!this.apiKey) {
      return { success: false, error: 'Novu API key not configured' }
    }

    try {
      const res = await fetch(`${this.baseUrl}/events/trigger`, {
        method: 'POST',
        headers: {
          Authorization: `ApiKey ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.workflowId,
          to: {
            subscriberId: payload.recipientId,
            ...(payload.recipientPhone ? { phone: payload.recipientPhone } : {}),
            ...(payload.recipientEmail ? { email: payload.recipientEmail } : {}),
          },
          payload: payload.data,
        }),
      })

      const data = await res.json() as { data?: { transactionId?: string }; error?: string }
      return {
        success: res.ok,
        notificationId: data.data?.transactionId,
        error: res.ok ? undefined : data.error,
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }
}

export const notifications: NotificationAdapter = new NovuAdapter()

// ─── Notification Workflow IDs ─────────────────────────────────────────────────

export const WORKFLOWS = {
  WELCOME: 'welcome',
  OTP_VERIFY: 'otp-verify',
  NEW_MESSAGE: 'new-message',
  PAYMENT_COMPLETED: 'payment-completed',
  PAYMENT_FAILED: 'payment-failed',
  LISTING_BOOSTED: 'listing-boosted',
  SUBSCRIPTION_CONFIRMED: 'subscription-confirmed',
  SUBSCRIPTION_EXPIRING: 'subscription-expiring',
  KYC_APPROVED: 'kyc-approved',
  KYC_REJECTED: 'kyc-rejected',
  TONTINE_REMINDER: 'tontine-reminder',
  TONTINE_PAYOUT: 'tontine-payout',
  REFERRAL_REWARD: 'referral-reward',
} as const
