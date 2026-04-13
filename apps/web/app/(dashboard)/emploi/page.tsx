import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Emploi — Offres d'emploi RDC",
  description: "Des milliers d'offres d'emploi à travers toutes les provinces de la RDC.",
}

const CATEGORIES = ['Tous', 'IT & Tech', 'Finance', 'Santé', 'Éducation', 'BTP', 'Commerce', 'Agriculture', 'Juridique']
const JOB_TYPES = ['Tous', 'CDI', 'CDD', 'Freelance', 'Stage', 'Intérim']

const SAMPLE_JOBS = [
  {
    id: '1',
    titre: 'Développeur Full Stack React/Node.js',
    entreprise: 'TechFlow Solutions',
    logo: '💻',
    ville: 'Kinshasa',
    province: 'Kinshasa',
    type: 'CDI',
    categorie: 'IT & Tech',
    salaireMin: 1500,
    salaireMax: 2500,
    devise: 'USD',
    experience: '3+ ans',
    competences: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    urgent: true,
    remote: true,
    vues: 456,
    candidatures: 23,
  },
  {
    id: '2',
    titre: 'Comptable Senior',
    entreprise: 'Banque Commerciale du Congo',
    logo: '🏦',
    ville: 'Kinshasa',
    province: 'Kinshasa',
    type: 'CDI',
    categorie: 'Finance',
    salaireMin: 1000,
    salaireMax: 1800,
    devise: 'USD',
    experience: '5+ ans',
    competences: ['OHADA', 'Excel', 'SAP'],
    urgent: false,
    remote: false,
    vues: 234,
    candidatures: 45,
  },
  {
    id: '3',
    titre: 'Médecin Généraliste',
    entreprise: 'Clinique Ngaliema',
    logo: '🏥',
    ville: 'Kinshasa',
    province: 'Kinshasa',
    type: 'CDI',
    categorie: 'Santé',
    salaireMin: 1200,
    salaireMax: 2000,
    devise: 'USD',
    experience: '2+ ans',
    competences: ['Médecine générale', 'Urgences'],
    urgent: true,
    remote: false,
    vues: 189,
    candidatures: 12,
  },
  {
    id: '4',
    titre: 'Stage Marketing Digital',
    entreprise: 'Congo Media Group',
    logo: '📱',
    ville: 'Lubumbashi',
    province: 'Haut-Katanga',
    type: 'Stage',
    categorie: 'Commerce',
    salaireMin: 200,
    salaireMax: 400,
    devise: 'USD',
    experience: 'Débutant',
    competences: ['Social Media', 'Canva', 'Facebook Ads'],
    urgent: false,
    remote: true,
    vues: 312,
    candidatures: 67,
  },
  {
    id: '5',
    titre: 'Ingénieur Civil — Projets Infrastructure',
    entreprise: 'SOCICO',
    logo: '🏗',
    ville: 'Goma',
    province: 'Nord-Kivu',
    type: 'CDD',
    categorie: 'BTP',
    salaireMin: 1800,
    salaireMax: 3000,
    devise: 'USD',
    experience: '5+ ans',
    competences: ['AutoCAD', 'MS Project', 'Béton armé'],
    urgent: false,
    remote: false,
    vues: 98,
    candidatures: 8,
  },
  {
    id: '6',
    titre: 'Enseignant Mathématiques — Lycée',
    entreprise: 'Institut Boboto',
    logo: '📚',
    ville: 'Kinshasa',
    province: 'Kinshasa',
    type: 'CDI',
    categorie: 'Éducation',
    salaireMin: 500,
    salaireMax: 800,
    devise: 'USD',
    experience: '2+ ans',
    competences: ['Mathématiques', 'Pédagogie'],
    urgent: false,
    remote: false,
    vues: 145,
    candidatures: 34,
  },
]

export default function EmploiPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          💼 Emploi
        </h1>
        <p className="text-muted-foreground">{SAMPLE_JOBS.length} offres disponibles</p>
      </div>

      {/* Search */}
      <div className="card-base p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Poste, entreprise, compétences..."
            className="input-field flex-1"
            readOnly
          />
          <input
            type="text"
            placeholder="📍 Ville ou province"
            className="input-field sm:w-48"
            readOnly
          />
          <button className="btn-primary whitespace-nowrap" style={{ backgroundColor: '#26C6DA', color: '#0E0E0E' }}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              cat === 'Tous'
                ? 'border-[#26C6DA] bg-[#26C6DA20] text-[#26C6DA]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              type === 'Tous'
                ? 'border-[#26C6DA] bg-[#26C6DA20] text-[#26C6DA]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            {type}
          </button>
        ))}
        <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground whitespace-nowrap flex items-center gap-1">
          🌐 Remote
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {SAMPLE_JOBS.map((job) => (
          <div key={job.id} className="card-base card-hover cursor-pointer">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-[10px] bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                {job.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">{job.titre}</h3>
                    <p className="text-xs text-muted-foreground">{job.entreprise}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {job.urgent && (
                      <span className="badge bg-red-500/20 text-red-400 text-[10px]">🔥 Urgent</span>
                    )}
                    {job.remote && (
                      <span className="badge bg-blue-500/20 text-blue-400 text-[10px]">🌐 Remote</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="badge text-[10px]"
                    style={{ backgroundColor: '#26C6DA20', color: '#26C6DA' }}
                  >
                    {job.type}
                  </span>
                  <span className="badge bg-muted text-muted-foreground text-[10px]">{job.categorie}</span>
                  <span className="badge bg-muted text-muted-foreground text-[10px]">
                    📍 {job.ville}
                  </span>
                  <span className="badge bg-muted text-muted-foreground text-[10px]">
                    ⏳ {job.experience}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {job.competences.slice(0, 3).map((c) => (
                    <span key={c} className="badge bg-muted text-muted-foreground text-[10px]">{c}</span>
                  ))}
                  {job.competences.length > 3 && (
                    <span className="badge bg-muted text-muted-foreground text-[10px]">+{job.competences.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    {job.salaireMin ? (
                      <span className="text-sm font-bold" style={{ color: '#26C6DA' }}>
                        {job.salaireMin.toLocaleString()} – {job.salaireMax?.toLocaleString()} {job.devise}/mois
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Salaire à négocier</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>👁 {job.vues}</span>
                    <span>📝 {job.candidatures}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="btn-primary text-xs px-4 py-2"
                style={{ backgroundColor: '#26C6DA', color: '#0E0E0E' }}
              >
                Postuler maintenant
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn-outline" style={{ borderColor: '#26C6DA', color: '#26C6DA' }}>
          Charger plus d&apos;offres
        </button>
      </div>

      <button
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg z-30 font-bold"
        style={{ backgroundColor: '#26C6DA', color: '#0E0E0E' }}
        title="Publier une offre"
      >
        +
      </button>
    </div>
  )
}
