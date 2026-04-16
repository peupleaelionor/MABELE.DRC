'use client'
// ─── Immobilier ───────────────────────────────────────────────────────────────
// Source: Board 2 — white-first, royal blue accents
import { useState } from 'react'
import Link from 'next/link'

const TYPES   = ['Tous', 'Appartement', 'Maison', 'Villa', 'Terrain', 'Bureau', 'Local']
const ACTIONS = ['Tous', 'Location', 'Vente']

const LISTINGS = [
  { id:'1', type:'Villa',      action:'Vente',    titre:'Belle villa avec piscine à Gombe',      loc:'Gombe, Kin.',    prix:'450 000 USD',    chambres:5, surface:400, verified:true,  vues:234 },
  { id:'2', type:'Appartement',action:'Location', titre:'Appartement meublé 3 ch. — Lingwala',  loc:'Lingwala, Kin.', prix:'1 200 USD/mois', chambres:3, surface:120, verified:false, vues:89  },
  { id:'3', type:'Terrain',    action:'Vente',    titre:'Terrain 1000m² à Ngaliema avec titre', loc:'Ngaliema, Kin.', prix:'85 000 USD',     chambres:0, surface:1000,verified:true,  vues:156 },
  { id:'4', type:'Bureau',     action:'Location', titre:'Espace bureau moderne — centre-ville',  loc:'Centre, Lshi.',  prix:'2 500 USD/mois', chambres:0, surface:200, verified:true,  vues:67  },
  { id:'5', type:'Maison',     action:'Vente',    titre:'Maison familiale 4 ch. à Goma',         loc:'Volcans, Goma',  prix:'120 000 USD',    chambres:4, surface:180, verified:false, vues:43  },
  { id:'6', type:'Appartement',action:'Location', titre:'Studio meublé proche université',       loc:'Lemba, Kin.',    prix:'350 USD/mois',   chambres:1, surface:35,  verified:false, vues:201 },
]

export default function ImmoPage() {
  const [activeType,   setActiveType]   = useState('Tous')
  const [activeAction, setActiveAction] = useState('Tous')

  const filtered = LISTINGS.filter(l =>
    (activeType   === 'Tous' || l.type   === activeType) &&
    (activeAction === 'Tous' || l.action === activeAction)
  )

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🏠 Immobilier</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>{LISTINGS.length} annonces disponibles en RDC</p>
        </div>
        <Link href="/publish"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 2px 8px rgba(245,166,35,0.30)' }}>
          + Publier
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-4" style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input placeholder="Villa, appartement, terrain..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#0C1E47' }} />
          </div>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#1B4FB3', color: 'white' }}>
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
              border:          `1px solid ${activeType === t ? '#1B4FB3' : '#E8EEF4'}`,
              backgroundColor: activeType === t ? '#EFF6FF' : '#FFFFFF',
              color:           activeType === t ? '#1B4FB3' : '#8FA4BA',
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
              border:          `1px solid ${activeAction === a ? '#1B4FB3' : '#E8EEF4'}`,
              backgroundColor: activeAction === a ? '#EFF6FF' : '#FFFFFF',
              color:           activeAction === a ? '#1B4FB3' : '#8FA4BA',
            }}>
            {a}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((l) => (
          <Link key={l.id} href={`/immo/${l.id}`}
            className="bg-white rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
            style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.06)' }}>
            {/* Image */}
            <div className="aspect-[4/3] flex items-center justify-center relative"
                 style={{ background: 'linear-gradient(135deg, #EBF0F7, #F5F8FC)' }}>
              <span className="text-5xl opacity-20">🏠</span>
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: l.action === 'Vente' ? '#FFF7E6' : '#EFF6FF',
                        color: l.action === 'Vente' ? '#D4881A' : '#1B4FB3',
                      }}>
                  {l.action}
                </span>
              </div>
              {l.verified && (
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #16A34A40' }}>
                  ✓ Vérifié
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-muted" style={{ color: '#8FA4BA' }}>{l.type}</p>
              <p className="text-sm font-medium leading-tight mt-0.5" style={{ color: '#0C1E47' }}>{l.titre}</p>
              <p className="text-sm font-bold mt-1" style={{ color: '#1B4FB3' }}>{l.prix}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px]" style={{ color: '#8FA4BA' }}>📍 {l.loc}</p>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: '#8FA4BA' }}>
                  {l.chambres > 0 && <span>🛏 {l.chambres}</span>}
                  {l.surface > 0  && <span>📐 {l.surface}m²</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl" style={{ border: '1px solid #E8EEF4' }}>
          <div className="text-4xl mb-3">🏠</div>
          <p className="font-semibold" style={{ color: '#0C1E47' }}>Aucune annonce trouvée</p>
          <p className="text-sm mt-1" style={{ color: '#8FA4BA' }}>Modifiez vos filtres</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ border: '1px solid #1B4FB3', color: '#1B4FB3', backgroundColor: 'white' }}>
          Charger plus d&apos;annonces
        </button>
      </div>
    </div>
  )
}
