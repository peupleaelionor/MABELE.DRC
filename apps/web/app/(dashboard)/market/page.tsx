'use client'
// ─── Marché ───────────────────────────────────────────────────────────────────
// Source: Board 2 — white-first, red module color #E02020
import { useState } from 'react'

const CATEGORIES = [
  { id:'all',       label:'Tout',         emoji:'🛒' },
  { id:'elec',      label:'Électronique', emoji:'📱' },
  { id:'vehicules', label:'Véhicules',    emoji:'🚗' },
  { id:'vetements', label:'Vêtements',    emoji:'👗' },
  { id:'maison',    label:'Maison',       emoji:'🏠' },
  { id:'beaute',    label:'Beauté',       emoji:'💄' },
  { id:'sport',     label:'Sport',        emoji:'⚽' },
]

const ITEMS = [
  { id:'1', nom:'iPhone 13 Pro — 256GB',        cat:'Électronique', prix:'750 USD',    etat:'Occasion',      ville:'Kinshasa',   photo:'📱', vues:234 },
  { id:'2', nom:'Toyota Corolla 2018',           cat:'Véhicules',    prix:'18 500 USD', etat:'Occasion',      ville:'Kinshasa',   photo:'🚗', vues:456 },
  { id:'3', nom:'Frigidaire Samsung 350L',       cat:'Maison',       prix:'580 USD',    etat:'Neuf',          ville:'Lubumbashi', photo:'🧊', vues:89  },
  { id:'4', nom:'Groupe électrogène 5KVA',       cat:'Maison',       prix:'1 200 USD',  etat:'Occasion',      ville:'Kinshasa',   photo:'⚡', vues:321 },
  { id:'5', nom:'Laptop Dell XPS 15 — i7',       cat:'Électronique', prix:'1 100 USD',  etat:'Reconditionné', ville:'Goma',       photo:'💻', vues:178 },
  { id:'6', nom:'Moto Honda CBF 125',            cat:'Véhicules',    prix:'2 200 USD',  etat:'Occasion',      ville:'Mbuji-Mayi', photo:'🏍', vues:267 },
  { id:'7', nom:'Machine à coudre industrielle', cat:'Maison',       prix:'450 USD',    etat:'Occasion',      ville:'Kinshasa',   photo:'🪡', vues:43  },
  { id:'8', nom:"Téléviseur LG OLED 55\"",       cat:'Électronique', prix:'890 USD',    etat:'Neuf',          ville:'Kinshasa',   photo:'📺', vues:156 },
]

const ETAT_COLORS: Record<string, { bg: string; text: string }> = {
  Neuf:          { bg: '#DCFCE7', text: '#16A34A' },
  Occasion:      { bg: '#FFF7E6', text: '#D4881A' },
  Reconditionné: { bg: '#EFF6FF', text: '#1B4FB3' },
}

export default function MarketPage() {
  const [activeCat, setActiveCat] = useState('all')

  const filtered = ITEMS.filter(i => activeCat === 'all' || i.cat === CATEGORIES.find(c => c.id === activeCat)?.label)

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🛒 Marché</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>{ITEMS.length} articles disponibles</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#E02020', color: 'white', boxShadow: '0 2px 8px rgba(224,32,32,0.25)' }}>
          + Vendre
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-4" style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input placeholder="Rechercher un article..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#0C1E47' }} />
          </div>
          <select className="px-3 py-2.5 rounded-lg text-sm sm:w-36 focus:outline-none"
                  style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#3D526B' }}>
            <option>Toutes villes</option>
            <option>Kinshasa</option>
            <option>Lubumbashi</option>
            <option>Goma</option>
          </select>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#E02020', color: 'white' }}>
            Go
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl flex-shrink-0 transition-all"
            style={{
              border:          `1px solid ${activeCat === cat.id ? '#E02020' : '#E8EEF4'}`,
              backgroundColor: activeCat === cat.id ? '#FEF2F2' : 'white',
              minWidth: '72px',
            }}>
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-[10px] font-medium whitespace-nowrap"
                  style={{ color: activeCat === cat.id ? '#E02020' : '#8FA4BA' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item) => {
          const ec = ETAT_COLORS[item.etat] ?? { bg: '#F5F8FC', text: '#8FA4BA' }
          return (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
                 style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.06)' }}>
              <div className="aspect-square flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #F5F8FC, #EBF0F7)' }}>
                <span className="text-5xl">{item.photo}</span>
              </div>
              <div className="p-3">
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: ec.bg, color: ec.text }}>
                  {item.etat}
                </span>
                <h3 className="text-xs font-semibold mt-1.5 leading-tight line-clamp-2" style={{ color: '#0C1E47' }}>
                  {item.nom}
                </h3>
                <p className="text-sm font-bold mt-1" style={{ color: '#E02020' }}>{item.prix}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px]" style={{ color: '#8FA4BA' }}>📍 {item.ville}</span>
                  <span className="text-[10px]" style={{ color: '#8FA4BA' }}>👁 {item.vues}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl" style={{ border: '1px solid #E8EEF4' }}>
          <div className="text-4xl mb-3">🛒</div>
          <p className="font-semibold" style={{ color: '#0C1E47' }}>Aucun article trouvé</p>
          <p className="text-sm mt-1" style={{ color: '#8FA4BA' }}>Modifiez votre catégorie</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                style={{ border: '1px solid #E02020', color: '#E02020', backgroundColor: 'white' }}>
          Voir plus d&apos;articles
        </button>
      </div>
    </div>
  )
}
