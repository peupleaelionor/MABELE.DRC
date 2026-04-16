'use client'
// ─── NKISI — Outils Business ──────────────────────────────────────────────────
// Source: Board 2 — white-first, purple module color #7C3AED
import { useState } from 'react'

const INVOICES = [
  { id:'1', numero:'FAC-2025-001', client:'SARL Congo Build',       total:'3 500 USD', status:'PAID',    date:'10 jan.' },
  { id:'2', numero:'FAC-2025-002', client:'Jean Kabila Mutombo',     total:'850 USD',   status:'SENT',    date:'15 jan.' },
  { id:'3', numero:'FAC-2025-003', client:'Hôtel Memling',           total:'12 000 USD',status:'OVERDUE', date:'05 jan.' },
  { id:'4', numero:'FAC-2025-004', client:'Pharmacie Centrale',      total:'2 200 USD', status:'DRAFT',   date:'20 jan.' },
]

const STATUS_CFG: Record<string, { label: string; bg: string; text: string }> = {
  PAID:    { label: 'Payée',     bg: '#DCFCE7', text: '#16A34A' },
  SENT:    { label: 'Envoyée',   bg: '#EFF6FF', text: '#1B4FB3' },
  OVERDUE: { label: 'En retard', bg: '#FEE2E2', text: '#DC2626' },
  DRAFT:   { label: 'Brouillon', bg: '#F5F8FC', text: '#8FA4BA' },
}

export default function OutilsPage() {
  const [tab, setTab] = useState<'factures' | 'devis' | 'nouveau'>('factures')

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🧾 NKISI</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Votre outil de facturation et gestion business</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#7C3AED', color: 'white', boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}>
          + Nouvelle facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Factures totales', value: INVOICES.length.toString(), icon: '📄', color: '#7C3AED' },
          { label: 'Encaissé',         value: '3 500 USD',                 icon: '✅', color: '#16A34A' },
          { label: 'En attente',       value: '850 USD',                   icon: '⏳', color: '#F5A623' },
          { label: 'En retard',        value: '1',                         icon: '⚠️', color: '#DC2626' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4"
               style={{ border: `1px solid ${s.color}25`, boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
            <div className="text-2xl mb-1.5">{s.icon}</div>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#8FA4BA' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: '2px solid #E8EEF4' }}>
        {[
          { id: 'factures', label: '📄 Factures'         },
          { id: 'devis',    label: '📋 Devis'            },
          { id: 'nouveau',  label: '✚ Nouvelle facture'  },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className="px-4 py-2 text-sm font-medium transition-all -mb-0.5"
            style={{
              borderBottom: `2px solid ${tab === t.id ? '#7C3AED' : 'transparent'}`,
              color:         tab === t.id ? '#7C3AED' : '#8FA4BA',
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
              <div key={inv.id} className="bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
                   style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                     style={{ backgroundColor: '#F3EDFD' }}>
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: '#0C1E47' }}>{inv.numero}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: s.bg, color: s.text }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#8FA4BA' }}>{inv.client} · {inv.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: '#7C3AED' }}>{inv.total}</div>
                  <button className="text-xs mt-1" style={{ color: '#1B4FB3' }}>Voir →</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Devis */}
      {tab === 'devis' && (
        <div className="text-center py-16 bg-white rounded-xl" style={{ border: '1px solid #E8EEF4' }}>
          <div className="text-5xl mb-4">📋</div>
          <p className="font-semibold mb-2" style={{ color: '#0C1E47' }}>Aucun devis pour le moment</p>
          <p className="text-sm mb-6" style={{ color: '#8FA4BA' }}>Créez votre premier devis en quelques secondes</p>
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: '#7C3AED', color: 'white' }}>
            Créer un devis
          </button>
        </div>
      )}

      {/* New Invoice */}
      {tab === 'nouveau' && (
        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E8EEF4' }}>
          <h2 className="font-semibold text-base mb-5" style={{ color: '#0C1E47' }}>Nouvelle facture</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#3D526B' }}>Nom du client</label>
                <input type="text" placeholder="Nom ou entreprise" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#3D526B' }}>Téléphone</label>
                <input type="text" placeholder="+243 81 234 5678" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
              </div>
            </div>

            {/* Line items */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#3D526B' }}>Articles / Services</label>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8EEF4' }}>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[11px] font-semibold"
                     style={{ backgroundColor: '#F5F8FC', color: '#8FA4BA' }}>
                  <span className="col-span-5">Description</span>
                  <span className="col-span-2 text-center">Qté</span>
                  <span className="col-span-2 text-center">Prix</span>
                  <span className="col-span-2 text-right">Total</span>
                  <span className="col-span-1" />
                </div>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <input className="col-span-5 px-2 py-2 rounded-lg text-xs focus:outline-none" placeholder="Service rendu..." readOnly
                           style={{ border: '1px solid #E8EEF4', color: '#0C1E47' }} />
                    <input className="col-span-2 px-2 py-2 rounded-lg text-xs text-center focus:outline-none" placeholder="1" readOnly
                           style={{ border: '1px solid #E8EEF4', color: '#0C1E47' }} />
                    <input className="col-span-2 px-2 py-2 rounded-lg text-xs text-center focus:outline-none" placeholder="0 USD" readOnly
                           style={{ border: '1px solid #E8EEF4', color: '#0C1E47' }} />
                    <span className="col-span-2 text-right text-xs" style={{ color: '#8FA4BA' }}>0 USD</span>
                    <button className="col-span-1 text-xs" style={{ color: '#DC2626' }}>✕</button>
                  </div>
                </div>
                <div className="px-4 py-2" style={{ borderTop: '1px solid #E8EEF4' }}>
                  <button className="text-xs font-medium" style={{ color: '#7C3AED' }}>+ Ajouter une ligne</button>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="w-56 space-y-1.5 text-sm">
                <div className="flex justify-between" style={{ color: '#8FA4BA' }}>
                  <span>Sous-total</span><span>0 USD</span>
                </div>
                <div className="flex justify-between" style={{ color: '#8FA4BA' }}>
                  <span>Taxe (0%)</span><span>0 USD</span>
                </div>
                <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #E8EEF4', color: '#0C1E47' }}>
                  <span>Total</span>
                  <span style={{ color: '#7C3AED' }}>0 USD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ border: '1px solid #E8EEF4', color: '#3D526B', backgroundColor: 'white' }}>
                Sauvegarder brouillon
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: '#7C3AED', color: 'white' }}>
                📤 Envoyer la facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
