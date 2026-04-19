// ─── Publish Flow — Dark Premium ──────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

const CATEGORIES = [
  { id: 'immo',       icon: '🏠', label: 'Immobilier',  desc: "Vente, location, terrain"     },
  { id: 'emploi',     icon: '💼', label: 'Emploi',       desc: "Offres d'emploi, stages"      },
  { id: 'marche',     icon: '🛒', label: 'Marché',       desc: 'Produits, petites annonces'   },
  { id: 'logistique', icon: '🚚', label: 'Logistique',   desc: 'Transport, livraison'         },
  { id: 'agri',       icon: '🌾', label: 'AgriTech',     desc: 'Produits agricoles'           },
]

const STEPS = ['Catégorie', 'Informations', 'Médias', 'Publication']

export default function PublishPage() {
  const [step,     setStep]     = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', price: '', description: '', location: '' })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>

      {/* Header */}
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.70)' }}>
            ←
          </Link>
          <div className="flex-1">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Publier une annonce</p>
            <p className="font-semibold text-white text-sm">
              Étape {step + 1}/{STEPS.length}: {STEPS[step]}
            </p>
          </div>
        </div>
        <div className="h-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full transition-all duration-500"
               style={{ width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: ACC }} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 pb-32">

        {/* Step 0 — Category */}
        {step === 0 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-bold text-2xl text-white">Sélectionner la catégorie</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Dans quelle catégorie souhaitez-vous publier ?
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setSelected(cat.id)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    backgroundColor: selected === cat.id ? 'rgba(224,92,26,0.10)' : '#242424',
                    border: selected === cat.id ? `2px solid ${ACC}` : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <p className="font-semibold text-white text-sm">{cat.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{cat.desc}</p>
                  {selected === cat.id && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(224,92,26,0.15)', color: ACC }}>
                      ✓ Sélectionné
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Form */}
        {step === 1 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-bold text-2xl text-white">Informations</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Décrivez votre annonce avec précision.
              </p>
            </div>
            <div className="rounded-xl p-5 space-y-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <label className="block text-sm font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Titre de l'annonce *</label>
                <input
                  placeholder="Ex: Appartement 3 chambres à Gombe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Prix</label>
                <div className="relative">
                  <input
                    type="number" placeholder="5000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 pr-14 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                    style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                        style={{ color: 'rgba(255,255,255,0.40)' }}>USD</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Localisation *</label>
                <input
                  placeholder="Ex: Gombe, Kinshasa"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Description</label>
                <textarea
                  placeholder="Décrivez votre annonce en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none resize-none min-h-[120px] transition-all"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Media */}
        {step === 2 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-bold text-2xl text-white">Photos & Médias</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Ajoutez jusqu'à 10 photos pour valoriser votre annonce.
              </p>
            </div>
            <div className="rounded-xl p-5"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="border-2 border-dashed rounded-xl p-10 text-center"
                   style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                <div className="text-4xl mb-3">📷</div>
                <p className="font-medium text-white mb-1">Ajouter des photos</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  JPG, PNG — max 10MB par photo
                </p>
                <button className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ border: `1px solid ${ACC}`, color: ACC }}>
                  Parcourir les fichiers
                </button>
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Les annonces avec photos reçoivent 3× plus de vues
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Preview */}
        {step === 3 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-bold text-2xl text-white">Aperçu & Publication</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Vérifiez votre annonce avant de la publier.
              </p>
            </div>
            <div className="rounded-xl p-5 space-y-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="rounded-xl overflow-hidden"
                   style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="aspect-video flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
                  <span className="text-5xl opacity-30">🏠</span>
                </div>
                <div className="p-3" style={{ backgroundColor: '#2A2A2A' }}>
                  <p className="font-semibold text-white">{formData.title || "Titre de l'annonce"}</p>
                  <p className="text-lg font-bold mt-1" style={{ color: ACC }}>
                    {formData.price ? `${formData.price} $` : 'Prix'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    📍 {formData.location || 'Localisation'}
                  </p>
                </div>
              </div>
              <div className="rounded-xl p-4 text-sm space-y-2"
                   style={{ backgroundColor: '#2A2A2A' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.40)' }}>Catégorie</span>
                  <span className="font-medium text-white capitalize">{selected}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.40)' }}>Visibilité</span>
                  <span className="font-medium" style={{ color: '#22C55E' }}>Publique</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 safe-bottom"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <button
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)' }}
              onClick={() => setStep(step - 1)}>
              ← Retour
            </button>
          )}
          <button
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{
              backgroundColor: step === 0 && !selected ? 'rgba(255,255,255,0.08)' : ACC,
              color: step === 0 && !selected ? 'rgba(255,255,255,0.30)' : 'white',
              boxShadow: step === 0 && !selected ? 'none' : '0 4px 16px rgba(224,92,26,0.35)',
            }}
            disabled={step === 0 && !selected}
            onClick={() => { if (step < STEPS.length - 1) setStep(step + 1) }}>
            {step === STEPS.length - 1 ? "🚀 Publier l'annonce" : 'Continuer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
