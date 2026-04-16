'use client'
// ─── Register Page ────────────────────────────────────────────────────────────
// Source: Board 1 — user type selection + phone form
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const USER_TYPES = [
  { id: 'particulier', icon: '👤', label: 'Particulier',      desc: 'Acheter, louer, chercher' },
  { id: 'agent',       icon: '🏠', label: 'Agent Immobilier', desc: 'Publier des annonces immo' },
  { id: 'employeur',   icon: '💼', label: 'Employeur',        desc: 'Recruter des talents' },
  { id: 'marchand',    icon: '🛒', label: 'Marchand',         desc: 'Vendre des produits' },
  { id: 'agriculteur', icon: '🌾', label: 'Agriculteur',      desc: 'Vendre des produits agri' },
  { id: 'freelance',   icon: '💻', label: 'Freelance',        desc: 'Proposer vos services' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [type,    setType]    = useState('particulier')
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nom requis'
    if (phone.length < 9) e.phone = 'Numéro invalide — 9 chiffres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F8FC' }}>

      <nav className="h-14 flex items-center px-4 bg-white" style={{ borderBottom: '1px solid #E8EEF4' }}>
        <Link href="/"><img src="/logo.svg" alt="MABELE" className="h-8" /></Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl p-8"
               style={{ border: '1px solid #D0DBE8', boxShadow: '0 4px 32px rgba(12,30,71,0.10)' }}>

            <div className="flex justify-center mb-6">
              <img src="/favicon.svg" alt="MABELE" className="w-14 h-14" />
            </div>

            <h1 className="font-display font-bold text-2xl text-center mb-1" style={{ color: '#0C1E47' }}>
              Créer mon compte
            </h1>
            <p className="text-sm text-center mb-7" style={{ color: '#8FA4BA' }}>
              Rejoignez des millions de Congolais sur MABELE
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* User type */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8FA4BA' }}>
                  Je suis un(e)...
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {USER_TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => setType(t.id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all"
                      style={{
                        border:          `2px solid ${type === t.id ? '#1B4FB3' : '#E8EEF4'}`,
                        backgroundColor: type === t.id ? '#EFF6FF' : '#FFFFFF',
                      }}>
                      <span className="text-xl flex-shrink-0">{t.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate"
                           style={{ color: type === t.id ? '#1B4FB3' : '#0C1E47' }}>
                          {t.label}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: '#8FA4BA' }}>{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D526B' }}>
                  Nom Complet
                </label>
                <input type="text" value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: '' })) }}
                  placeholder="Jean-Pierre Mutombo"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={{ border: `1px solid ${errors.name ? '#DC2626' : '#D0DBE8'}`, color: '#0C1E47' }}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D526B' }}>
                  Numéro de téléphone
                </label>
                <div className="flex rounded-xl overflow-hidden"
                     style={{ border: `1px solid ${errors.phone ? '#DC2626' : '#D0DBE8'}` }}>
                  <div className="flex items-center gap-1.5 px-3 select-none flex-shrink-0"
                       style={{ backgroundColor: '#F5F8FC', borderRight: '1px solid #D0DBE8' }}>
                    <span className="text-base">🇨🇩</span>
                    <span className="text-sm font-semibold" style={{ color: '#0C1E47' }}>+243</span>
                  </div>
                  <input type="tel" inputMode="numeric" value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setErrors((er) => ({ ...er, phone: '' })) }}
                    placeholder="81 234 5678"
                    className="flex-1 px-3 py-3 text-sm bg-white focus:outline-none"
                    style={{ color: '#0C1E47' }}
                  />
                </div>
                {errors.phone && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.phone}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.30)' }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Création...</>
                  : 'Créer mon compte →'}
              </button>

              <p className="text-xs text-center leading-relaxed" style={{ color: '#8FA4BA' }}>
                En vous inscrivant, vous acceptez nos{' '}
                <Link href="/terms" style={{ color: '#1B4FB3' }} className="underline">Conditions d'utilisation</Link>{' '}
                et notre{' '}
                <Link href="/privacy" style={{ color: '#1B4FB3' }} className="underline">Politique de confidentialité</Link>.
              </p>
            </form>

            <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid #E8EEF4' }}>
              <p className="text-sm" style={{ color: '#8FA4BA' }}>
                Déjà un compte ?{' '}
                <Link href="/login" className="font-semibold" style={{ color: '#1B4FB3' }}>Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
