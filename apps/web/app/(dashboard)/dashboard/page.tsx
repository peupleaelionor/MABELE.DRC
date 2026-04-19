// ─── Dashboard Home — Dark Premium ────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Tableau de Bord — MABELE' }

const ACC = '#E05C1A'

const QUICK_SERVICES = [
  { icon: '🏘', label: 'Immobilier', href: '/immo',       color: '#E05C1A' },
  { icon: '💼', label: 'Emploi',     href: '/emploi',     color: '#0891B2' },
  { icon: '🛒', label: 'Marché',     href: '/market',     color: '#E02020' },
  { icon: '💰', label: 'KangaPay',   href: '/finance',    color: '#E05C1A' },
  { icon: '🌾', label: 'AgriTech',   href: '/agri',       color: '#16A34A' },
  { icon: '🚛', label: 'Logistique', href: '/logistique', color: '#0891B2' },
  { icon: '🧾', label: 'NKISI',      href: '/outils',     color: '#7C3AED' },
  { icon: '📊', label: 'Congo Data', href: '/data',       color: '#1B4FB3' },
]

const FEATURED = [
  { id: '1', title: 'Appartement à Gombe, 3 ch.',    price: '5 000 $ / mois', loc: 'Gombe, Kin.',    verified: true  },
  { id: '2', title: 'Villa 5 chambres à Lemba',       price: '1 200 $ / mois', loc: 'Lemba, Kin.',    verified: true  },
  { id: '3', title: 'Studio meublé — Kintambo',       price: '350 $ / mois',   loc: 'Kintambo, Kin.', verified: false },
  { id: '4', title: 'Bureau 80m² — Plateau',          price: '800 $ / mois',   loc: 'Plateau, Kin.',  verified: true  },
]

const RECENT_NOTIFS = [
  { icon: '✅', text: 'Votre annonce a été acceptée',          time: 'il y a 5 min',  color: '#22C55E' },
  { icon: '💬', text: 'Nouveau message de Nadine N.',          time: 'il y a 12 min', color: '#38BDF8' },
  { icon: '💰', text: 'Paiement KangaPay de 15 000 CDF reçu', time: 'il y a 1h',     color: ACC       },
]

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-2xl text-white">Bonjour, Jean-Pierre 👋</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Bienvenue sur votre tableau de bord
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: 'rgba(224,92,26,0.12)', color: ACC, border: '1px solid rgba(224,92,26,0.20)' }}>
          ⭐ Score Trust 850
        </span>
      </div>

      {/* ── Search + Publish ── */}
      <div className="flex gap-3">
        <Link href="/search"
          className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
          <span>🔍</span> Rechercher sur MABELE...
        </Link>
        <Link href="/publish"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
          style={{ backgroundColor: ACC, boxShadow: '0 2px 10px rgba(224,92,26,0.35)' }}>
          + Publier
        </Link>
      </div>

      {/* ── Quick Services ── */}
      <div>
        <h2 className="font-semibold text-base text-white mb-3">Accès rapide</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_SERVICES.map((s) => (
            <Link key={s.label} href={s.href}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105"
                   style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                {s.icon}
              </div>
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── KangaPay mini card ── */}
      <div className="rounded-2xl p-5 text-white"
           style={{ background: 'linear-gradient(135deg, #2A1A0A, #1A0D04)', border: '1px solid rgba(224,92,26,0.25)', boxShadow: '0 4px 20px rgba(224,92,26,0.15)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>KangaPay Wallet</p>
            <p className="text-2xl font-bold mt-1">245 <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>USD</span></p>
          </div>
          <span className="text-3xl">💰</span>
        </div>
        <div className="flex gap-2">
          <Link href="/finance/envoyer"
            className="flex-1 text-center py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: ACC }}>
            ✈ Envoyer
          </Link>
          <Link href="/finance/recevoir"
            className="flex-1 text-center py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.20)', color: 'white' }}>
            ⬜ Scanner QR
          </Link>
        </div>
      </div>

      {/* ── Featured Listings ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base text-white">Annonces à la Une</h2>
          <Link href="/immo" className="text-sm font-medium" style={{ color: ACC }}>Voir tout →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURED.map((item) => (
            <Link key={item.id} href={`/immo/${item.id}`}
              className="rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.30)' }}>
              <div className="aspect-[4/3] flex items-center justify-center relative"
                   style={{ background: 'linear-gradient(135deg, #2A2A2A, #333333)' }}>
                <span className="text-4xl opacity-30">🏠</span>
                {/* Like button */}
                <button className="like-btn" aria-label="J'aime">
                  <span className="text-sm">♡</span>
                </button>
                {item.verified && (
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(34,197,94,0.20)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.30)' }}>
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium leading-tight text-white">{item.title}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: ACC }}>{item.price}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>📍 {item.loc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Notifications ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base text-white">Activité récente</h2>
          <Link href="/profile" className="text-sm font-medium" style={{ color: ACC }}>Tout voir →</Link>
        </div>
        <div className="rounded-xl divide-y"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', divideColor: 'rgba(255,255,255,0.06)' }}>
          {RECENT_NOTIFS.map((n, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3"
                 style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                   style={{ backgroundColor: `${n.color}18` }}>
                {n.icon}
              </div>
              <p className="flex-1 text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>{n.text}</p>
              <p className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.30)' }}>{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
