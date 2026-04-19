'use client'
// ─── AgriTech — Dark Premium ───────────────────────────────────────────────────
import { useState } from 'react'

const MOD = '#16A34A'

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
          <h1 className="font-bold text-2xl text-white">🌾 AgriTech</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Produits agricoles frais de toutes les provinces
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: MOD, boxShadow: '0 2px 8px rgba(22,163,74,0.30)' }}>
          + Publier
        </button>
      </div>

      {/* Stats Banner */}
      <div className="rounded-xl p-4 mb-6 flex flex-wrap gap-6"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { val: '2.4M ha', label: 'Terres arables' },
          { val: '15K+',    label: 'Agriculteurs' },
          { val: '48',      label: 'Produits' },
          { val: '26',      label: 'Provinces' },
        ].map((s) => (
          <div key={s.label} className="text-center flex-1">
            <p className="text-xl font-bold" style={{ color: MOD }}>{s.val}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="rounded-xl p-4 mb-6"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            <input placeholder="Maïs, manioc, café, tomates..." readOnly
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <select className="px-3 py-2.5 rounded-xl text-sm focus:outline-none sm:w-44"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>
            <option>Toutes provinces</option>
            <option>Kinshasa</option>
            <option>Nord-Kivu</option>
            <option>Sud-Kivu</option>
            <option>Équateur</option>
          </select>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: MOD }}>
            Rechercher
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOnlyBio(!onlyBio)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              border:          `1px solid ${onlyBio ? MOD : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: onlyBio ? 'rgba(22,163,74,0.15)' : 'transparent',
              color:           onlyBio ? MOD : 'rgba(255,255,255,0.45)',
            }}>
            🌿 Bio uniquement
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)' }}>
            ✓ Certifié
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)' }}>
            ✅ Disponible
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id}
               className="rounded-xl p-4 transition-all hover:-translate-y-0.5"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                   style={{ backgroundColor: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)' }}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-sm text-white">{p.produit}</h3>
                  {p.bio && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(22,163,74,0.15)', color: MOD }}>
                      🌿 Bio
                    </span>
                  )}
                  {p.certifie && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(56,189,248,0.15)', color: '#38BDF8' }}>
                      ✓ Certifié
                    </span>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  📍 {p.ville}, {p.province}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: MOD }}>{p.prix}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.qte}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{ border: `1px solid ${MOD}`, color: MOD }}>
                Contacter
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: MOD }}>
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-xl"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-4xl mb-3">🌾</div>
          <p className="font-semibold text-white">Aucun produit trouvé</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>Modifiez vos filtres</p>
        </div>
      )}

      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ border: `1px solid ${MOD}`, color: MOD }}>
          Voir plus de produits
        </button>
      </div>
    </div>
  )
}
