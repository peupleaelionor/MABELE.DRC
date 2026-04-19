// ─── Bima Santé — Dark Premium ────────────────────────────────────────────────
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bima Santé — Assurance Santé RDC',
  description: 'Souscrivez à votre assurance santé en quelques clics via Mobile Money.',
}

const ACC = '#E05C1A'
const MOD = '#0891B2'

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
    color: '#E05C1A',
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
    color: '#7C3AED',
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

      <div className="mb-6">
        <h1 className="font-bold text-2xl text-white">🏥 Bima Santé</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Assurance santé accessible — souscription en 2 minutes
        </p>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl p-6 mb-8 text-center"
           style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.20), rgba(8,145,178,0.08))', border: '1px solid rgba(8,145,178,0.25)' }}>
        <div className="text-5xl mb-3">🛡️</div>
        <h2 className="text-xl font-bold text-white mb-2">
          La santé pour <span style={{ color: ACC }}>tous</span> les Congolais
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
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
          <div key={s.label}
               className="rounded-xl p-4 text-center"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold" style={{ color: MOD }}>{s.val}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <h2 className="font-semibold text-base text-white mb-4">💎 Nos Formules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.id}
               className="rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-0.5"
               style={{
                 backgroundColor: '#242424',
                 border: plan.populaire ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.08)',
                 boxShadow: plan.populaire ? `0 4px 24px ${plan.color}25` : undefined,
               }}>
            {plan.populaire && (
              <div className="absolute top-0 right-0 text-[9px] font-bold px-3 py-1 rounded-bl-xl text-white"
                   style={{ backgroundColor: plan.color }}>
                ⭐ POPULAIRE
              </div>
            )}
            <div className="text-3xl mb-2">{plan.emoji}</div>
            <h3 className="font-semibold text-base text-white mb-1">{plan.nom}</h3>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>{plan.desc}</p>
            <p className="text-2xl font-bold mb-4" style={{ color: plan.color }}>{plan.prix}</p>
            <ul className="space-y-2 mb-5">
              {plan.couvertures.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  <span style={{ color: '#22C55E' }}>✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={
                      plan.populaire
                        ? { backgroundColor: plan.color, color: 'white' }
                        : { border: `1px solid ${plan.color}`, color: plan.color }
                    }>
              Souscrire →
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 className="font-semibold text-base text-white mb-4">📋 Comment ça marche</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STEPS.map((step) => (
          <div key={step.n}
               className="rounded-xl p-4 text-center"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                 style={{ backgroundColor: 'rgba(8,145,178,0.15)', color: MOD }}>
              {step.n}
            </div>
            <div className="text-xl mb-1">{step.emoji}</div>
            <div className="text-xs font-semibold mb-0.5 text-white">{step.title}</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.40)' }}>{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Partners */}
      <h2 className="font-semibold text-base text-white mb-4">🤝 Centres partenaires</h2>
      <div className="space-y-3 mb-8">
        {PARTNERS.map((p) => (
          <div key={p.nom}
               className="rounded-xl p-4 flex items-center gap-4"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                 style={{ backgroundColor: 'rgba(8,145,178,0.15)' }}>
              🏥
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{p.nom}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
                📍 {p.ville} · {p.type}
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
              Partenaire
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center py-8 rounded-2xl"
           style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.10), rgba(8,145,178,0.05))', border: '1px solid rgba(8,145,178,0.20)' }}>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Besoin d&apos;aide pour choisir ?
        </p>
        <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: MOD, boxShadow: '0 4px 16px rgba(8,145,178,0.30)' }}>
          📞 Appeler un conseiller
        </button>
      </div>
    </div>
  )
}
