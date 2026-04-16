// ─── Global Search Page ────────────────────────────────────────────────────────
// Source: Board 2 — Search + Filters
'use client'

import { useState } from 'react'
import Link from 'next/link'

const FILTERS = [
  { id: 'prix',         label: 'Prix'         },
  { id: 'type',         label: 'Type'         },
  { id: 'localisation', label: 'Localisation' },
  { id: 'verified',     label: 'Vérifié'      },
]

const SAMPLE_RESULTS = [
  { id: '1', title: 'Appartement à Gombe, 3 chambres',       price: '5,000 $/mois',  location: 'Gombe, Kinshasa',       category: 'Immobilier', verified: true  },
  { id: '2', title: 'Développeur Full Stack — CDI',           price: '800 $/mois',    location: 'Kinshasa',              category: 'Emploi',     verified: false },
  { id: '3', title: 'iPhone 14 Pro — Excellent état',         price: '750 $',         location: 'Gombe, Kinshasa',       category: 'Marché',     verified: true  },
  { id: '4', title: 'Villa 5 chambres à Lemba',               price: '1,200 $/mois',  location: 'Lemba, Kinshasa',       category: 'Immobilier', verified: true  },
  { id: '5', title: 'Sacs de maïs 50kg — Kolwezi',           price: '45 $/sac',      location: 'Kolwezi, Lualaba',      category: 'AgriTech',   verified: false },
  { id: '6', title: 'Comptable Senior — Lubumbashi',          price: '600 $/mois',    location: 'Lubumbashi',            category: 'Emploi',     verified: true  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Immobilier: '#1B4FB3',
  Emploi:     '#0891B2',
  Marché:     '#E02020',
  AgriTech:   '#16A34A',
}

export default function SearchPage() {
  const [query,   setQuery]   = useState('')
  const [active,  setActive]  = useState<string[]>([])
  const [saved,   setSaved]   = useState<Set<string>>(new Set())

  const results = SAMPLE_RESULTS.filter((r) =>
    !query || r.title.toLowerCase().includes(query.toLowerCase()) ||
              r.category.toLowerCase().includes(query.toLowerCase()) ||
              r.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg-subtle">
      {/* Search header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-xs px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-text-muted hover:text-primary flex-shrink-0">←</Link>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher sur MABELE..."
              className="input pl-9 h-10 bg-bg-subtle border-border-light"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(({ id, label }) => {
            const on = active.includes(id)
            return (
              <button
                key={id}
                onClick={() => setActive(on ? active.filter((a) => a !== id) : [...active, id])}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${on ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-border text-text-secondary hover:border-primary'}`}
              >
                {label}
                {on && <span onClick={(e) => { e.stopPropagation(); setActive(active.filter((a) => a !== id)) }}>×</span>}
              </button>
            )
          })}
        </div>
      </header>

      <div className="p-4">
        {/* Results count */}
        {query && (
          <p className="text-text-muted text-sm mb-4">
            {results.length} résultat{results.length !== 1 ? 's' : ''} pour «<strong className="text-text-primary">{query}</strong>»
          </p>
        )}

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/immo/${item.id}`}
                className="card overflow-hidden card-hover block"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
                  <span className="text-4xl opacity-20">
                    {item.category === 'Immobilier' ? '🏠' : item.category === 'Emploi' ? '💼' : item.category === 'AgriTech' ? '🌾' : '🛒'}
                  </span>
                  {item.verified && (
                    <span className="absolute bottom-2 left-2 trust-verified text-[10px] px-2 py-0.5">✓ Vérifié</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setSaved((s) => {
                        const n = new Set(s)
                        n.has(item.id) ? n.delete(item.id) : n.add(item.id)
                        return n
                      })
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center"
                  >
                    {saved.has(item.id) ? '❤️' : '🤍'}
                  </button>
                  <span
                    className="absolute top-2 left-2 badge text-[10px] px-2 py-0.5"
                    style={{ backgroundColor: `${CATEGORY_COLORS[item.category] ?? '#1B4FB3'}20`, color: CATEGORY_COLORS[item.category] ?? '#1B4FB3' }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-sm font-semibold text-text-primary line-clamp-2">{item.title}</p>
                  <p className="text-base font-bold text-navy mt-1">{item.price}</p>
                  <p className="text-xs text-text-muted mt-1">📍 {item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-bg-muted flex items-center justify-center text-4xl mb-4">
              🔍
            </div>
            <h3 className="font-semibold text-text-primary mb-1">Aucun résultat trouvé</h3>
            <p className="text-text-muted text-sm max-w-xs">
              Essayez d'autres mots-clés ou élargissez vos filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
