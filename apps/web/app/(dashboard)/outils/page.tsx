'use client'
// ─── NKISI Outils Business — Dark Premium ─────────────────────────────────────
import { useState } from 'react'

const MOD = '#7C3AED'
const ACC = '#E05C1A'

const INVOICES = [
  { id:'1', numero:'FAC-2025-001', client:'SARL Congo Build',     total:'3 500 USD',  status:'PAID',    date:'10 jan.' },
  { id:'2', numero:'FAC-2025-002', client:'Jean Kabila Mutombo',   total:'850 USD',    status:'SENT',    date:'15 jan.' },
  { id:'3', numero:'FAC-2025-003', client:'Hôtel Memling',         total:'12 000 USD', status:'OVERDUE', date:'05 jan.' },
  { id:'4', numero:'FAC-2025-004', client:'Pharmacie Centrale',    total:'2 200 USD',  status:'DRAFT',   date:'20 jan.' },
]

const STATUS_CFG: Record<string, { label: string; bg: string; text: string }> = {
  PAID:    { label: 'Payée',     bg: 'rgba(34,197,94,0.15)',  text: '#22C55E' },
  SENT:    { label: 'Envoyée',   bg: 'rgba(56,189,248,0.15)', text: '#38BDF8' },
  OVERDUE: { label: 'En retard', bg: 'rgba(239,68,68,0.15)',  text: '#EF4444' },
  DRAFT:   { label: 'Brouillon', bg: 'rgba(255,255,255,0.08)',text: 'rgba(255,255,255,0.45)' },
}

export default function OutilsPage() {
  const [tab, setTab] = useState<'factures' | 'devis' | 'nouveau'>('factures')

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-white">🧾 NKISI</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Votre outil de facturation et gestion business
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: MOD, boxShadow: '0 2px 8px rgba(124,58,237,0.30)' }}>
          + Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Factures totales', value: INVOICES.length.toString(), icon: '📄', color: MOD      },
          { label: 'Encaissé',         value: '3 500 USD',                  icon: '✅', color: '#22C55E' },
          { label: 'En attente',       value: '850 USD',                    icon: '⏳', color: ACC       },
          { label: 'En retard',        value: '1',                          icon: '⚠️', color: '#EF4444' },
        ].map((s) => (
          <div key={s.label}
               className="rounded-xl p-4"
               style={{ backgroundColor: '#242424', border: `1px solid ${s.color}25` }}>
            <div className="text-2xl mb-1.5">{s.icon}</div>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'factures', label: '📄 Factures'        },
          { id: 'devis',    label: '📋 Devis'           },
          { id: 'nouveau',  label: '✚ Nouvelle facture' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className="px-4 py-2 text-sm font-medium transition-all -mb-px"
            style={{
              borderBottom: `2px solid ${tab === t.id ? MOD : 'transparent'}`,
              color: tab === t.id ? MOD : 'rgba(255,255,255,0.40)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Factures */}
      {tab === 'factures' && (
        <div className="space-y-3">
          {INVOICES.map((inv) => {
            const s = STATUS_CFG[inv.status]
            return (
              <div key={inv.id}
                   className="rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
                   style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                     style={{ backgroundColor: 'rgba(124,58,237,0.15)' }}>
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{inv.numero}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: s.bg, color: s.text }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {inv.client} · {inv.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: MOD }}>{inv.total}</div>
                  <button className="text-xs mt-1" style={{ color: ACC }}>Voir →</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Devis */}
      {tab === 'devis' && (
        <div className="text-center py-16 rounded-xl"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-5xl mb-4">📋</div>
          <p className="font-semibold text-white mb-2">Aucun devis pour le moment</p>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Créez votre premier devis en quelques secondes
          </p>
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: MOD }}>
            Créer un devis
          </button>
        </div>
      )}

      {/* New Invoice */}
      {tab === 'nouveau' && (
        <div className="rounded-xl p-6"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-base text-white mb-5">Nouvelle facture</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Nom du client</label>
                <input type="text" placeholder="Nom ou entreprise" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5"
                       style={{ color: 'rgba(255,255,255,0.55)' }}>Téléphone</label>
                <input type="text" placeholder="+243 81 234 5678" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2"
                     style={{ color: 'rgba(255,255,255,0.55)' }}>Articles / Services</label>
              <div className="rounded-xl overflow-hidden"
                   style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[11px] font-semibold"
                     style={{ backgroundColor: '#2A2A2A', color: 'rgba(255,255,255,0.40)' }}>
                  <span className="col-span-5">Description</span>
                  <span className="col-span-2 text-center">Qté</span>
                  <span className="col-span-2 text-center">Prix</span>
                  <span className="col-span-2 text-right">Total</span>
                  <span className="col-span-1" />
                </div>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <input className="col-span-5 px-2 py-2 rounded-lg text-xs text-white focus:outline-none"
                           placeholder="Service rendu..." readOnly
                           style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                    <input className="col-span-2 px-2 py-2 rounded-lg text-xs text-center text-white focus:outline-none"
                           placeholder="1" readOnly
                           style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                    <input className="col-span-2 px-2 py-2 rounded-lg text-xs text-center text-white focus:outline-none"
                           placeholder="0 USD" readOnly
                           style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                    <span className="col-span-2 text-right text-xs"
                          style={{ color: 'rgba(255,255,255,0.40)' }}>0 USD</span>
                    <button className="col-span-1 text-xs" style={{ color: '#EF4444' }}>✕</button>
                  </div>
                </div>
                <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button className="text-xs font-medium" style={{ color: MOD }}>+ Ajouter une ligne</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-56 space-y-1.5 text-sm">
                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  <span>Sous-total</span><span>0 USD</span>
                </div>
                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  <span>Taxe (0%)</span><span>0 USD</span>
                </div>
                <div className="flex justify-between font-bold pt-2 text-white"
                     style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>Total</span>
                  <span style={{ color: MOD }}>0 USD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>
                Sauvegarder brouillon
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: MOD }}>
                📤 Envoyer la facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
