'use client'
// ─── OTP Onboarding — Dark Premium ────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#E05C1A'

export default function OnboardingPage() {
  const router = useRouter()
  const [otp,       setOtp]       = useState(['','','','','',''])
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [countdown, setCountdown] = useState(30)
  const refs = useRef<(HTMLInputElement|null)[]>([])

  useEffect(() => {
    refs.current[0]?.focus()
    const iv = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(iv)
  }, [])

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[i] && i > 0) refs.current[i-1]?.focus()
      setOtp(o => { const n=[...o]; n[i]=''; return n })
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      setOtp(o => { const n=[...o]; n[i]=e.key; return n })
      if (i < 5) refs.current[i+1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join('').length < 6) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false); setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="text-center animate-scale-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5"
             style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.30)' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 24l8 8 14-16" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-bold text-2xl text-white mb-1">Compte vérifié !</h1>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.40)' }}>Bienvenue sur MABELE 🇨🇩</p>
        <div className="flex gap-3 justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
            ✓ Compte Vérifié
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(224,92,26,0.12)', color: ACC, border: '1px solid rgba(224,92,26,0.25)' }}>
            🔒 Paiement Sécurisé
          </span>
        </div>
        <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.30)' }}>Redirection en cours...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1A1A1A' }}>
      <nav className="h-14 flex items-center px-4"
           style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
          <span className="font-bold text-white">MABELE</span>
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-8"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>
            <div className="flex justify-center mb-5">
              <img src="/favicon.svg" alt="MABELE" className="w-14 h-14" />
            </div>
            <h1 className="font-bold text-2xl text-center text-white mb-1">Vérification</h1>
            <p className="text-sm text-center mb-7" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Un code a été envoyé au <strong className="text-white">+243 81 234 5678</strong>
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => { refs.current[i]=el }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={() => {}} onKeyDown={e => handleKey(i, e)}
                    className="text-center text-xl font-bold rounded-xl focus:outline-none transition-all text-white"
                    style={{
                      width: '44px', height: '52px',
                      border: `2px solid ${digit ? ACC : 'rgba(255,255,255,0.12)'}`,
                      backgroundColor: digit ? 'rgba(224,92,26,0.12)' : '#2A2A2A',
                    }}
                  />
                ))}
              </div>
              <button type="submit" disabled={loading || otp.join('').length < 6}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: otp.join('').length === 6 ? ACC : 'rgba(255,255,255,0.08)',
                  color: otp.join('').length === 6 ? 'white' : 'rgba(255,255,255,0.30)',
                  boxShadow: otp.join('').length === 6 ? '0 4px 16px rgba(224,92,26,0.35)' : 'none',
                }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Vérification...</>
                  : '✓ Vérifier le code'}
              </button>
              <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {countdown > 0
                  ? <>Renvoyer dans <strong className="text-white">{countdown}s</strong></>
                  : <button type="button" onClick={() => setCountdown(30)} className="font-semibold" style={{ color: ACC }}>Renvoyer le code</button>}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
