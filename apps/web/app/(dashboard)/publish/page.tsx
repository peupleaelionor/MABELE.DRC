// ─── Publish Flow ─────────────────────────────────────────────────────────────
// Source: Board 2 — "Flux de Publication (Étape 1)"
'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'immo',       icon: '🏠', label: 'Immobilier',  desc: 'Vente, location, terrain' },
  { id: 'emploi',     icon: '💼', label: 'Emploi',       desc: 'Offres d\'emploi, stages' },
  { id: 'marche',     icon: '🛒', label: 'Marché',       desc: 'Produits, petites annonces' },
  { id: 'logistique', icon: '🚚', label: 'Logistique',   desc: 'Transport, livraison' },
  { id: 'agri',       icon: '🌾', label: 'AgriTech',     desc: 'Produits agricoles' },
]

const STEPS = ['Catégorie', 'Informations', 'Médias', 'Publication']

export default function PublishPage() {
  const [step, setStep]           = useState(0)
  const [selected, setSelected]   = useState<string | null>(null)
  const [formData, setFormData]   = useState({ title: '', price: '', description: '', location: '' })

  return (
    <div className="min-h-screen bg-bg-subtle">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-xs">
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-subtle text-text-secondary">
            ←
          </Link>
          <div className="flex-1">
            <p className="text-xs text-text-muted">Publier une annonce</p>
            <p className="font-semibold text-text-primary text-sm">Étape {step + 1}/{STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex h-1 bg-border-light mx-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 pb-32">

        {/* Step 0 — Category */}
        {step === 0 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-display font-bold text-2xl text-text-primary">
                Sélectionner la catégorie
              </h1>
              <p className="text-text-muted text-sm mt-1">
                Dans quelle catégorie souhaitez-vous publier ?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`card p-4 text-left transition-all duration-150 ${
                    selected === cat.id
                      ? 'border-primary bg-primary/5 shadow-blue ring-2 ring-primary/20'
                      : 'hover:border-primary/40 hover:bg-bg-subtle'
                  }`}
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <p className="font-semibold text-text-primary text-sm">{cat.label}</p>
                  <p className="text-text-muted text-xs mt-0.5">{cat.desc}</p>
                  {selected === cat.id && (
                    <span className="mt-2 badge badge-blue block w-fit">✓ Sélectionné</span>
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
              <h1 className="font-display font-bold text-2xl text-text-primary">Informations</h1>
              <p className="text-text-muted text-sm mt-1">Décrivez votre annonce avec précision.</p>
            </div>

            <div className="bg-white rounded-xl border border-border p-5 shadow-xs space-y-4">
              <div>
                <label className="label">Titre de l'annonce *</label>
                <input
                  className="input"
                  placeholder="Ex: Appartement 3 chambres à Gombe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Prix</label>
                <div className="relative">
                  <input
                    className="input pr-14"
                    placeholder="5000"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">USD</span>
                </div>
              </div>
              <div>
                <label className="label">Localisation *</label>
                <input
                  className="input"
                  placeholder="Ex: Gombe, Kinshasa"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input min-h-[120px] resize-none"
                  placeholder="Décrivez votre annonce en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Media */}
        {step === 2 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-display font-bold text-2xl text-text-primary">Photos & Médias</h1>
              <p className="text-text-muted text-sm mt-1">Ajoutez jusqu'à 10 photos pour valoriser votre annonce.</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-5 shadow-xs">
              <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                <div className="text-4xl mb-3">📷</div>
                <p className="font-medium text-text-primary mb-1">Ajouter des photos</p>
                <p className="text-text-muted text-sm">JPG, PNG — max 10MB par photo</p>
                <button className="btn-outline mt-4 text-sm">Parcourir les fichiers</button>
              </div>
              <p className="text-xs text-text-muted mt-3 text-center">
                Les annonces avec photos reçoivent 3× plus de vues
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Preview + Publish */}
        {step === 3 && (
          <div>
            <div className="mb-6 pt-2">
              <h1 className="font-display font-bold text-2xl text-text-primary">Aperçu & Publication</h1>
              <p className="text-text-muted text-sm mt-1">Vérifiez votre annonce avant de la publier.</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-5 shadow-xs space-y-4">
              {/* Preview card */}
              <div className="rounded-xl border border-border-light overflow-hidden">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
                  <span className="text-5xl opacity-30">🏠</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-text-primary">{formData.title || 'Titre de l\'annonce'}</p>
                  <p className="text-lg font-bold text-navy mt-1">{formData.price ? `${formData.price} $` : 'Prix'}</p>
                  <p className="text-xs text-text-muted mt-1">📍 {formData.location || 'Localisation'}</p>
                </div>
              </div>
              <div className="bg-bg-subtle rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Catégorie</span>
                  <span className="font-medium text-text-primary capitalize">{selected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Visibilité</span>
                  <span className="font-medium text-success">Publique</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 safe-bottom">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <button
              className="btn-ghost flex-1"
              onClick={() => setStep(step - 1)}
            >
              ← Retour
            </button>
          )}
          <button
            className={`btn-primary flex-1 ${step === 0 && !selected ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={step === 0 && !selected}
            onClick={() => {
              if (step < STEPS.length - 1) setStep(step + 1)
            }}
          >
            {step === STEPS.length - 1 ? '🚀 Publier l\'annonce' : 'Continuer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
