'use client'
// ─── Payer un Marchand — Dark Premium ─────────────────────────────────────────
import { useState } from 'react'

const ACC = '#E05C1A'

type Step = 'scan' | 'amount' | 'confirm' | 'success'

const STEPS: Step[] = ['scan', 'amount', 'confirm']

export default function MerchantPage() {
  const [step,    setStep]    = useState<Step>('scan')
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)

  const MERCHANT = { name: 'Boutique Maisha', phone: '+243 81 000 1234', verified: true }

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('success')
  }

  const stepBack = () =>
    setStep(step === 'amount' ? 'scan' : step === 'confirm' ? 'amount' : 'scan')

  const stepTitle: Record<Step, string> = {
    scan:    '📱 Scanner QR',
    amount:  '💰 Montant',
    confirm: '✓ Confirmer',
    success: '',
  }
  const stepSub: Record<Step, string> = {
    scan:    'Scannez le QR code du marchand',
    amount:  `Payer ${MERCHANT.name}`,
    confirm: 'Vérifiez les informations',
    success: '',
  }

  return (
    <div className="p-4 lg:p-6 max-w-md mx-auto">

      <div className="flex items-center gap-3 mb-6">
        {step !== 'scan' && step !== 'success' && (
          <button onClick={stepBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.60)' }}>
            ←
          </button>
        )}
        {step !== 'success' && (
          <div>
            <h1 className="font-bold text-2xl text-white">{stepTitle[step]}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{stepSub[step]}</p>
          </div>
        )}
      </div>

      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => {
            const done    = STEPS.indexOf(step) > i
            const current = step === s
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                       style={{
                         backgroundColor: current ? ACC : done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                         color:           current ? 'white' : done ? '#22C55E' : 'rgba(255,255,255,0.35)',
                       }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] font-medium hidden sm:block"
                        style={{ color: current ? ACC : 'rgba(255,255,255,0.35)' }}>
                    {s === 'scan' ? 'Scanner' : s === 'amount' ? 'Montant' : 'Confirmer'}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />}
              </div>
            )
          })}
        </div>
      )}

      {step === 'scan' && (
        <div className="rounded-2xl p-6 text-center"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="relative w-56 h-56 mx-auto mb-6 rounded-2xl overflow-hidden"
               style={{ backgroundColor: '#2A2A2A', border: `3px solid ${ACC}` }}>
            {[['top-2 left-2'],['top-2 right-2'],['bottom-2 left-2'],['bottom-2 right-2']].map(([pos], i) => (
              <div key={i} className={`absolute ${pos} w-7 h-7 border-4 rounded-sm`}
                   style={{
                     borderColor: ACC,
                     borderRight:  pos.includes('right')  ? undefined : 'none',
                     borderLeft:   pos.includes('left')   ? undefined : 'none',
                     borderBottom: pos.includes('bottom') ? undefined : 'none',
                     borderTop:    pos.includes('top')    ? undefined : 'none',
                     margin: '6px',
                   }} />
            ))}
            <div className="absolute left-4 right-4 h-0.5 top-1/2 -translate-y-1/2 animate-pulse"
                 style={{ backgroundColor: ACC }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-20">📱</span>
            </div>
          </div>

          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Pointez la caméra vers le QR code du marchand
          </p>
          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.30)' }}>
            ou entrez manuellement le numéro
          </p>

          <div className="flex rounded-xl overflow-hidden mb-4"
               style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="flex items-center gap-1.5 px-3 flex-shrink-0"
                 style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
              <span>🇨🇩</span>
              <span className="text-sm font-semibold text-white">+243</span>
            </div>
            <input type="tel" placeholder="Numéro du marchand..."
              className="flex-1 px-3 py-3 text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A' }} />
          </div>

          <button onClick={() => setStep('amount')}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
            Continuer →
          </button>
        </div>
      )}

      {step === 'amount' && (
        <div className="rounded-2xl p-6"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-6"
               style={{ backgroundColor: '#2D2D2D' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                 style={{ backgroundColor: ACC }}>B</div>
            <div>
              <p className="font-semibold text-sm text-white">{MERCHANT.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{MERCHANT.phone}</p>
            </div>
            {MERCHANT.verified && (
              <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>✓ Vérifié</span>
            )}
          </div>

          <div className="text-center mb-6">
            <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>Montant à payer (CDF)</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>CDF</span>
              <input type="number" inputMode="numeric" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-4xl font-bold text-center w-40 focus:outline-none bg-transparent text-white" />
            </div>
            {amount && (
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                ≈ {(parseInt(amount) / 2780).toFixed(2)} USD
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {['5 000', '10 000', '25 000', '50 000', '100 000', 'Autre'].map((v) => (
              <button key={v}
                onClick={() => setAmount(v === 'Autre' ? '' : v.replace(/\s/g, ''))}
                className="py-2 rounded-lg text-xs font-medium transition-all hover:border-orange-500"
                style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)', backgroundColor: '#2A2A2A' }}>
                {v === 'Autre' ? v : `${v} CDF`}
              </button>
            ))}
          </div>

          <input placeholder="Note (optionnel)" readOnly
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none mb-4"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />

          <button onClick={() => setStep('confirm')} disabled={!amount}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              backgroundColor: amount ? ACC : 'rgba(255,255,255,0.08)',
              color:           amount ? 'white' : 'rgba(255,255,255,0.30)',
              boxShadow:       amount ? '0 4px 16px rgba(224,92,26,0.35)' : 'none',
            }}>
            Continuer →
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="rounded-2xl p-6"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="font-semibold text-base text-white text-center mb-4">Résumé du paiement</h3>

          <div className="space-y-2 mb-6">
            {[
              { label: 'Marchand',   val: MERCHANT.name },
              { label: 'Numéro',     val: MERCHANT.phone },
              { label: 'Montant',    val: `${parseInt(amount).toLocaleString('fr-FR')} CDF` },
              { label: 'Équivalent', val: `≈ ${(parseInt(amount) / 2780).toFixed(2)} USD` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                   style={{ backgroundColor: '#2D2D2D' }}>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>{row.label}</span>
                <span className="text-sm font-semibold text-white">{row.val}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl mb-5"
               style={{ backgroundColor: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)' }}>
            <span>🔒</span>
            <p className="text-xs font-medium" style={{ color: '#22C55E' }}>
              Paiement sécurisé KangaPay — 256-bit SSL
            </p>
          </div>

          <button onClick={handlePay} disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
            {loading
              ? <><span className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: 'white' }} /> Traitement...</>
              : '✓ Confirmer le paiement'}
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="rounded-2xl p-8 text-center"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
               style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
            ✅
          </div>
          <h2 className="font-bold text-xl text-white mb-1">Paiement réussi !</h2>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {parseInt(amount).toLocaleString('fr-FR')} CDF envoyés à
          </p>
          <p className="font-semibold text-base text-white mb-6">{MERCHANT.name}</p>

          <div className="p-3 rounded-xl mb-6"
               style={{ backgroundColor: '#2D2D2D' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Référence · <span className="text-white">KP-{Date.now().toString().slice(-8)}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStep('scan'); setAmount('') }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)' }}>
              Nouveau paiement
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: ACC }}>
              Télécharger reçu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
