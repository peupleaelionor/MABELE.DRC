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
    prix: 5,
    devise: 'USD',
    periode: '/mois',
    color: '#26C6DA',
    description: 'Couverture de base pour les soins essentiels',
    couvertures: [
      'Consultation généraliste',
      'Médicaments essentiels',
      'Urgences 24h/24',
    ],
    populaire: false,
  },
  {
    id: 'famille',
    nom: 'Famille',
    emoji: '👨‍👩‍👧‍👦',
    prix: 15,
    devise: 'USD',
    periode: '/mois',
    color: '#BB902A',
    description: 'Protégez toute votre famille',
    couvertures: [
      'Tout le plan Essentiel',
      'Spécialistes (ophtalmologue, dentiste...)',
      'Maternité & accouchement',
      'Analyses laboratoire',
      'Jusqu\'à 5 personnes couvertes',
    ],
    populaire: true,
  },
  {
    id: 'premium',
    nom: 'Premium',
    emoji: '⭐',
    prix: 35,
    devise: 'USD',
    periode: '/mois',
    color: '#B388FF',
    description: 'Couverture complète sans limite',
    couvertures: [
      'Tout le plan Famille',
      'Hospitalisation illimitée',
      'Chirurgie & interventions',
      'Optique & dentaire complet',
      'Évacuation sanitaire',
      'Nombre de bénéficiaires illimité',
    ],
    populaire: false,
  },
]

const PARTNERS = [
  { nom: 'Clinique Ngaliema', ville: 'Kinshasa', type: 'Hôpital' },
  { nom: 'Centre Médical de Kinshasa', ville: 'Kinshasa', type: 'Centre médical' },
  { nom: 'Hôpital Général de Lubumbashi', ville: 'Lubumbashi', type: 'Hôpital' },
  { nom: 'Pharmacie Centrale', ville: 'Goma', type: 'Pharmacie' },
  { nom: 'Labo BioKivu', ville: 'Bukavu', type: 'Laboratoire' },
]

const HOW_IT_WORKS = [
  { step: 1, title: 'Choisissez votre formule', desc: 'Essentiel, Famille ou Premium', emoji: '📋' },
  { step: 2, title: 'Payez par Mobile Money', desc: 'Airtel Money, M-Pesa, Orange Money', emoji: '📱' },
  { step: 3, title: 'Recevez votre carte', desc: 'Carte digitale envoyée par SMS', emoji: '💳' },
  { step: 4, title: 'Consultez librement', desc: 'Rendez-vous dans un centre partenaire', emoji: '🏥' },
]

export default function BimaPage() {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          🏥 Bima Santé
        </h1>
        <p className="text-muted-foreground">Assurance santé accessible — souscription en 2 minutes</p>
      </div>

      {/* Hero Banner */}
      <div
        className="rounded-[24px] p-6 mb-8 text-center"
        style={{ background: 'linear-gradient(135deg, #FF408120, #FF408105)', border: '1px solid #FF408130' }}
      >
        <div className="text-5xl mb-3">🛡️</div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">
          La santé pour <span style={{ color: '#FF4081' }}>tous</span> les Congolais
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Première assurance santé 100% digitale en RDC. Souscription via Mobile Money, sans paperasse.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { val: '250+', label: 'Centres partenaires', icon: '🏥' },
          { val: '26', label: 'Provinces couvertes', icon: '🗺' },
          { val: '98%', label: 'Taux remboursement', icon: '✅' },
          { val: '24h', label: 'Prise en charge', icon: '⏱' },
        ].map((s) => (
          <div key={s.label} className="card-base text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold" style={{ color: '#FF4081' }}>{s.val}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <h2 className="text-lg font-semibold text-foreground mb-4">💎 Nos Formules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`card-base relative overflow-hidden ${plan.populaire ? 'ring-2' : ''}`}
            style={plan.populaire ? { borderColor: plan.color, boxShadow: `0 0 20px ${plan.color}20` } : {}}
          >
            {plan.populaire && (
              <div
                className="absolute top-0 right-0 text-[9px] font-bold px-3 py-1 rounded-bl-[10px]"
                style={{ backgroundColor: plan.color, color: '#0E0E0E' }}
              >
                ⭐ POPULAIRE
              </div>
            )}
            <div className="text-3xl mb-2">{plan.emoji}</div>
            <h3 className="text-lg font-semibold text-foreground">{plan.nom}</h3>
            <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
            <div className="mb-4">
              <span className="text-3xl font-bold" style={{ color: plan.color }}>{plan.prix}</span>
              <span className="text-sm text-muted-foreground"> {plan.devise}{plan.periode}</span>
            </div>
            <ul className="space-y-2 mb-5">
              {plan.couvertures.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-2.5 rounded-[10px] text-sm font-semibold transition-all"
              style={
                plan.populaire
                  ? { backgroundColor: plan.color, color: '#0E0E0E' }
                  : { border: `1px solid ${plan.color}`, color: plan.color }
              }
            >
              Souscrire →
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 className="text-lg font-semibold text-foreground mb-4">📋 Comment ça marche</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {HOW_IT_WORKS.map((step) => (
          <div key={step.step} className="card-base text-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold"
              style={{ backgroundColor: '#FF408120', color: '#FF4081' }}
            >
              {step.step}
            </div>
            <div className="text-xl mb-1">{step.emoji}</div>
            <div className="text-xs font-semibold text-foreground">{step.title}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Partners */}
      <h2 className="text-lg font-semibold text-foreground mb-4">🤝 Centres partenaires</h2>
      <div className="space-y-3">
        {PARTNERS.map((p) => (
          <div key={p.nom} className="card-base flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: '#FF408120' }}
            >
              🏥
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{p.nom}</div>
              <div className="text-xs text-muted-foreground">📍 {p.ville} · {p.type}</div>
            </div>
            <span className="badge text-[10px]" style={{ backgroundColor: '#00C85320', color: '#00C853' }}>
              Partenaire
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-8 mb-4">
        <div className="card-base inline-block px-6 py-4">
          <p className="text-sm text-muted-foreground mb-3">Besoin d&apos;aide pour choisir ?</p>
          <button
            className="btn-primary"
            style={{ backgroundColor: '#FF4081', color: '#fff' }}
          >
            📞 Appeler un conseiller
          </button>
        </div>
      </div>
    </div>
  )
}
