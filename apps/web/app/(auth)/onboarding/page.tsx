'use client'
// ─── OTP Onboarding ───────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['','','','','',''])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor:'#F5F8FC'}}>
      <div className="text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5" style={{backgroundColor:'#DCFCE7'}}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 24l8 8 14-16" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-display font-bold text-2xl mb-1" style={{color:'#0C1E47'}}>Compte vérifié !</h1>
        <p className="text-sm mb-5" style={{color:'#8FA4BA'}}>Bienvenue sur MABELE 🇨🇩</p>
        <div className="flex gap-3 justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{backgroundColor:'#DCFCE7',color:'#16A34A',border:'1px solid #16A34A40'}}>✓ Compte Vérifié</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{backgroundColor:'#EFF6FF',color:'#1B4FB3',border:'1px solid #1B4FB340'}}>🔒 Paiement Sécurisé</span>
        </div>
        <p className="text-xs mt-5" style={{color:'#8FA4BA'}}>Redirection en cours...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:'#F5F8FC'}}>
      <nav className="h-14 flex items-center px-4 bg-white" style={{borderBottom:'1px solid #E8EEF4'}}>
        <Link href="/"><img src="/logo.svg" alt="MABELE" className="h-8" /></Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8" style={{border:'1px solid #D0DBE8',boxShadow:'0 4px 32px rgba(12,30,71,0.10)'}}>
            <div className="flex justify-center mb-5"><img src="/favicon.svg" alt="MABELE" className="w-14 h-14" /></div>
            <h1 className="font-display font-bold text-2xl text-center mb-1" style={{color:'#0C1E47'}}>Vérification</h1>
            <p className="text-sm text-center mb-7" style={{color:'#8FA4BA'}}>Un code a été envoyé au <strong style={{color:'#0C1E47'}}>+243 81 234 5678</strong></p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => { refs.current[i]=el }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={() => {}} onKeyDown={e => handleKey(i, e)}
                    className="text-center text-xl font-bold rounded-xl focus:outline-none transition-all"
                    style={{width:'44px',height:'52px',border:`2px solid ${digit?'#1B4FB3':'#D0DBE8'}`,backgroundColor:digit?'#EFF6FF':'#FFFFFF',color:'#0C1E47'}}
                  />
                ))}
              </div>
              <button type="submit" disabled={loading || otp.join('').length < 6}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{backgroundColor:otp.join('').length===6?'#F5A623':'#E8EEF4',color:otp.join('').length===6?'#0C1E47':'#8FA4BA',boxShadow:otp.join('').length===6?'0 4px 16px rgba(245,166,35,0.30)':'none'}}>
                {loading ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Vérification...</> : '✓ Vérifier le code'}
              </button>
              <p className="text-sm text-center" style={{color:'#8FA4BA'}}>
                {countdown > 0
                  ? <>Renvoyer dans <strong style={{color:'#0C1E47'}}>{countdown}s</strong></>
                  : <button type="button" onClick={()=>setCountdown(30)} style={{color:'#1B4FB3'}} className="font-semibold">Renvoyer le code</button>}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
