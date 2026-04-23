'use client'
// ─── Market Item Detail — Dark Premium ────────────────────────────────────────
import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#E05C1A'
const RED = '#E02020'

const ITEM = {
  id: '1',
  nom: 'iPhone 13 Pro — 256GB',
  cat: 'Électronique',
  prix: 750,
  devise: 'USD',
  etat: 'Occasion' as 'Neuf' | 'Occasion' | 'Reconditionné',
  ville: 'Kinshasa',
  description: `iPhone 13 Pro en excellent état, batterie à 89%, écran sans rayure.
Livré avec chargeur original et boîte d'origine.
Débloqué tout opérateur — Orange, Airtel, Vodacom.
Disponible à Gombe pour rencontre ou livraison possible (+15 USD).`,
  vues: 234,
  vendeur: { nom: 'Pascal Bakamba', score: 870, verifie: true, depuis: 'Juin 2022', annonces: 8 },
  photos: 5,
}

const ETAT_COLOR: Record<string, { bg: string; color: string }> = {
  Neuf:          { bg: 'rgba(34,197,94,0.15)',  color: '#22C55E' },
  Occasion:      { bg: 'rgba(224,92,26,0.15)',  color: '#E05C1A' },
  Reconditionné: { bg: 'rgba(56,189,248,0.15)', color: '#38BDF8' },
}

export default function MarketItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const ec = ETAT_COLOR[ITEM.etat] ?? { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }

  function handleBuy() {
    router.push(`/checkout?itemId=${id}&type=PURCHASE&amount=${ITEM.prix}&currency=${ITEM.devise}&desc=${encodeURIComponent(ITEM.nom)}`)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <header className="sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/market"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ color: 'rgba(255,255,255,0.60)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ←
          </Link>
          <h1 className="flex-1 font-semibold text-sm text-white truncate">Détail de l&apos;article</h1>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl text-lg"
            style={{ color: liked ? RED : 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            onClick={() => setLiked(v => !v)}
            aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            {liked ? '♥' : '♡'}
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{ color: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            ⬆
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Photo gallery placeholder */}
        <div className="aspect-video relative flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
          <span className="text-7xl opacity-20">📱</span>
          <div className="absolute bottom-3 right-3 text-white text-xs px-2.5 py-1 rounded-full"
               style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
            1 / {ITEM.photos} photos
          </div>
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: ec.bg, color: ec.color }}>
            {ITEM.etat}
          </span>
        </div>

        <div className="p-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {ITEM.cat} · 📍 {ITEM.ville}
                  </p>
                  <h1 className="font-bold text-xl text-white leading-tight">{ITEM.nom}</h1>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: ACC }}>{ITEM.prix} {ITEM.devise}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    👁 {ITEM.vues} vues
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line"
                 style={{ color: 'rgba(255,255,255,0.55)' }}>
                {ITEM.description}
              </p>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white mb-3">Détails</h2>
              <div className="space-y-2">
                {[
                  { label: 'État',       val: ITEM.etat    },
                  { label: 'Catégorie', val: ITEM.cat     },
                  { label: 'Ville',     val: ITEM.ville   },
                  { label: 'Devise',    val: ITEM.devise  },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.40)' }}>{r.label}</span>
                    <span className="font-medium text-white">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller + CTA */}
          <div className="mt-4 lg:mt-0 space-y-4">
            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                     style={{ backgroundColor: ACC }}>
                  {ITEM.vendeur.nom[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{ITEM.vendeur.nom}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Depuis {ITEM.vendeur.depuis}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {ITEM.vendeur.verifie && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
                       style={{ backgroundColor: 'rgba(34,197,94,0.10)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.20)' }}>
                    ✓ Compte Vérifié
                  </div>
                )}
                {[
                  { label: 'Score Trust',    val: `⭐ ${ITEM.vendeur.score}` },
                  { label: 'Annonces',       val: `${ITEM.vendeur.annonces}` },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.40)' }}>{r.label}</span>
                    <span className="font-bold text-white">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleBuy}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: RED, boxShadow: '0 4px 16px rgba(224,32,32,0.35)' }}>
                  🛒 Acheter — {ITEM.prix} {ITEM.devise}
                </button>
                <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
                  📞 Contacter le vendeur
                </button>
                <Link href="/messages"
                  className="block w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:bg-white/5"
                  style={{ border: `1px solid ${ACC}`, color: ACC }}>
                  💬 Envoyer un message
                </Link>
              </div>
            </div>

            <div className="rounded-xl p-4"
                 style={{ backgroundColor: '#2D2D2D', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>
                🔒 <strong className="text-white">Paiements sécurisés</strong> via KangaPay.
                Ne versez jamais d&apos;argent en dehors de la plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom CTA */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${ACC}`, color: ACC }}>
            💬 Message
          </button>
          <button
            onClick={handleBuy}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: RED, boxShadow: '0 4px 16px rgba(224,32,32,0.35)' }}>
            🛒 Acheter
          </button>
        </div>
      </div>
    </div>
  )
}
