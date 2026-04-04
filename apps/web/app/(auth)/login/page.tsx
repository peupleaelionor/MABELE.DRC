'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate SMS provider
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setStep('otp')
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: verify OTP and create session
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    window.location.href = '/immo'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link href="/" className="text-2xl font-display font-bold text-gradient-gold">
          MABELE
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="card-base p-6 sm:p-8">
            {step === 'phone' ? (
              <>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">📱</div>
                  <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                    Se connecter
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Entrez votre numéro de téléphone pour recevoir un code OTP
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Numéro de téléphone
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-muted border border-border rounded-[10px] px-3 py-3 text-sm text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        🇨🇩 +243
                      </div>
                      <input
                        type="tel"
                        placeholder="81 234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field flex-1"
                        maxLength={9}
                        required
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ex: 81 234 5678 (Airtel) · 82 345 6789 (Vodacom)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 9}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Envoi...' : 'Recevoir le code OTP'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">🔑</div>
                  <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                    Code OTP
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Entrez le code à 6 chiffres envoyé au{' '}
                    <strong className="text-foreground">+243 {phone}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Code OTP
                    </label>
                    <input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Vérification...' : 'Vérifier le code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="btn-ghost w-full text-sm"
                  >
                    ← Changer de numéro
                  </button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Pas reçu ?{' '}
                  <button className="text-primary hover:underline">Renvoyer (30s)</button>
                </p>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
