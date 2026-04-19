'use client'
// ─── Envoyer Argent — Dark Premium ────────────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

type State = 'form' | 'loading' | 'success'

export default function EnvoyerPage() {
  const [state,  setState]  = useState<State>('form')
  const [phone,  setPhone]  = useState('')
  const [amount, setAmount] = useState('')
  const [note,   setNote]   = useState('')

  if (state === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
             style={{ backgroundColor: '#242424' }}>
          <span className="w-10 h-10 border-4 rounded-full animate-spin block"
                style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: ACC }} />
        </div>
        <p className="font-semibold text-white">Paiement en cours...</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>Validation en cours</p>
      </div>
    </div>
  )

  if (state === 'success') return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="text-center max-w-xs w-full animate-scale-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
             style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 24l8 8 14-16" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-bold text-2xl text-white mb-1">Paiement Réussi</h1>
        <p className="font-bold my-3" style={{ color: '#22C55E', fontSize:'2rem' }}>
          {parseInt(amount).toLocaleString('fr')} CDF
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Envoyé avec succès à +243 {phone}
        </p>
        <div className="mt-8 space-y-3">
          <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
            📄 Voir le reçu
          </button>
          <Link href="/finance"
            className="w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            ← Retour au portefeuille
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/finance"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>←</Link>
          <h1 className="font-semibold text-base text-white">Envoyer Argent</h1>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4 pb-32">
        <div className="rounded-2xl p-5"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5"
                     style={{ color: 'rgba(255,255,255,0.55)' }}>Numéro du destinataire</label>
              <div className="flex rounded-xl overflow-hidden"
                   style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex items-center gap-1.5 px-3 select-none flex-shrink-0"
                     style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
                  <span>🇨🇩</span>
                  <span className="text-sm font-semibold text-white">+243</span>
                </div>
                <input type="tel" inputMode="numeric" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,9))}
                  placeholder="81 234 5678"
                  className="flex-1 px-3 py-3 text-sm text-white focus:outline-none"
                  style={{ backgroundColor: '#2A2A2A' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5"
                     style={{ color: 'rgba(255,255,255,0.55)' }}>Montant (CDF)</label>
              <div className="relative">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none pr-16"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)', fontSize:'1.1rem', fontWeight:600 }} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{ color: 'rgba(255,255,255,0.40)' }}>CDF</span>
              </div>
              {amount && (
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  ≈ {(parseInt(amount)/2780).toFixed(2)} USD
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5"
                     style={{ color: 'rgba(255,255,255,0.55)' }}>Note (optionnel)</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)}
                placeholder="Paiement loyer, dette..."
                className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none"
                style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
            </div>
          </div>
        </div>

        {amount && phone.length >= 9 && (
          <div className="rounded-2xl p-4"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
               style={{ color: 'rgba(255,255,255,0.35)' }}>Résumé</p>
            {[
              ['Destinataire', `+243 ${phone}`],
              ['Montant',      `${parseInt(amount).toLocaleString('fr')} CDF`],
              ['Frais KangaPay','0 CDF'],
              ['Total débité', `${parseInt(amount).toLocaleString('fr')} CDF`],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 text-sm"
                   style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'rgba(255,255,255,0.40)' }}>{k}</span>
                <span className="font-medium text-white">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-lg mx-auto">
          <button disabled={!amount || phone.length < 9}
            onClick={async () => {
              setState('loading')
              await new Promise(r => setTimeout(r, 1500))
              setState('success')
            }}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              backgroundColor: amount && phone.length >= 9 ? ACC : 'rgba(255,255,255,0.08)',
              color: amount && phone.length >= 9 ? 'white' : 'rgba(255,255,255,0.30)',
              boxShadow: amount && phone.length >= 9 ? '0 4px 16px rgba(224,92,26,0.35)' : 'none',
            }}>
            ✈ Envoyer {amount ? `${parseInt(amount).toLocaleString('fr')} CDF` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
