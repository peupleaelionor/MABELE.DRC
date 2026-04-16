'use client'
// ─── KangaPay — Payer un Marchand / Scanner QR ────────────────────────────────
// Source: Board 3 — QR scanner + amount entry
import { useState } from 'react'

type Step = 'scan' | 'amount' | 'confirm' | 'success'

export default function MerchantPage() {
  const [step, setStep] = useState<Step>('scan')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const MERCHANT = { name: 'Boutique Maisha', phone: '+243 81 000 1234', verified: true }

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('success')
  }

  return (
    <div className="p-4 lg:p-6 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step !== 'scan' && (
          <button onClick={() => setStep(step === 'amount' ? 'scan' : step === 'confirm' ? 'amount' : 'scan')}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ backgroundColor: '#F5F8FC', color: '#3D526B' }}>
            ←
          </button>
        )}
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>
            {step === 'scan'    ? '📱 Scanner QR'      :
             step === 'amount'  ? '💰 Montant'          :
             step === 'confirm' ? '✓ Confirmer'         :
                                  ''}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>
            {step === 'scan'    ? 'Scannez le QR code du marchand'          :
             step === 'amount'  ? `Payer ${MERCHANT.name}`                  :
             step === 'confirm' ? 'Vérifiez les informations'               :
                                  ''}
          </p>
        </div>
      </div>

      {/* Stepper */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-6">
          {(['scan', 'amount', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{
                       backgroundColor: step === s ? '#1B4FB3' : ['scan','amount','confirm'].indexOf(step) > i ? '#DCFCE7' : '#F5F8FC',
                       color: step === s ? 'white' : ['scan','amount','confirm'].indexOf(step) > i ? '#16A34A' : '#8FA4BA',
                     }}>
                  {['scan','amount','confirm'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                <span className="text-[10px] font-medium hidden sm:block"
                      style={{ color: step === s ? '#1B4FB3' : '#8FA4BA' }}>
                  {s === 'scan' ? 'Scanner' : s === 'amount' ? 'Montant' : 'Confirmer'}
                </span>
              </div>
              {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: '#E8EEF4' }} />}
            </div>
          ))}
        </div>
      )}

      {/* Step: Scan */}
      {step === 'scan' && (
        <div className="bg-white rounded-2xl p-6 text-center"
             style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.07)' }}>
          {/* QR Frame */}
          <div className="relative w-56 h-56 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: '#F5F8FC' }} />
            {/* Corner markers */}
            {[['top-2 left-2', 'rounded-tl-xl'],['top-2 right-2', 'rounded-tr-xl'],
              ['bottom-2 left-2', 'rounded-bl-xl'],['bottom-2 right-2', 'rounded-br-xl']].map(([pos, rnd], i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8`}
                   style={{ border: `3px solid #1B4FB3` }}/>
            ))}
            {/* Animated scan line */}
            <div className="absolute left-4 right-4 h-0.5 top-1/2 -translate-y-1/2 animate-pulse"
                 style={{ backgroundColor: '#F5A623' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-20">📱</span>
            </div>
          </div>

          <p className="text-sm mb-2" style={{ color: '#8FA4BA' }}>
            Pointez la caméra vers le QR code du marchand
          </p>
          <p className="text-xs mb-6" style={{ color: '#8FA4BA' }}>
            ou entrez manuellement le numéro
          </p>

          {/* Manual input */}
          <div className="flex rounded-xl overflow-hidden mb-4"
               style={{ border: '1px solid #D0DBE8' }}>
            <div className="flex items-center gap-1.5 px-3 flex-shrink-0"
                 style={{ backgroundColor: '#F5F8FC', borderRight: '1px solid #D0DBE8' }}>
              <span>🇨🇩</span>
              <span className="text-sm font-semibold" style={{ color: '#0C1E47' }}>+243</span>
            </div>
            <input type="tel" placeholder="Numéro du marchand..."
              className="flex-1 px-3 py-3 text-sm bg-white focus:outline-none"
              style={{ color: '#0C1E47' }} />
          </div>

          <button onClick={() => setStep('amount')}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.30)' }}>
            Continuer →
          </button>
        </div>
      )}

      {/* Step: Amount */}
      {step === 'amount' && (
        <div className="bg-white rounded-2xl p-6"
             style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.07)' }}>
          {/* Merchant */}
          <div className="flex items-center gap-3 p-3 rounded-xl mb-6"
               style={{ backgroundColor: '#F5F8FC' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                 style={{ backgroundColor: '#1B4FB3', color: 'white' }}>B</div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#0C1E47' }}>{MERCHANT.name}</p>
              <p className="text-xs" style={{ color: '#8FA4BA' }}>{MERCHANT.phone}</p>
            </div>
            {MERCHANT.verified && (
              <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>✓ Vérifié</span>
            )}
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-xs font-medium mb-3" style={{ color: '#8FA4BA' }}>Montant à payer (CDF)</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-medium" style={{ color: '#8FA4BA' }}>CDF</span>
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-4xl font-bold text-center w-40 focus:outline-none bg-transparent"
                style={{ color: '#0C1E47' }}
              />
            </div>
            {amount && (
              <p className="text-xs mt-2" style={{ color: '#8FA4BA' }}>
                ≈ {(parseInt(amount) / 2780).toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['5 000', '10 000', '25 000', '50 000', '100 000', 'Autre'].map((v) => (
              <button key={v} onClick={() => setAmount(v === 'Autre' ? '' : v.replace(/\s/g, ''))}
                className="py-2 rounded-lg text-xs font-medium transition-all"
                style={{ border: '1px solid #E8EEF4', color: '#3D526B', backgroundColor: 'white' }}>
                {v === 'Autre' ? v : `${v} CDF`}
              </button>
            ))}
          </div>

          {/* Note */}
          <input placeholder="Note (optionnel)" readOnly
            className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none mb-4"
            style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />

          <button onClick={() => setStep('confirm')} disabled={!amount}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              backgroundColor: amount ? '#F5A623' : '#E8EEF4',
              color:           amount ? '#0C1E47' : '#8FA4BA',
              boxShadow:       amount ? '0 4px 16px rgba(245,166,35,0.30)' : 'none',
            }}>
            Continuer →
          </button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="bg-white rounded-2xl p-6"
             style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.07)' }}>
          <h3 className="font-semibold text-base mb-4 text-center" style={{ color: '#0C1E47' }}>Résumé du paiement</h3>

          <div className="space-y-3 mb-6">
            {[
              { label: 'Marchand', val: MERCHANT.name },
              { label: 'Numéro',   val: MERCHANT.phone },
              { label: 'Montant',  val: `${parseInt(amount).toLocaleString('fr-FR')} CDF` },
              { label: 'Équivalent', val: `≈ ${(parseInt(amount) / 2780).toFixed(2)} USD` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                   style={{ backgroundColor: '#F5F8FC' }}>
                <span className="text-sm" style={{ color: '#8FA4BA' }}>{row.label}</span>
                <span className="text-sm font-semibold" style={{ color: '#0C1E47' }}>{row.val}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl mb-5"
               style={{ backgroundColor: '#DCFCE7' }}>
            <span>🔒</span>
            <p className="text-xs font-medium" style={{ color: '#16A34A' }}>
              Paiement sécurisé KangaPay — 256-bit SSL
            </p>
          </div>

          <button onClick={handlePay} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: '#1B4FB3', color: 'white', boxShadow: '0 4px 16px rgba(27,79,179,0.25)' }}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Traitement...</>
              : '✓ Confirmer le paiement'}
          </button>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="bg-white rounded-2xl p-8 text-center"
             style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.07)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
               style={{ backgroundColor: '#DCFCE7' }}>
            ✅
          </div>
          <h2 className="font-bold text-xl mb-1" style={{ color: '#0C1E47' }}>Paiement réussi !</h2>
          <p className="text-sm mb-1" style={{ color: '#8FA4BA' }}>
            {parseInt(amount).toLocaleString('fr-FR')} CDF envoyés à
          </p>
          <p className="font-semibold text-base mb-6" style={{ color: '#0C1E47' }}>{MERCHANT.name}</p>

          <div className="p-3 rounded-xl mb-6" style={{ backgroundColor: '#F5F8FC' }}>
            <p className="text-xs" style={{ color: '#8FA4BA' }}>
              Référence · <span style={{ color: '#0C1E47' }}>KP-{Date.now().toString().slice(-8)}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStep('scan'); setAmount('') }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: '1px solid #E8EEF4', color: '#3D526B', backgroundColor: 'white' }}>
              Nouveau paiement
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
              Télécharger reçu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
