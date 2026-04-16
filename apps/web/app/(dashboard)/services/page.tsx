// ─── Services Hub ─────────────────────────────────────────────────────────────
// Source: Board 2 — "Exploration des Services" — 8 service cards grid
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Services — MABELE' }

const SERVICES = [
  {
    href: '/immo',
    icon: '🏠',
    label: 'Immobilier',
    desc: 'Acheter, louer, vendre des biens immobiliers en RDC',
    color: '#1B4FB3',
    stats: '12 000+ annonces',
  },
  {
    href: '/emploi',
    icon: '💼',
    label: 'Emploi',
    desc: 'Trouvez votre prochain poste ou recrutez des talents',
    color: '#0891B2',
    stats: '3 500+ offres',
  },
  {
    href: '/market',
    icon: '🛒',
    label: 'Marché',
    desc: 'Achetez et vendez tout type de produits en RDC',
    color: '#E02020',
    stats: '45 000+ articles',
  },
  {
    href: '/finance',
    icon: '💰',
    label: 'KangaPay',
    desc: 'Wallet, transferts d'argent et paiements en ligne',
    color: '#F5A623',
    stats: '1,25M CDF disponibles',
  },
  {
    href: '/agri',
    icon: '🌾',
    label: 'AgriTech',
    desc: 'Connectez producteurs et acheteurs de produits agricoles',
    color: '#16A34A',
    stats: '15 000+ agriculteurs',
  },
  {
    href: '/logistique',
    icon: '🚛',
    label: 'Logistique',
    desc: 'Transport, livraison et déménagement partout en RDC',
    color: '#0891B2',
    stats: '500+ prestataires',
  },
  {
    href: '/outils',
    icon: '🧾',
    label: 'NKISI',
    desc: 'Facturation, devis et gestion business simplifiée',
    color: '#7C3AED',
    stats: 'Factures & Devis',
  },
  {
    href: '/data',
    icon: '📊',
    label: 'Congo Data',
    desc: 'Données économiques et indicateurs en temps réel',
    color: '#1B4FB3',
    stats: '26 provinces',
  },
  {
    href: '/bima',
    icon: '🏥',
    label: 'Bima Santé',
    desc: 'Assurance santé 100% digitale — souscription en 2 min',
    color: '#0891B2',
    stats: '250+ centres partenaires',
  },
]

export default function ServicesPage() {
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>
          Tous les Services
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8FA4BA' }}>
          8 modules pour tout ce dont vous avez besoin en RDC
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href}
            className="bg-white rounded-2xl p-5 flex flex-col transition-all hover:-translate-y-1 group"
            style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.06)' }}>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                 style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              {s.icon}
            </div>

            {/* Label */}
            <h2 className="font-bold text-base mb-1" style={{ color: '#0C1E47' }}>{s.label}</h2>
            <p className="text-xs leading-relaxed flex-1" style={{ color: '#8FA4BA' }}>{s.desc}</p>

            {/* Stats & Arrow */}
            <div className="flex items-center justify-between mt-4 pt-3"
                 style={{ borderTop: '1px solid #F5F8FC' }}>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                {s.stats}
              </span>
              <span className="text-sm font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: s.color }}>
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Trust Banner */}
      <div className="mt-10 rounded-2xl p-6 text-center"
           style={{ background: 'linear-gradient(135deg, #0C1E47, #1B4FB3)', boxShadow: '0 4px 20px rgba(12,30,71,0.15)' }}>
        <h2 className="font-bold text-lg text-white mb-2">
          🇨🇩 La super-plateforme du Congo
        </h2>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
          112M de Congolais · 26 provinces · 100% Mobile
        </p>
        <Link href="/publish"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' }}>
          + Publier une annonce
        </Link>
      </div>
    </div>
  )
}
