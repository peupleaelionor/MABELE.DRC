'use client'
// ─── Login Page ───────────────────────────────────────────────────────────────
// Source: Board 1 — white card, phone + OTP flow
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [step,    setStep]    = useState<'phone' | 'otp'>('phone')
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F8FC' }}>

      {/* Minimal nav */}
      <nav className="h-14 flex items-center px-4 bg-white" style={{ borderBottom: '1px solid #E8EEF4' }}>
        <Link href="/"><img src="/logo.svg" alt="MABELE" className="h-8" /></Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8"
               style={{ border: '1px solid #D0DBE8', boxShadow: '0 4px 32px rgba(12,30,71,0.10)' }}>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/favicon.svg" alt="MABELE" className="w-14 h-14" />
            </div>

            {step === 'phone' ? (
              <>
                <h1 className="font-display font-bold text-2xl text-center mb-1" style={{ color: '#0C1E47' }}>
                  Connexion
                </h1>
                <p className="text-sm text-center mb-6" style={{ color: '#8FA4BA' }}>
                  Entrez votre numéro de téléphone
                </p>

                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D526B' }}>
                      Numéro de téléphone
                    </label>
                    <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${error ? '#DC2626' : '#D0DBE8'}` }}>
                      <div className="flex items-center gap-1.5 px-3 select-none flex-shrink-0"
                           style={{ backgroundColor: '#F5F8FC', borderRight: '1px solid #D0DBE8' }}>
                        <span className="text-base">🇨🇩</span>
                        <span className="text-sm font-semibold" style={{ color: '#0C1E47' }}>+243</span>
                      </div>
                      <input
                        type="tel" inputMode="numeric" autoFocus
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setError('') }}
                        placeholder="81 234 5678"
                        className="flex-1 px-3 py-3.5 text-sm bg-white focus:outline-none"
                        style={{ color: '#0C1E47' }}
                      />
                    </div>
                    {error && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{error}</p>}
                  </div>

                  <button type="submit" disabled={loading || phone.length < 9}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: phone.length >= 9 ? '#F5A623' : '#E8EEF4',
                      color:           phone.length >= 9 ? '#0C1E47' : '#8FA4BA',
                      boxShadow:       phone.length >= 9 ? '0 4px 16px rgba(245,166,35,0.30)' : 'none',
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
                  style={{ color: '#8FA4BA' }}>
                  ← Retour
                </button>
                <h1 className="font-display font-bold text-2xl text-center mb-1" style={{ color: '#0C1E47' }}>
                  Vérification
                </h1>
                <p className="text-sm text-center mb-6" style={{ color: '#8FA4BA' }}>
                  Code envoyé au <strong style={{ color: '#0C1E47' }}>{fullPhone}</strong>
                </p>

                <form onSubmit={handleVerify} className="space-y-5">
                  {/* OTP boxes */}
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input key={i}
                        ref={(el) => { refs.current[i] = el }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={() => {}}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="w-11 h-13 text-center text-xl font-bold rounded-xl focus:outline-none transition-all"
                        style={{
                          border:          `2px solid ${digit ? '#1B4FB3' : '#D0DBE8'}`,
                          backgroundColor: digit ? '#EFF6FF' : '#FFFFFF',
                          color:           '#0C1E47',
                          height:          '52px',
                        }}
                      />
                    ))}
                  </div>

                  {error && <p className="text-xs text-center" style={{ color: '#DC2626' }}>{error}</p>}

                  <button type="submit" disabled={loading || otp.join('').length < 6}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: otp.join('').length === 6 ? '#F5A623' : '#E8EEF4',
                      color:           otp.join('').length === 6 ? '#0C1E47' : '#8FA4BA',
                      boxShadow:       otp.join('').length === 6 ? '0 4px 16px rgba(245,166,35,0.30)' : 'none',
                    }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Vérification...</>
                      : '✓ Vérifier le code'}
                  </button>

                  <p className="text-center text-sm" style={{ color: '#8FA4BA' }}>
                    {countdown > 0
                      ? <>Renvoyer le code dans <strong style={{ color: '#0C1E47' }}>{countdown}s</strong></>
                      : <button type="button" onClick={handleSend} className="font-semibold" style={{ color: '#1B4FB3' }}>Renvoyer le code</button>}
                  </p>
                </form>
              </>
            )}

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E8EEF4' }}>
              <p className="text-sm text-center" style={{ color: '#8FA4BA' }}>
                Pas encore de compte ?{' '}
                <Link href="/register" className="font-semibold" style={{ color: '#1B4FB3' }}>S'inscrire</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
