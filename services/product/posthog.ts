// ─── PostHog Analytics Integration ───────────────────────────────────────────
// Wrap PostHog so the rest of the app never imports posthog-js directly.
// Swap this adapter for any other analytics provider without touching product code.

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  userId?: string
}

export interface AnalyticsAdapter {
  identify(userId: string, traits?: Record<string, unknown>): void
  track(event: string, properties?: Record<string, unknown>): void
  page(name: string, properties?: Record<string, unknown>): void
  reset(): void
}

// ─── PostHog Adapter ─────────────────────────────────────────────────────────

class PostHogAdapter implements AnalyticsAdapter {
  private apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
  private host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'
  private posthog: unknown = null

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !this.apiKey) return
    // Lazy-load to not block initial render
    try {
      const { default: posthog } = await import('posthog-js')
      posthog.init(this.apiKey, {
        api_host: this.host,
        capture_pageview: false, // manual control
        capture_pageleave: true,
        persistence: 'localStorage',
        autocapture: false,
        disable_session_recording: false,
      })
      this.posthog = posthog
    } catch {
      // posthog-js not installed yet — noop
    }
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    if (!this.posthog) return
    ;(this.posthog as { identify: (id: string, traits?: Record<string, unknown>) => void }).identify(userId, traits)
  }

  track(event: string, properties?: Record<string, unknown>): void {
    if (!this.posthog) return
    ;(this.posthog as { capture: (event: string, props?: Record<string, unknown>) => void }).capture(event, properties)
  }

  page(name: string, properties?: Record<string, unknown>): void {
    this.track('$pageview', { page: name, ...properties })
  }

  reset(): void {
    if (!this.posthog) return
    ;(this.posthog as { reset: () => void }).reset()
  }
}

// ─── Noop Adapter (SSR / tests) ───────────────────────────────────────────────

class NoopAdapter implements AnalyticsAdapter {
  identify() {}
  track() {}
  page() {}
  reset() {}
}

export const analytics: AnalyticsAdapter =
  typeof window !== 'undefined' ? new PostHogAdapter() : new NoopAdapter()

// ─── Key MABELE Events ────────────────────────────────────────────────────────
// Use these typed helpers instead of raw track() strings.

export const track = {
  pageView: (page: string) => analytics.page(page),
  onboarding: {
    started: () => analytics.track('onboarding_started'),
    step: (step: number) => analytics.track('onboarding_step', { step }),
    completed: () => analytics.track('onboarding_completed'),
  },
  listing: {
    viewed: (id: string, type: string) => analytics.track('listing_viewed', { listing_id: id, type }),
    created: (type: string) => analytics.track('listing_created', { type }),
    boosted: (id: string) => analytics.track('listing_boosted', { listing_id: id }),
    searched: (query: string, results: number) => analytics.track('search_executed', { query, results }),
  },
  payment: {
    started: (type: string, provider: string) => analytics.track('payment_started', { type, provider }),
    completed: (type: string, amount: number) => analytics.track('payment_completed', { type, amount }),
    failed: (type: string, reason?: string) => analytics.track('payment_failed', { type, reason }),
    qrScanned: () => analytics.track('qr_scanned'),
  },
  message: {
    sent: () => analytics.track('message_sent'),
    conversationStarted: () => analytics.track('conversation_started'),
  },
  billing: {
    planViewed: (plan: string) => analytics.track('plan_viewed', { plan }),
    subscribed: (plan: string, cycle: string) => analytics.track('subscribed', { plan, cycle }),
    cancelled: () => analytics.track('subscription_cancelled'),
  },
}
