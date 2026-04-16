'use client'
// ─── Logistique ───────────────────────────────────────────────────────────────
// Source: Board 2 — Transport & Logistique, module color #0891B2
import { useState } from 'react'

const SERVICE_TYPES = [
  { id: 'livraison',  emoji: '📦', label: 'Livraison',          desc: 'Colis, documents, marchandises' },
  { id: 'demenagement', emoji: '🚛', label: 'Déménagement',    desc: 'Appartement, maison, bureau' },
  { id: 'transport',  emoji: '🚗', label: 'Transport personne', desc: 'Taxi, chauffeur privé' },
  { id: 'fret',       emoji: '✈', label: 'Fret international', desc: 'Import/export en RDC' },
]

const PROVIDERS = [
  { id:'1', name:'Congo Express',    logo:'🚚', rating:4.8, trips:1240, city:'Kinshasa',   verified:true,  price:'À partir de 2 000 CDF' },
  { id:'2', name:'Kivu Transport',   logo:'🚛', rating:4.6, trips:890,  city:'Goma',       verified:true,  price:'À partir de 5 000 CDF' },
  { id:'3', name:'Lolo Livraison',   logo:'🏍', rating:4.5, trips:2100, city:'Kinshasa',   verified:false, price:'À partir de 1 500 CDF' },
  { id:'4', name:'Katanga Cargo',    logo:'✈',  rating:4.7, trips:340,  city:'Lubumbashi', verified:true,  price:'Sur devis' },
  { id:'5', name:'Moto Rapide KIN',  logo:'🛵', rating:4.4, trips:3200, city:'Kinshasa',   verified:false, price:'À partir de 1 000 CDF' },
  { id:'6', name:'BukoTransit SARL', logo:'🚌', rating:4.9, trips:560,  city:'Bukavu',     verified:true,  price:'À partir de 3 000 CDF' },
]

const STEPS = [
  { n:1, label:'Choisissez le type',    emoji:'📋' },
  { n:2, label:'Adresse départ/arrivée',emoji:'📍' },
  { n:3, label:'Sélectionnez un prestataire', emoji:'🚛' },
  { n:4, label:'Payez via KangaPay',    emoji:'💰' },
]

export default function LogistiquePage() {
  const [activeType, setActiveType] = useState('livraison')

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🚛 Logistique</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Transport & livraison partout en RDC</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#0891B2', color: 'white', boxShadow: '0 2px 8px rgba(8,145,178,0.25)' }}>
          + Proposer un service
        </button>
      </div>

      {/* Service type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {SERVICE_TYPES.map((s) => (
          <button key={s.id} onClick={() => setActiveType(s.id)}
            className="p-4 rounded-xl text-left transition-all"
            style={{
              border:          `1.5px solid ${activeType === s.id ? '#0891B2' : '#E8EEF4'}`,
              backgroundColor: activeType === s.id ? '#E0F7FA' : 'white',
              boxShadow:       activeType === s.id ? '0 2px 12px rgba(8,145,178,0.15)' : '0 1px 4px rgba(12,30,71,0.05)',
            }}>
            <div className="text-2xl mb-2">{s.emoji}</div>
            <p className="text-xs font-semibold" style={{ color: activeType === s.id ? '#0891B2' : '#0C1E47' }}>{s.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8FA4BA' }}>{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Quick booking card */}
      <div className="bg-white rounded-2xl p-5 mb-6"
           style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.06)' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: '#0C1E47' }}>📍 Réserver maintenant</h2>
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🟢</span>
            <input placeholder="Adresse de départ..." readOnly
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔴</span>
            <input placeholder="Adresse d'arrivée..." readOnly
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Date & heure" readOnly
              className="px-3 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
            <select className="px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: '1px solid #D0DBE8', color: '#3D526B' }}>
              <option>Toutes villes</option>
              <option>Kinshasa</option>
              <option>Lubumbashi</option>
              <option>Goma</option>
              <option>Bukavu</option>
            </select>
          </div>
          <button className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0891B2', color: 'white', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}>
            Trouver un prestataire →
          </button>
        </div>
      </div>

      {/* Providers */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-base" style={{ color: '#0C1E47' }}>Prestataires disponibles</h2>
        <span className="text-xs" style={{ color: '#8FA4BA' }}>{PROVIDERS.length} disponibles</span>
      </div>
      <div className="space-y-3 mb-6">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 cursor-pointer"
               style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 style={{ backgroundColor: '#E0F7FA', border: '1px solid #B2EBF2' }}>
              {p.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: '#0C1E47' }}>{p.name}</p>
                {p.verified && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>✓</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs" style={{ color: '#F5A623' }}>★ {p.rating}</span>
                <span className="text-xs" style={{ color: '#8FA4BA' }}>📍 {p.city}</span>
                <span className="text-xs" style={{ color: '#8FA4BA' }}>{p.trips} courses</span>
              </div>
              <p className="text-xs font-medium mt-1" style={{ color: '#0891B2' }}>{p.price}</p>
            </div>
            <button className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#0891B2', color: 'white' }}>
              Réserver
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>Comment ça marche</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STEPS.map((s) => (
          <div key={s.n} className="bg-white rounded-xl p-4 text-center"
               style={{ border: '1px solid #E8EEF4' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                 style={{ backgroundColor: '#E0F7FA', color: '#0891B2' }}>
              {s.n}
            </div>
            <div className="text-xl mb-1">{s.emoji}</div>
            <p className="text-xs font-medium" style={{ color: '#0C1E47' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
