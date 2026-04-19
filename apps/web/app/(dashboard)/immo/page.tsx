'use client'
// ─── Immobilier — Dark Premium ─────────────────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

const TYPES   = ['Tous', 'Appartement', 'Maison', 'Villa', 'Terrain', 'Bureau', 'Local']
const ACTIONS = ['Tous', 'Location', 'Vente']

const LISTINGS = [
  { id:'1', type:'Villa',       action:'Vente',    titre:'Belle villa avec piscine à Gombe',      loc:'Gombe, Kin.',    prix:'450 000 USD',    chambres:5, surface:400,  verified:true,  vues:234 },
  { id:'2', type:'Appartement', action:'Location', titre:'Appartement meublé 3 ch. — Lingwala',  loc:'Lingwala, Kin.', prix:'1 200 USD/mois', chambres:3, surface:120,  verified:false, vues:89  },
  { id:'3', type:'Terrain',     action:'Vente',    titre:'Terrain 1000m² à Ngaliema avec titre', loc:'Ngaliema, Kin.', prix:'85 000 USD',     chambres:0, surface:1000, verified:true,  vues:156 },
  { id:'4', type:'Bureau',      action:'Location', titre:'Espace bureau moderne — centre-ville',  loc:'Centre, Lshi.',  prix:'2 500 USD/mois', chambres:0, surface:200,  verified:true,  vues:67  },
  { id:'5', type:'Maison',      action:'Vente',    titre:'Maison familiale 4 ch. à Goma',         loc:'Volcans, Goma',  prix:'120 000 USD',    chambres:4, surface:180,  verified:false, vues:43  },
  { id:'6', type:'Appartement', action:'Location', titre:'Studio meublé proche université',       loc:'Lemba, Kin.',    prix:'350 USD/mois',   chambres:1, surface:35,   verified:false, vues:201 },
]

export default function ImmoPage() {
  const [activeType,   setActiveType]   = useState('Tous')
  const [activeAction, setActiveAction] = useState('Tous')
  const [liked,        setLiked]        = useState<Record<string, boolean>>({})

  const filtered = LISTINGS.filter(l =>
    (activeType   === 'Tous' || l.type   === activeType) &&
    (activeAction === 'Tous' || l.action === activeAction)
  )

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-white">🏠 Immobilier</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {LISTINGS.length} annonces disponibles en RDC
          </p>
        </div>
        <Link href="/publish"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACC, boxShadow: '0 2px 8px rgba(224,92,26,0.30)' }}>
          + Publier
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl p-4 mb-4"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            <input placeholder="Villa, appartement, terrain..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: ACC }}>
            Chercher
          </button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-2 no-scrollbar">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setActiveType(t)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              border:          `1px solid ${activeType === t ? ACC : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: activeType === t ? 'rgba(224,92,26,0.12)' : 'transparent',
              color:           activeType === t ? ACC : 'rgba(255,255,255,0.45)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Action filters */}
      <div className="flex gap-2 mb-6">
        {ACTIONS.map((a) => (
          <button key={a} onClick={() => setActiveAction(a)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              border:          `1px solid ${activeAction === a ? ACC : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: activeAction === a ? 'rgba(224,92,26,0.12)' : 'transparent',
              color:           activeAction === a ? ACC : 'rgba(255,255,255,0.45)',
            }}>
            {a}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.30)' }}>
            {/* Image */}
            <Link href={`/immo/${l.id}`}>
              <div className="aspect-[4/3] flex items-center justify-center relative"
                   style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
                <span className="text-5xl opacity-25">🏠</span>
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: l.action === 'Vente' ? 'rgba(224,92,26,0.20)' : 'rgba(8,145,178,0.20)',
                          color: l.action === 'Vente' ? ACC : '#38BDF8',
                        }}>
                    {l.action}
                  </span>
                </div>
                {/* Like button */}
                <button
                  className={`like-btn${liked[l.id] ? ' liked' : ''}`}
                  aria-label="J'aime"
                  onClick={(e) => { e.preventDefault(); setLiked(p => ({ ...p, [l.id]: !p[l.id] })) }}>
                  <span className="text-sm">{liked[l.id] ? '♥' : '♡'}</span>
                </button>
                {l.verified && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(34,197,94,0.20)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
                    ✓ Vérifié
                  </span>
                )}
              </div>
            </Link>
            <div className="p-3">
              <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.40)' }}>{l.type}</p>
              <Link href={`/immo/${l.id}`}>
                <p className="text-sm font-medium leading-tight mt-0.5 text-white">{l.titre}</p>
              </Link>
              <p className="text-sm font-bold mt-1" style={{ color: ACC }}>{l.prix}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>📍 {l.loc}</p>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {l.chambres > 0 && <span>🛏 {l.chambres}</span>}
                  {l.surface > 0  && <span>📐 {l.surface}m²</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-xl"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-4xl mb-3">🏠</div>
          <p className="font-semibold text-white">Aucune annonce trouvée</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>Modifiez vos filtres</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ border: `1px solid ${ACC}`, color: ACC }}>
          Charger plus d&apos;annonces
        </button>
      </div>
    </div>
  )
}
