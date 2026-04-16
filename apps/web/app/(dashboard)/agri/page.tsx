'use client'
// ─── AgriTech ─────────────────────────────────────────────────────────────────
// Source: Board 2 — white-first, green module color #16A34A
import { useState } from 'react'

const PRODUCTS = [
  { id:'1', produit:'Maïs',           emoji:'🌽', qte:'50 sacs (50kg)',  prix:'25 USD/sac',   ville:'Bukavu',    province:'Sud-Kivu',  bio:true,  certifie:false },
  { id:'2', produit:'Manioc',         emoji:'🟤', qte:'200 kg',          prix:'0,50 USD/kg',  ville:'Kinshasa',  province:'Kinshasa',  bio:false, certifie:false },
  { id:'3', produit:'Café Arabica',   emoji:'☕', qte:'500 kg',          prix:'4,50 USD/kg',  ville:'Butembo',   province:'Nord-Kivu', bio:true,  certifie:true  },
  { id:'4', produit:'Huile de palme', emoji:'🫙', qte:'100 litres',      prix:'1,80 USD/L',   ville:'Mbandaka',  province:'Équateur',  bio:false, certifie:false },
  { id:'5', produit:'Tomates',        emoji:'🍅', qte:'500 kg',          prix:'0,80 USD/kg',  ville:'Goma',      province:'Nord-Kivu', bio:true,  certifie:false },
  { id:'6', produit:'Bananes plant.', emoji:'🍌', qte:'300 régimes',     prix:'3 USD/régime', ville:'Kisangani', province:'Tshopo',    bio:false, certifie:false },
]

export default function AgriPage() {
  const [onlyBio, setOnlyBio] = useState(false)

  const filtered = PRODUCTS.filter(p => !onlyBio || p.bio)

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🌾 AgriTech</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Produits agricoles frais de toutes les provinces</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#16A34A', color: 'white', boxShadow: '0 2px 8px rgba(22,163,74,0.25)' }}>
          + Publier
        </button>
      </div>

      {/* Stats Banner */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-6"
           style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
        {[
          { val: '2.4M ha', label: 'Terres arables' },
          { val: '15K+',    label: 'Agriculteurs' },
          { val: '48',      label: 'Produits référencés' },
          { val: '26',      label: 'Provinces' },
        ].map((s) => (
          <div key={s.label} className="text-center flex-1">
            <p className="text-xl font-bold" style={{ color: '#16A34A' }}>{s.val}</p>
            <p className="text-xs mt-0.5" style={{ color: '#8FA4BA' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-xl p-4 mb-6" style={{ border: '1px solid #E8EEF4' }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input placeholder="Maïs, manioc, café, tomates..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#0C1E47' }} />
          </div>
          <select className="px-3 py-2.5 rounded-lg text-sm focus:outline-none sm:w-44"
                  style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', color: '#3D526B' }}>
            <option>Toutes provinces</option>
            <option>Kinshasa</option>
            <option>Nord-Kivu</option>
            <option>Sud-Kivu</option>
            <option>Équateur</option>
          </select>
          <button className="px-4 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#16A34A', color: 'white' }}>
            Rechercher
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOnlyBio(!onlyBio)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              border:          `1px solid ${onlyBio ? '#16A34A' : '#E8EEF4'}`,
              backgroundColor: onlyBio ? '#DCFCE7' : 'white',
              color:           onlyBio ? '#16A34A' : '#8FA4BA',
            }}>
            🌿 Bio uniquement
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ border: '1px solid #E8EEF4', color: '#8FA4BA', backgroundColor: 'white' }}>
            ✓ Certifié
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ border: '1px solid #E8EEF4', color: '#8FA4BA', backgroundColor: 'white' }}>
            ✅ Disponible
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-4 transition-all hover:-translate-y-0.5"
               style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                   style={{ backgroundColor: '#DCFCE7', border: '1px solid #16A34A25' }}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#0C1E47' }}>{p.produit}</h3>
                  {p.bio && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>🌿 Bio</span>
                  )}
                  {p.certifie && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#EFF6FF', color: '#1B4FB3' }}>✓ Certifié</span>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: '#8FA4BA' }}>📍 {p.ville}, {p.province}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold" style={{ color: '#16A34A' }}>{p.prix}</span>
                  </div>
                  <span className="text-xs" style={{ color: '#8FA4BA' }}>{p.qte}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ border: '1px solid #16A34A', color: '#16A34A', backgroundColor: 'white' }}>
                Contacter
              </button>
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: '#16A34A', color: 'white' }}>
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl" style={{ border: '1px solid #E8EEF4' }}>
          <div className="text-4xl mb-3">🌾</div>
          <p className="font-semibold" style={{ color: '#0C1E47' }}>Aucun produit trouvé</p>
          <p className="text-sm mt-1" style={{ color: '#8FA4BA' }}>Modifiez vos filtres</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                style={{ border: '1px solid #16A34A', color: '#16A34A', backgroundColor: 'white' }}>
          Voir plus de produits
        </button>
      </div>
    </div>
  )
}
