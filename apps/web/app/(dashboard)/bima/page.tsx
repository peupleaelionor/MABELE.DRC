// ─── Bima Santé ───────────────────────────────────────────────────────────────
// Source: Board 2 — white-first, health teal #0891B2
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bima Santé — Assurance Santé RDC',
  description: 'Souscrivez à votre assurance santé en quelques clics via Mobile Money.',
}

const PLANS = [
  {
    id: 'essentiel',
    nom: 'Essentiel',
    emoji: '🩺',
    prix: '5 USD/mois',
    color: '#0891B2',
    desc: 'Couverture de base pour les soins essentiels',
    couvertures: ['Consultation généraliste', 'Médicaments essentiels', 'Urgences 24h/24'],
    populaire: false,
  },
  {
    id: 'famille',
    nom: 'Famille',
    emoji: '👨‍👩‍👧‍👦',
    prix: '15 USD/mois',
    color: '#F5A623',
    desc: 'Protégez toute votre famille',
    couvertures: [
      'Tout le plan Essentiel',
      'Spécialistes (ophtalmologue, dentiste...)',
      'Maternité & accouchement',
      'Analyses laboratoire',
      "Jusqu'à 5 personnes couvertes",
    ],
    populaire: true,
  },
  {
    id: 'premium',
    nom: 'Premium',
    emoji: '⭐',
    prix: '35 USD/mois',
    color: '#1B4FB3',
    desc: 'Couverture complète sans limite',
    couvertures: [
      'Tout le plan Famille',
      'Hospitalisation illimitée',
      'Chirurgie & interventions',
      'Optique & dentaire complet',
      'Évacuation sanitaire',
    ],
    populaire: false,
  },
]

const PARTNERS = [
  { nom: 'Clinique Ngaliema',             ville: 'Kinshasa',   type: 'Hôpital'        },
  { nom: 'Centre Médical de Kinshasa',    ville: 'Kinshasa',   type: 'Centre médical' },
  { nom: 'Hôpital Général de Lubumbashi', ville: 'Lubumbashi', type: 'Hôpital'        },
  { nom: 'Pharmacie Centrale',            ville: 'Goma',       type: 'Pharmacie'      },
  { nom: 'Labo BioKivu',                  ville: 'Bukavu',     type: 'Laboratoire'    },
]

const STEPS = [
  { n: 1, title: 'Choisissez votre formule', desc: 'Essentiel, Famille ou Premium', emoji: '📋' },
  { n: 2, title: 'Payez par Mobile Money',   desc: 'Airtel Money, M-Pesa, Orange Money', emoji: '📱' },
  { n: 3, title: 'Recevez votre carte',      desc: 'Carte digitale envoyée par SMS', emoji: '💳' },
  { n: 4, title: 'Consultez librement',      desc: 'Rendez-vous dans un centre partenaire', emoji: '🏥' },
]

export default function BimaPage() {
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🏥 Bima Santé</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Assurance santé accessible — souscription en 2 minutes</p>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl p-6 mb-8 text-center"
           style={{ background: 'linear-gradient(135deg, #0C1E47, #1B4FB3)', boxShadow: '0 4px 20px rgba(12,30,71,0.18)' }}>
        <div className="text-5xl mb-3">🛡️</div>
        <h2 className="text-xl font-bold text-white mb-2">
          La santé pour <span style={{ color: '#F5A623' }}>tous</span> les Congolais
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.70)' }}>
          Première assurance santé 100% digitale en RDC. Souscription via Mobile Money, sans paperasse.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { val: '250+', label: 'Centres partenaires', icon: '🏥' },
          { val: '26',   label: 'Provinces couvertes', icon: '🗺'  },
          { val: '98%',  label: 'Taux remboursement',  icon: '✅'  },
          { val: '24h',  label: 'Prise en charge',     icon: '⏱'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 text-center"
               style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold" style={{ color: '#0891B2' }}>{s.val}</div>
            <div className="text-[10px] mt-0.5" style={{ color: '#8FA4BA' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>💎 Nos Formules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.id}
               className="bg-white rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-0.5"
               style={{
                 border: plan.populaire ? `2px solid ${plan.color}` : '1px solid #E8EEF4',
                 boxShadow: plan.populaire ? `0 4px 24px ${plan.color}25` : '0 1px 6px rgba(12,30,71,0.05)',
               }}>
            {plan.populaire && (
              <div className="absolute top-0 right-0 text-[9px] font-bold px-3 py-1 rounded-bl-xl"
                   style={{ backgroundColor: plan.color, color: plan.color === '#F5A623' ? '#0C1E47' : 'white' }}>
                ⭐ POPULAIRE
              </div>
            )}
            <div className="text-3xl mb-2">{plan.emoji}</div>
            <h3 className="font-semibold text-base mb-1" style={{ color: '#0C1E47' }}>{plan.nom}</h3>
            <p className="text-xs mb-3" style={{ color: '#8FA4BA' }}>{plan.desc}</p>
            <p className="text-2xl font-bold mb-4" style={{ color: plan.color }}>{plan.prix}</p>
            <ul className="space-y-2 mb-5">
              {plan.couvertures.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs" style={{ color: '#3D526B' }}>
                  <span style={{ color: '#16A34A' }}>✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={
                      plan.populaire
                        ? { backgroundColor: plan.color, color: plan.color === '#F5A623' ? '#0C1E47' : 'white' }
                        : { border: `1px solid ${plan.color}`, color: plan.color, backgroundColor: 'white' }
                    }>
              Souscrire →
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>📋 Comment ça marche</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STEPS.map((step) => (
          <div key={step.n} className="bg-white rounded-xl p-4 text-center"
               style={{ border: '1px solid #E8EEF4' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                 style={{ backgroundColor: '#E0F7FA', color: '#0891B2' }}>
              {step.n}
            </div>
            <div className="text-xl mb-1">{step.emoji}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: '#0C1E47' }}>{step.title}</div>
            <div className="text-[10px]" style={{ color: '#8FA4BA' }}>{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Partners */}
      <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>🤝 Centres partenaires</h2>
      <div className="space-y-3 mb-8">
        {PARTNERS.map((p) => (
          <div key={p.nom} className="bg-white rounded-xl p-4 flex items-center gap-4"
               style={{ border: '1px solid #E8EEF4' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                 style={{ backgroundColor: '#E0F7FA' }}>
              🏥
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: '#0C1E47' }}>{p.nom}</div>
              <div className="text-xs" style={{ color: '#8FA4BA' }}>📍 {p.ville} · {p.type}</div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
              Partenaire
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center py-8 rounded-2xl"
           style={{ background: 'linear-gradient(135deg, #F5F8FC, #EBF0F7)', border: '1px solid #E8EEF4' }}>
        <p className="text-sm mb-4" style={{ color: '#8FA4BA' }}>Besoin d&apos;aide pour choisir ?</p>
        <button className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#0891B2', color: 'white', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}>
          📞 Appeler un conseiller
        </button>
      </div>
    </div>
  )
}
