'use client'
// ─── Job Detail — Dark Premium ─────────────────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'

const MOD = '#0891B2'
const ACC = '#E05C1A'

const JOB = {
  id: '1',
  titre: 'Développeur Full Stack React/Node.js',
  entreprise: 'TechFlow Solutions',
  logo: '💻',
  ville: 'Kinshasa',
  type: 'CDI',
  cat: 'IT & Tech',
  salaire: '1 500 – 2 500 USD/mois',
  urgent: true,
  remote: true,
  candidatures: 23,
  publié: 'Il y a 2 jours',
  description: `TechFlow Solutions cherche un développeur Full Stack expérimenté pour rejoindre notre équipe croissante.

Vous serez en charge de concevoir et développer des applications web modernes pour nos clients en RDC et en Afrique.

Missions :
• Développer des fonctionnalités front-end avec React et TypeScript
• Construire des API REST avec Node.js et Express
• Participer à la revue de code et à l'architecture technique
• Collaborer avec les équipes design et produit`,
  exigences: ['React / Next.js (3+ ans)', 'Node.js / Express', 'PostgreSQL ou MongoDB', 'Git & CI/CD', 'Anglais professionnel'],
  avantages: ['Télétravail possible', 'Assurance maladie', 'Formation continue', '13ème mois', 'Équipement fourni'],
  contact: 'recrutement@techflow.cd',
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [applied, setApplied] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/emploi"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ←
          </Link>
          <h1 className="flex-1 font-semibold text-sm text-white truncate">Détail de l&apos;offre</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{ color: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ⬆
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 pb-32 lg:pb-8">

        {/* Hero */}
        <div className="rounded-xl p-5 mb-4"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                 style={{ backgroundColor: 'rgba(8,145,178,0.15)', border: '1px solid rgba(8,145,178,0.25)' }}>
              {JOB.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-xl text-white leading-tight">{JOB.titre}</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
                {JOB.entreprise} · 📍 {JOB.ville}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(8,145,178,0.15)', color: MOD }}>
                  {JOB.type}
                </span>
                {JOB.urgent && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                    🔥 Urgent
                  </span>
                )}
                {JOB.remote && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(8,145,178,0.15)', color: MOD }}>
                    🌐 Remote OK
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 flex items-center justify-between"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Salaire</p>
              <p className="text-lg font-bold" style={{ color: MOD }}>{JOB.salaire}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Candidatures</p>
              <p className="text-lg font-bold text-white">{JOB.candidatures}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>Publié</p>
              <p className="text-sm text-white">{JOB.publié}</p>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Description du poste</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line"
                 style={{ color: 'rgba(255,255,255,0.55)' }}>
                {JOB.description}
              </p>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Compétences requises</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {JOB.exigences.map(e => (
                  <div key={e} className="flex items-center gap-2 text-sm"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span className="text-xs" style={{ color: MOD }}>✓</span> {e}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Avantages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {JOB.avantages.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span className="text-xs" style={{ color: '#22C55E' }}>✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="mt-4 lg:mt-0 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Postuler</h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Envoyez votre CV et lettre de motivation à :
              </p>
              <p className="text-sm font-semibold mb-4" style={{ color: MOD }}>{JOB.contact}</p>
              <button
                onClick={() => setApplied(true)}
                disabled={applied}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{
                  backgroundColor: applied ? '#22C55E' : MOD,
                  boxShadow: applied ? '0 4px 16px rgba(34,197,94,0.35)' : '0 4px 16px rgba(8,145,178,0.35)',
                }}>
                {applied ? '✓ Candidature envoyée' : '📝 Postuler maintenant'}
              </button>
              {applied && (
                <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Vous avez postulé à cette offre
                </p>
              )}
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-semibold text-white text-sm mb-2">{JOB.entreprise}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Secteur : {JOB.cat}
              </p>
              <Link href="/messages"
                className="mt-3 block text-center py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ border: `1px solid ${ACC}`, color: ACC }}>
                💬 Contacter l&apos;entreprise
              </Link>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#2D2D2D', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>
                🔒 <strong className="text-white">Offre vérifiée</strong> par MABELE.
                Ne payez jamais pour postuler à une offre.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed CTA */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setApplied(true)}
          disabled={applied}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{
            backgroundColor: applied ? '#22C55E' : MOD,
            boxShadow: `0 4px 16px ${applied ? 'rgba(34,197,94,0.35)' : 'rgba(8,145,178,0.35)'}`,
          }}>
          {applied ? '✓ Candidature envoyée' : '📝 Postuler maintenant'}
        </button>
      </div>
    </div>
  )
}
