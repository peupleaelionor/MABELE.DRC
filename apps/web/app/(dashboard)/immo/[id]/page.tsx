// ─── Listing Detail — Dark Premium ────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: "Détail de l'annonce — MABELE" }

const ACC = '#E05C1A'

const LISTING = {
  id: '1',
  title: 'Appartement à Gombe, 3 chambres',
  price: '5,000 $ / mois',
  type: 'Location',
  location: 'Gombe, Kinshasa',
  area: '130 m²',
  rooms: 3,
  bathrooms: 2,
  floor: 4,
  description: `Bel appartement moderne situé au cœur de Gombe, le quartier d'affaires de Kinshasa.\nAppartement entièrement rénové avec finitions haut de gamme.\nCuisine équipée, salon spacieux, terrasse avec vue sur la ville.\nSécurité 24h/24, parking inclus, groupe électrogène.`,
  features: ['Cuisine équipée', 'Parking inclus', 'Groupe électrogène', 'Sécurité 24/7', 'Terrasse', 'Vue ville'],
  seller: {
    name: 'Nadine Naffie',
    score: 920,
    verified: true,
    phone: '+243 81 234 5678',
    since: 'Janvier 2023',
    listings: 12,
  },
  images: 4,
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/immo"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ←
          </Link>
          <h1 className="flex-1 font-semibold text-sm text-white truncate">Détail de l'Annonce</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-lg"
                  style={{ color: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            🤍
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{ color: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ⬆
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="aspect-video relative flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
          <span className="text-6xl opacity-20">🏠</span>
          <div className="absolute bottom-3 right-3 text-white text-xs px-2.5 py-1 rounded-full"
               style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
            1 / {LISTING.images} photos
          </div>
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(224,92,26,0.20)', color: ACC }}>
            {LISTING.type}
          </span>
        </div>

        <div className="p-4 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-bold text-xl text-white leading-tight">{LISTING.title}</h1>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>📍 {LISTING.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: ACC }}>{LISTING.price}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 pt-4"
                   style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { icon:'📐', label:LISTING.area,              sub:'Surface'  },
                  { icon:'🛏', label:`${LISTING.rooms}`,         sub:'Chambres' },
                  { icon:'🚿', label:`${LISTING.bathrooms}`,     sub:'SdB'      },
                  { icon:'🏢', label:`Étage ${LISTING.floor}`,   sub:'Étage'    },
                ].map((s) => (
                  <div key={s.sub} className="text-center">
                    <div className="text-xl mb-0.5">{s.icon}</div>
                    <p className="font-semibold text-white text-sm">{s.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line"
                 style={{ color: 'rgba(255,255,255,0.55)' }}>
                {LISTING.description}
              </p>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Équipements & Services</h2>
              <div className="grid grid-cols-2 gap-2">
                {LISTING.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span className="text-xs" style={{ color: '#22C55E' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                     style={{ backgroundColor: ACC }}>
                  {LISTING.seller.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{LISTING.seller.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Membre depuis {LISTING.seller.since}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {LISTING.seller.verified && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
                       style={{ backgroundColor: 'rgba(34,197,94,0.10)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.20)' }}>
                    ✓ Compte Vérifié
                  </div>
                )}
                {[
                  { label:'Score Trust',      val:`⭐ ${LISTING.seller.score}` },
                  { label:'Annonces actives', val:`${LISTING.seller.listings}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.40)' }}>{row.label}</span>
                    <span className="font-bold text-white">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
                  📞 Contacter Vendeur
                </button>
                <button className="w-full py-2.5 rounded-xl text-sm font-medium"
                        style={{ border: `1px solid ${ACC}`, color: ACC }}>
                  💬 Envoyer Message
                </button>
                <button className="w-full py-2.5 rounded-xl text-sm font-medium"
                        style={{ backgroundColor: '#2D2D2D', color: 'rgba(255,255,255,0.60)' }}>
                  💰 Payer / Réserver
                </button>
              </div>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#2D2D2D', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>
                🔒 <strong className="text-white">Paiements sécurisés</strong> via KangaPay.
                Ne versez jamais d'argent en dehors de la plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${ACC}`, color: ACC }}>
            💬 Message
          </button>
          <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
            📞 Contacter
          </button>
        </div>
      </div>
    </div>
  )
}
