// ─── Global Search — Dark Premium ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

const FILTERS = [
  { id: 'prix',         label: 'Prix'         },
  { id: 'type',         label: 'Type'         },
  { id: 'localisation', label: 'Localisation' },
  { id: 'verified',     label: 'Vérifié'      },
]

const SAMPLE_RESULTS = [
  { id:'1', title:'Appartement à Gombe, 3 chambres',  price:'5,000 $/mois', location:'Gombe, Kinshasa',  category:'Immobilier', verified:true  },
  { id:'2', title:'Développeur Full Stack — CDI',      price:'800 $/mois',   location:'Kinshasa',         category:'Emploi',     verified:false },
  { id:'3', title:'iPhone 14 Pro — Excellent état',    price:'750 $',        location:'Gombe, Kinshasa',  category:'Marché',     verified:true  },
  { id:'4', title:'Villa 5 chambres à Lemba',          price:'1,200 $/mois', location:'Lemba, Kinshasa',  category:'Immobilier', verified:true  },
  { id:'5', title:'Sacs de maïs 50kg — Kolwezi',      price:'45 $/sac',     location:'Kolwezi, Lualaba', category:'AgriTech',   verified:false },
  { id:'6', title:'Comptable Senior — Lubumbashi',     price:'600 $/mois',   location:'Lubumbashi',       category:'Emploi',     verified:true  },
]

const CAT_COLORS: Record<string, string> = {
  Immobilier: '#E05C1A',
  Emploi:     '#0891B2',
  Marché:     '#E02020',
  AgriTech:   '#16A34A',
}

export default function SearchPage() {
  const [query,  setQuery]  = useState('')
  const [active, setActive] = useState<string[]>([])
  const [saved,  setSaved]  = useState<Set<string>>(new Set())

  const results = SAMPLE_RESULTS.filter((r) =>
    !query ||
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.category.toLowerCase().includes(query.toLowerCase()) ||
    r.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>

      <header className="sticky top-0 z-30 px-4 py-3"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="flex-shrink-0 text-lg"
            style={{ color: 'rgba(255,255,255,0.55)' }}>←</Link>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            <input
              type="search" autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher sur MABELE..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(({ id, label }) => {
            const on = active.includes(id)
            return (
              <button key={id}
                onClick={() => setActive(on ? active.filter((a) => a !== id) : [...active, id])}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  border:          `1px solid ${on ? ACC : 'rgba(255,255,255,0.10)'}`,
                  backgroundColor: on ? 'rgba(224,92,26,0.12)' : 'transparent',
                  color:           on ? ACC : 'rgba(255,255,255,0.45)',
                }}>
                {label}
                {on && (
                  <span onClick={(e) => { e.stopPropagation(); setActive(active.filter((a) => a !== id)) }}>×</span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      <div className="p-4">
        {query && (
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {results.length} résultat{results.length !== 1 ? 's' : ''} pour{' '}
            «<strong className="text-white">{query}</strong>»
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => {
              const col = CAT_COLORS[item.category] ?? ACC
              return (
                <Link key={item.id} href={`/immo/${item.id}`}
                  className="rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 block"
                  style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="aspect-[4/3] flex items-center justify-center relative"
                       style={{ background: 'linear-gradient(135deg, #2D2D2D, #383838)' }}>
                    <span className="text-4xl opacity-25">
                      {item.category === 'Immobilier' ? '🏠' : item.category === 'Emploi' ? '💼' : item.category === 'AgriTech' ? '🌾' : '🛒'}
                    </span>
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setSaved((s) => { const n = new Set(s); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n })
                      }}
                      className="like-btn">
                      {saved.has(item.id) ? '♥' : '♡'}
                    </button>
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${col}20`, color: col }}>
                      {item.category}
                    </span>
                    {item.verified && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(34,197,94,0.20)', color: '#22C55E' }}>
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white line-clamp-2">{item.title}</p>
                    <p className="text-base font-bold mt-1" style={{ color: ACC }}>{item.price}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>📍 {item.location}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
                 style={{ backgroundColor: '#242424' }}>
              🔍
            </div>
            <h3 className="font-semibold text-white mb-1">Aucun résultat trouvé</h3>
            <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Essayez d'autres mots-clés ou élargissez vos filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
