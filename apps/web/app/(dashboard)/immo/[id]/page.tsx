// ─── Listing Detail Page ───────────────────────────────────────────────────────
// Source: Board 2 — "Détail de l'Annonce"
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Détail de l\'annonce',
}

// Mock listing — replace with real fetch
const LISTING = {
  id: '1',
  title: 'Appartement à Gombe, 3 chambres',
  price: '5,000 $ / mois',
  priceValue: 5000,
  type: 'Location',
  category: 'Appartement',
  location: 'Gombe, Kinshasa',
  area: '130 m²',
  rooms: 3,
  bathrooms: 2,
  floor: 4,
  description: `Bel appartement moderne situé au cœur de Gombe, le quartier d'affaires de Kinshasa.
Appartement entièrement rénové avec finitions haut de gamme.
Cuisine équipée, salon spacieux, terrasse avec vue sur la ville.
Sécurité 24h/24, parking inclus, groupe électrogène.`,
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
    <div className="min-h-screen bg-bg-subtle">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-xs">
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/immo" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-subtle text-text-secondary">
            ←
          </Link>
          <h1 className="flex-1 font-semibold text-text-primary text-sm truncate">Détail de l'Annonce</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-subtle">🤍</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-subtle">⬆</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Image Gallery */}
        <div className="bg-gray-100 aspect-video relative flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl opacity-20">🏠</span>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            1 / {LISTING.images} photos
          </div>
        </div>

        <div className="p-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & Price */}
            <div className="bg-white rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-xl text-text-primary leading-tight">
                    {LISTING.title}
                  </h1>
                  <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
                    📍 {LISTING.location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-navy">{LISTING.price}</p>
                  <span className="badge badge-blue text-xs mt-1">{LISTING.type}</span>
                </div>
              </div>

              {/* Quick specs */}
              <div className="mt-4 grid grid-cols-4 gap-3 border-t border-border-light pt-4">
                {[
                  { icon: '📐', label: LISTING.area,          sub: 'Surface' },
                  { icon: '🛏',  label: `${LISTING.rooms}`,    sub: 'Chambres' },
                  { icon: '🚿', label: `${LISTING.bathrooms}`, sub: 'SdB' },
                  { icon: '🏢', label: `Étage ${LISTING.floor}`, sub: 'Étage' },
                ].map((s) => (
                  <div key={s.sub} className="text-center">
                    <div className="text-xl mb-0.5">{s.icon}</div>
                    <p className="font-semibold text-text-primary text-sm">{s.label}</p>
                    <p className="text-text-muted text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-border p-4 shadow-xs">
              <h2 className="font-semibold text-text-primary mb-3">Description</h2>
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {LISTING.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-border p-4 shadow-xs">
              <h2 className="font-semibold text-text-primary mb-3">Équipements & Services</h2>
              <div className="grid grid-cols-2 gap-2">
                {LISTING.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="text-success text-xs">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — Seller + CTA */}
          <div className="mt-4 lg:mt-0 space-y-4">
            {/* Seller card */}
            <div className="bg-white rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                  {LISTING.seller.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{LISTING.seller.name}</p>
                  <p className="text-text-muted text-xs">Membre depuis {LISTING.seller.since}</p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="space-y-2 mb-4">
                {LISTING.seller.verified && (
                  <span className="trust-verified w-full justify-center">✓ Compte Vérifié</span>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Score Trust</span>
                  <span className="font-bold text-navy">⭐ {LISTING.seller.score}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Annonces actives</span>
                  <span className="font-semibold text-text-primary">{LISTING.seller.listings}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <button className="btn-primary w-full">
                  📞 Contacter Vendeur
                </button>
                <button className="btn-outline w-full">
                  💬 Envoyer Message
                </button>
                <button className="btn-secondary w-full">
                  💰 Payer / Réserver
                </button>
              </div>
            </div>

            {/* Safety note */}
            <div className="bg-bg-subtle rounded-xl border border-border-light p-4">
              <p className="text-xs text-text-muted leading-relaxed">
                🔒 <strong className="text-text-secondary">Paiements sécurisés</strong> via KangaPay.
                Ne versez jamais d'argent en dehors de la plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-border shadow-nav">
        <div className="flex gap-2">
          <button className="btn-outline flex-1 text-sm py-3">💬 Message</button>
          <button className="btn-primary flex-1 text-sm py-3">📞 Contacter</button>
        </div>
      </div>
    </div>
  )
}
