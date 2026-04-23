'use client'
// ─── Checkout — Dark Premium ───────────────────────────────────────────────────
// Unified checkout page for: market purchases, immo reservations, services
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const ACC = '#E05C1A'

type Provider = 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'STRIPE' | 'WALLET'

const PROVIDERS: { id: Provider; label: string; icon: string; desc: string }[] = [
  { id: 'ORANGE_MONEY', label: 'Orange Money',  icon: '🟠', desc: 'Paiement mobile Orange' },
  { id: 'AIRTEL_MONEY', label: 'Airtel Money',  icon: '🔴', desc: 'Paiement mobile Airtel'  },
  { id: 'WALLET',       label: 'KangaPay',       icon: '💳', desc: 'Votre portefeuille MABELE' },
  { id: 'STRIPE',       label: 'Carte bancaire', icon: '💳', desc: 'Visa / MasterCard'       },
]

type Step = 'details' | 'payment' | 'confirm' | 'success'

function CheckoutContent() {
  const router    = useRouter()
  const params    = useSearchParams()
  const amount    = Number(params.get('amount') ?? 0)
  const currency  = params.get('currency') ?? 'USD'
  const desc      = params.get('desc') ?? 'Achat MABELE'
  const type      = params.get('type') ?? 'PURCHASE'

  const [step,     setStep]     = useState<Step>('details')
  const [provider, setProvider] = useState<Provider>('ORANGE_MONEY')
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [ref,      setRef]      = useState('')

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, provider, type, phone: phone?.trim() || undefined, description: desc }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Erreur lors du paiement')
        setLoading(false)
        return
      }
      setRef(data.data?.reference ?? '')
      setStep('success')
    } catch {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
           style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
               style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.30)' }}>
            ✓
          </div>
          <h1 className="font-bold text-2xl text-white mb-2">Paiement initié !</h1>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
            {desc}
          </p>
          <p className="text-lg font-bold mb-4" style={{ color: '#22C55E' }}>
            {amount} {currency}
          </p>
          {ref && (
            <p className="text-xs mb-6 px-3 py-2 rounded-xl"
               style={{ backgroundColor: '#242424', color: 'rgba(255,255,255,0.40)', fontFamily: 'monospace' }}>
              Réf : {ref}
            </p>
          )}
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.50)' }}>
            {provider === 'WALLET'
              ? 'Paiement débité de votre portefeuille KangaPay.'
              : 'Confirmez le paiement sur votre téléphone mobile.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/orders"
              className="block py-3 rounded-xl text-sm font-bold text-white text-center"
              style={{ backgroundColor: ACC }}>
              Voir mes commandes →
            </Link>
            <Link href="/dashboard"
              className="block py-2.5 text-sm font-medium text-center"
              style={{ color: 'rgba(255,255,255,0.50)' }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <button onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ←
          </button>
          <div className="flex-1">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Paiement sécurisé</p>
            <p className="font-semibold text-white text-sm truncate">{desc}</p>
          </div>
          <span className="text-xl">🔒</span>
        </div>
        {/* Step indicator */}
        <div className="h-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full transition-all duration-500"
               style={{
                 width: step === 'details' ? '33%' : step === 'payment' ? '66%' : '100%',
                 backgroundColor: ACC,
               }} />
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 pb-32">

        {/* Order summary */}
        <div className="rounded-xl p-4 mb-4"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-white mb-3">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Article</span>
              <span className="font-medium text-white truncate max-w-[60%] text-right">{desc}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Montant</span>
              <span className="font-bold text-lg" style={{ color: ACC }}>{amount} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Frais</span>
              <span className="font-medium" style={{ color: '#22C55E' }}>Gratuit</span>
            </div>
          </div>
          <div className="mt-3 pt-3 flex justify-between text-base font-bold"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white">Total</span>
            <span style={{ color: ACC }}>{amount} {currency}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-xl p-4 mb-4"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-white mb-3">Moyen de paiement</h2>
          <div className="space-y-2">
            {PROVIDERS.map(p => (
              <button key={p.id} onClick={() => setProvider(p.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: provider === p.id ? 'rgba(224,92,26,0.10)' : '#2A2A2A',
                  border: provider === p.id ? `1.5px solid ${ACC}` : '1px solid rgba(255,255,255,0.08)',
                }}>
                <span className="text-2xl w-8 text-center flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{p.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>{p.desc}</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                     style={{
                       borderColor: provider === p.id ? ACC : 'rgba(255,255,255,0.25)',
                       backgroundColor: provider === p.id ? ACC : 'transparent',
                     }}>
                  {provider === p.id && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phone number for mobile money */}
        {(provider === 'ORANGE_MONEY' || provider === 'AIRTEL_MONEY') && (
          <div className="rounded-xl p-4 mb-4"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white mb-3">Numéro de téléphone</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: 'rgba(255,255,255,0.40)' }}>🇨🇩 +243</span>
              <input
                type="tel"
                placeholder="8X XXX XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-20 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none"
                style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Un code USSD vous sera envoyé pour confirmer le paiement
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-3 mb-4 text-sm"
               style={{ backgroundColor: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
            ⚠ {error}
          </div>
        )}

        {/* Security note */}
        <div className="rounded-xl p-4"
             style={{ backgroundColor: '#2D2D2D', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>
            🔒 <strong className="text-white">Paiements 100% sécurisés</strong> via KangaPay.
            Vos données bancaires ne sont jamais stockées sur nos serveurs.
          </p>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePay}
            disabled={loading || ((provider === 'ORANGE_MONEY' || provider === 'AIRTEL_MONEY') && !phone)}
            className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.40)' }}>
            {loading ? '⏳ Traitement…' : `🔒 Payer ${amount} ${currency}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
        <p className="text-white text-sm">Chargement du paiement…</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
