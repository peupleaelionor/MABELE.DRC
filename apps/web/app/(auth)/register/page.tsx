'use client'

import Link from 'next/link'
import { useState } from 'react'

const ROLES = [
  { value: 'USER', label: 'Particulier', emoji: '👤', desc: 'Acheter, louer, chercher un emploi' },
  { value: 'AGENT_IMMO', label: 'Agent Immobilier', emoji: '🏠', desc: 'Publier des annonces immobilières' },
  { value: 'EMPLOYER', label: 'Employeur', emoji: '💼', desc: 'Recruter des talents' },
  { value: 'FARMER', label: 'Agriculteur', emoji: '🌾', desc: 'Vendre des produits agricoles' },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: 'USER',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: create account + send OTP
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    window.location.href = '/onboarding'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Link href="/" className="text-2xl font-display font-bold text-gradient-gold">
          MABELE
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="card-base p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">✨</div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Créer mon compte
              </h1>
              <p className="text-muted-foreground text-sm">
                Rejoignez des millions de Congolais sur MABELE
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  placeholder="Jean-Pierre Mutombo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              {/* Phone */}
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
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field flex-1"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Je suis un(e)...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`p-3 rounded-[10px] border text-left transition-all ${
                        form.role === role.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted hover:border-muted-foreground'
                      }`}
                    >
                      <div className="text-xl mb-1">{role.emoji}</div>
                      <div className="text-xs font-semibold text-foreground">{role.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !form.name || form.phone.length < 9}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Création...' : "Créer mon compte →"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                En vous inscrivant, vous acceptez nos{' '}
                <span className="text-primary cursor-pointer hover:underline">Conditions d&apos;utilisation</span>{' '}
                et notre{' '}
                <span className="text-primary cursor-pointer hover:underline">Politique de confidentialité</span>.
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
