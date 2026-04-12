// ─── Payment Provider Registry ────────────────────────────────────────────────
// Central registry. Resolve the right provider by name at runtime.

import type { PaymentProvider } from './provider'
import { OrangeMoneyRDC } from './providers/orange-money-rdc'
import { AirtelMoneyRDC } from './providers/airtel-money-rdc'
import { StripeProvider } from './providers/stripe'

export type ProviderName =
  | 'ORANGE_MONEY'
  | 'AIRTEL_MONEY'
  | 'MPESA'
  | 'STRIPE'
  | 'WALLET'
  | 'MANUAL'

class ProviderRegistry {
  private providers = new Map<string, PaymentProvider>()

  register(provider: PaymentProvider): void {
    this.providers.set(provider.name, provider)
  }

  get(name: ProviderName | string): PaymentProvider {
    const provider = this.providers.get(name)
    if (!provider) {
      throw new Error(`Payment provider not found: ${name}`)
    }
    return provider
  }

  has(name: string): boolean {
    return this.providers.has(name)
  }

  all(): PaymentProvider[] {
    return Array.from(this.providers.values())
  }

  /** Returns providers available for a given phone prefix */
  forPhone(phone: string): PaymentProvider[] {
    // DRC: +243
    if (phone.startsWith('+243') || phone.startsWith('243')) {
      return [
        this.providers.get('AIRTEL_MONEY'),
        this.providers.get('ORANGE_MONEY'),
      ].filter(Boolean) as PaymentProvider[]
    }
    return this.all()
  }
}

// ─── Singleton Registry ───────────────────────────────────────────────────────

export const paymentRegistry = new ProviderRegistry()

// Register default providers
paymentRegistry.register(new AirtelMoneyRDC())
paymentRegistry.register(new OrangeMoneyRDC())
paymentRegistry.register(new StripeProvider())

export { ProviderRegistry }
