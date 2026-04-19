'use client'
// ─── Emploi — Dark Premium ─────────────────────────────────────────────────────
import { useState } from 'react'

const MOD = '#0891B2'

const CATEGORIES = ['Tous', 'IT & Tech', 'Finance', 'Santé', 'Éducation', 'BTP', 'Commerce', 'Agriculture']
const JOB_TYPES  = ['Tous', 'CDI', 'CDD', 'Freelance', 'Stage']

const JOBS = [
  { id:'1', titre:'Développeur Full Stack React/Node.js', entreprise:'TechFlow Solutions',    logo:'💻', ville:'Kinshasa',   type:'CDI',   cat:'IT & Tech', salaire:'1 500 – 2 500 USD/mois', urgent:true,  remote:true,  candidatures:23 },
  { id:'2', titre:'Comptable Senior',                     entreprise:'Banque Comm. du Congo', logo:'🏦', ville:'Kinshasa',   type:'CDI',   cat:'Finance',   salaire:'1 000 – 1 800 USD/mois', urgent:false, remote:false, candidatures:45 },
  { id:'3', titre:'Médecin Généraliste',                  entreprise:'Clinique Ngaliema',     logo:'🏥', ville:'Kinshasa',   type:'CDI',   cat:'Santé',     salaire:'1 200 – 2 000 USD/mois', urgent:true,  remote:false, candidatures:12 },
  { id:'4', titre:'Stage Marketing Digital',              entreprise:'Congo Media Group',     logo:'📱', ville:'Lubumbashi', type:'Stage', cat:'Commerce',  salaire:'200 – 400 USD/mois',    urgent:false, remote:true,  candidatures:67 },
  { id:'5', titre:'Ingénieur Civil — Projets Infra',      entreprise:'SOCICO',                logo:'🏗', ville:'Goma',       type:'CDD',   cat:'BTP',       salaire:'1 800 – 3 000 USD/mois', urgent:false, remote:false, candidatures:8  },
  { id:'6', titre:'Enseignant Mathématiques — Lycée',     entreprise:'Institut Boboto',       logo:'📚', ville:'Kinshasa',   type:'CDI',   cat:'Éducation', salaire:'500 – 800 USD/mois',     urgent:false, remote:false, candidatures:34 },
]

export default function EmploiPage() {
  const [activeCat,  setActiveCat]  = useState('Tous')
  const [activeType, setActiveType] = useState('Tous')

  const filtered = JOBS.filter(j =>
    (activeCat  === 'Tous' || j.cat  === activeCat) &&
    (activeType === 'Tous' || j.type === activeType)
  )

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-white">💼 Emploi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {JOBS.length} offres disponibles en RDC
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: MOD, boxShadow: '0 2px 8px rgba(8,145,178,0.30)' }}>
          + Publier une offre
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl p-4 mb-4"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            <input placeholder="Poste, entreprise, compétences..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div className="relative sm:w-44">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>📍</span>
            <input placeholder="Ville ou province" readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap text-white"
                  style={{ backgroundColor: MOD }}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-2 no-scrollbar">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              border:          `1px solid ${activeCat === c ? MOD : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: activeCat === c ? 'rgba(8,145,178,0.12)' : 'transparent',
              color:           activeCat === c ? MOD : 'rgba(255,255,255,0.45)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Job types */}
      <div className="flex gap-2 mb-6">
        {JOB_TYPES.map((t) => (
          <button key={t} onClick={() => setActiveType(t)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              border:          `1px solid ${activeType === t ? MOD : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: activeType === t ? 'rgba(8,145,178,0.12)' : 'transparent',
              color:           activeType === t ? MOD : 'rgba(255,255,255,0.45)',
            }}>
            {t}
          </button>
        ))}
        <button className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)' }}>
          🌐 Remote
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filtered.map((job) => (
          <div key={job.id}
               className="rounded-xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                   style={{ backgroundColor: 'rgba(8,145,178,0.15)', border: '1px solid rgba(8,145,178,0.25)' }}>
                {job.logo}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-white">{job.titre}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      {job.entreprise} · 📍 {job.ville}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {job.urgent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                        🔥 Urgent
                      </span>
                    )}
                    {job.remote && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(8,145,178,0.15)', color: MOD }}>
                        🌐 Remote
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(8,145,178,0.15)', color: MOD }}>
                    {job.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>
                    {job.cat}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold" style={{ color: MOD }}>{job.salaire}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    📝 {job.candidatures} candidats
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: MOD }}>
                Postuler maintenant →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-xl"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-4xl mb-3">💼</div>
          <p className="font-semibold text-white">Aucune offre trouvée</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>Modifiez vos filtres</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ border: `1px solid ${MOD}`, color: MOD }}>
          Charger plus d&apos;offres
        </button>
      </div>
    </div>
  )
}
