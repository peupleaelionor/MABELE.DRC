'use client'
// ─── Login Page — Dark Premium ────────────────────────────────────────────────
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#E05C1A'

export default function LoginPage() {
  const router = useRouter()
  const [step,      setStep]      = useState<'phone' | 'otp'>('phone')
  const [phone,     setPhone]     = useState('')
  const [otp,       setOtp]       = useState(['', '', '', '', '', ''])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [countdown, setCountdown] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const fullPhone = `+243${phone}`

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 9) { setError('Numéro invalide — 9 chiffres requis'); return }
    setError(''); setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false); setStep('otp')
    setCountdown(30)
    const iv = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(iv); return 0 } return c - 1 }), 1000)
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[i] && i > 0) refs.current[i - 1]?.focus()
      setOtp((o) => { const n = [...o]; n[i] = ''; return n })
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      setOtp((o) => { const n = [...o]; n[i] = e.key; return n })
      if (i < 5) refs.current[i + 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Entrez les 6 chiffres'); return }
    setError(''); setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1A1A1A' }}>

      <nav className="h-14 flex items-center px-4" style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
          <span className="font-bold text-white">MABELE</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-8"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>

            <div className="flex justify-center mb-6">
              <img src="/favicon.svg" alt="MABELE" className="w-14 h-14" />
            </div>

            {step === 'phone' ? (
              <>
                <h1 className="font-bold text-2xl text-center text-white mb-1">Connexion</h1>
                <p className="text-sm text-center mb-6" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Entrez votre numéro de téléphone
                </p>

                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Numéro de téléphone
                    </label>
                    <div className="flex rounded-xl overflow-hidden"
                         style={{ border: `1px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.10)'}` }}>
                      <div className="flex items-center gap-1.5 px-3 select-none flex-shrink-0"
                           style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
                        <span className="text-base">🇨🇩</span>
                        <span className="text-sm font-semibold text-white">+243</span>
                      </div>
                      <input
                        type="tel" inputMode="numeric" autoFocus
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setError('') }}
                        placeholder="81 234 5678"
                        className="flex-1 px-3 py-3.5 text-sm text-white focus:outline-none"
                        style={{ backgroundColor: '#2A2A2A' }}
                      />
                    </div>
                    {error && <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>{error}</p>}
                  </div>

                  <button type="submit" disabled={loading || phone.length < 9}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 text-white"
                    style={{
                      backgroundColor: phone.length >= 9 ? ACC : 'rgba(255,255,255,0.08)',
                      color:           phone.length >= 9 ? 'white' : 'rgba(255,255,255,0.30)',
                      boxShadow:       phone.length >= 9 ? '0 4px 16px rgba(224,92,26,0.35)' : 'none',
                    }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Envoi...</>
                      : 'Continuer →'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button onClick={() => setStep('phone')}
                  className="flex items-center gap-1 text-sm mb-4 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.40)' }}>
                  ← Retour
                </button>
                <h1 className="font-bold text-2xl text-center text-white mb-1">Vérification</h1>
                <p className="text-sm text-center mb-6" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Code envoyé au <strong className="text-white">{fullPhone}</strong>
                </p>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input key={i}
                        ref={(el) => { refs.current[i] = el }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={() => {}}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="text-center text-xl font-bold rounded-xl focus:outline-none transition-all text-white"
                        style={{
                          width: '44px', height: '52px',
                          border:          `2px solid ${digit ? ACC : 'rgba(255,255,255,0.12)'}`,
                          backgroundColor: digit ? 'rgba(224,92,26,0.12)' : '#2A2A2A',
                        }}
                      />
                    ))}
                  </div>

                  {error && <p className="text-xs text-center" style={{ color: '#EF4444' }}>{error}</p>}

                  <button type="submit" disabled={loading || otp.join('').length < 6}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: otp.join('').length === 6 ? ACC : 'rgba(255,255,255,0.08)',
                      color:           otp.join('').length === 6 ? 'white' : 'rgba(255,255,255,0.30)',
                      boxShadow:       otp.join('').length === 6 ? '0 4px 16px rgba(224,92,26,0.35)' : 'none',
                    }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Vérification...</>
                      : '✓ Vérifier le code'}
                  </button>

                  <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {countdown > 0
                      ? <>Renvoyer le code dans <strong className="text-white">{countdown}s</strong></>
                      : <button type="button" onClick={handleSend} className="font-semibold" style={{ color: ACC }}>Renvoyer le code</button>}
                  </p>
                </form>
              </>
            )}

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Pas encore de compte ?{' '}
                <Link href="/register" className="font-semibold" style={{ color: ACC }}>S'inscrire</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
