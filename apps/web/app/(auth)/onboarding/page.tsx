'use client'

import Link from 'next/link'
import { useState } from 'react'

const STEPS = [
  {
    id: 1,
    title: 'Bienvenue sur MABELE !',
    emoji: '🎉',
    desc: 'Votre super-plateforme digitale congolaise. Découvrez tout ce que vous pouvez faire.',
  },
  {
    id: 2,
    title: 'Choisissez vos services',
    emoji: '🧩',
    desc: 'Sélectionnez les modules qui vous intéressent le plus.',
  },
  {
    id: 3,
    title: 'Complétez votre profil',
    emoji: '👤',
    desc: 'Quelques informations pour personnaliser votre expérience.',
  },
]

const SERVICES = [
  { id: 'immo', label: 'Immobilier', emoji: '🏠', color: '#BB902A' },
  { id: 'emploi', label: 'Emploi', emoji: '💼', color: '#26C6DA' },
  { id: 'market', label: 'Marché', emoji: '🛒', color: '#FF5252' },
  { id: 'agri', label: 'AgriTech', emoji: '🌾', color: '#00C853' },
  { id: 'sink', label: 'SINK', emoji: '🧾', color: '#B388FF' },
  { id: 'data', label: 'Congo Data', emoji: '📊', color: '#448AFF' },
  { id: 'kanga', label: 'KangaPay', emoji: '💰', color: '#FFB300' },
  { id: 'bima', label: 'Bima Santé', emoji: '🏥', color: '#FF4081' },
]

const PROVINCES = [
  'Kinshasa', 'Kongo-Central', 'Kwango', 'Kwilu', 'Mai-Ndombe',
  'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Lomami', 'Sankuru',
  'Maniema', 'Sud-Kivu', 'Nord-Kivu', 'Ituri', 'Haut-Uélé',
  'Bas-Uélé', 'Tshopo', 'Mongala', 'Nord-Ubangi', 'Sud-Ubangi',
  'Équateur', 'Tshuapa', 'Tanganyika', 'Haut-Lomami', 'Lualaba', 'Haut-Katanga',
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [province, setProvince] = useState('')
  const [ville, setVille] = useState('')

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleFinish = () => {
    window.location.href = '/immo'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold text-gradient-gold">
          MABELE
        </Link>
        <button onClick={handleFinish} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Passer →
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s.id <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Étape {step} sur {STEPS.length}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-4">
        <div className="w-full max-w-md">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-6">{STEPS[0].emoji}</div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                {STEPS[0].title}
              </h1>
              <p className="text-muted-foreground mb-8">{STEPS[0].desc}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { emoji: '🏠', text: 'Trouvez votre maison idéale' },
                  { emoji: '💼', text: 'Décrochez votre prochain emploi' },
                  { emoji: '💰', text: 'Gérez votre argent en toute sécurité' },
                  { emoji: '🌾', text: 'Accédez aux marchés agricoles' },
                ].map((item) => (
                  <div key={item.text} className="card-base text-left p-4">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-sm text-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full">
                Commencer →
              </button>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{STEPS[1].emoji}</div>
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  {STEPS[1].title}
                </h1>
                <p className="text-muted-foreground text-sm">{STEPS[1].desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {SERVICES.map((svc) => {
                  const selected = selectedServices.includes(svc.id)
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className={`p-4 rounded-[16px] border text-center transition-all ${
                        selected
                          ? 'border-2 bg-opacity-10'
                          : 'border-border bg-card hover:border-muted-foreground'
                      }`}
                      style={selected ? { borderColor: svc.color, backgroundColor: `${svc.color}15` } : {}}
                    >
                      <div className="text-2xl mb-2">{svc.emoji}</div>
                      <div
                        className="text-sm font-semibold"
                        style={selected ? { color: svc.color } : { color: '#F0F0F0' }}
                      >
                        {svc.label}
                      </div>
                      {selected && <div className="text-xs mt-1" style={{ color: svc.color }}>✓ Sélectionné</div>}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">
                  ← Retour
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Profile */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{STEPS[2].emoji}</div>
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  {STEPS[2].title}
                </h1>
                <p className="text-muted-foreground text-sm">{STEPS[2].desc}</p>
              </div>

              <div className="card-base p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Sélectionner votre province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Kinshasa, Lubumbashi..."
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1">
                  ← Retour
                </button>
                <button onClick={handleFinish} className="btn-primary flex-1">
                  🚀 Commencer à utiliser MABELE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
