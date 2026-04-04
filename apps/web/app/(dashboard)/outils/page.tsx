'use client'

import { useState } from 'react'

const SAMPLE_INVOICES = [
  { id: '1', numero: 'FAC-2025-001', clientNom: 'SARL Congo Build', total: 3500, devise: 'USD', status: 'PAID', createdAt: '2025-01-10' },
  { id: '2', numero: 'FAC-2025-002', clientNom: 'Jean Kabila Mutombo', total: 850, devise: 'USD', status: 'SENT', createdAt: '2025-01-15' },
  { id: '3', numero: 'FAC-2025-003', clientNom: 'Hôtel Memling', total: 12000, devise: 'USD', status: 'OVERDUE', createdAt: '2025-01-05' },
  { id: '4', numero: 'FAC-2025-004', clientNom: 'Pharmacie Centrale', total: 2200, devise: 'USD', status: 'DRAFT', createdAt: '2025-01-20' },
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PAID: { label: 'Payée', color: '#00C853', bg: '#00C85320' },
  SENT: { label: 'Envoyée', color: '#26C6DA', bg: '#26C6DA20' },
  OVERDUE: { label: 'En retard', color: '#FF5252', bg: '#FF525220' },
  DRAFT: { label: 'Brouillon', color: '#9090A0', bg: '#9090A020' },
  CANCELLED: { label: 'Annulée', color: '#FF4081', bg: '#FF408120' },
}

export default function OutilsPage() {
  const [activeTab, setActiveTab] = useState<'factures' | 'devis' | 'nouveau'>('factures')

  const totalPaid = SAMPLE_INVOICES.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0)
  const totalPending = SAMPLE_INVOICES.filter((i) => i.status === 'SENT').reduce((s, i) => s + i.total, 0)

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          🧾 NKISI
        </h1>
        <p className="text-muted-foreground">Votre outil de facturation et gestion business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Factures totales', value: SAMPLE_INVOICES.length, icon: '📄', color: '#B388FF' },
          { label: 'Encaissé', value: `${totalPaid.toLocaleString()} USD`, icon: '✅', color: '#00C853' },
          { label: 'En attente', value: `${totalPending.toLocaleString()} USD`, icon: '⏳', color: '#FFB300' },
          { label: 'En retard', value: '1', icon: '⚠️', color: '#FF5252' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card-base"
            style={{ borderColor: `${stat.color}30` }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {[
          { id: 'factures', label: '📄 Factures' },
          { id: 'devis', label: '📋 Devis' },
          { id: 'nouveau', label: '✚ Nouvelle facture' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-[#B388FF] text-[#B388FF]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Factures List */}
      {activeTab === 'factures' && (
        <div className="space-y-3">
          {SAMPLE_INVOICES.map((inv) => {
            const s = statusConfig[inv.status]
            return (
              <div key={inv.id} className="card-base card-hover cursor-pointer flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: '#B388FF20' }}
                >
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{inv.numero}</span>
                    <span
                      className="badge text-[10px]"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{inv.clientNom}</p>
                  <p className="text-xs text-muted-foreground">{inv.createdAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: '#B388FF' }}>
                    {inv.total.toLocaleString()} {inv.devise}
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground mt-1">
                    Voir →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Devis placeholder */}
      {activeTab === 'devis' && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-muted-foreground mb-4">Aucun devis pour le moment</p>
          <button
            className="btn-primary"
            style={{ backgroundColor: '#B388FF', color: '#08080C' }}
          >
            Créer un devis
          </button>
        </div>
      )}

      {/* New Invoice Form */}
      {activeTab === 'nouveau' && (
        <div className="card-base p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Nouvelle facture</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nom du client</label>
                <input type="text" placeholder="Nom ou entreprise" className="input-field" readOnly />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Téléphone</label>
                <input type="text" placeholder="+243 81 234 5678" className="input-field" readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-2">Articles / Services</label>
              <div className="border border-border rounded-[10px] overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span className="col-span-5">Description</span>
                  <span className="col-span-2 text-center">Qté</span>
                  <span className="col-span-2 text-center">Prix</span>
                  <span className="col-span-2 text-right">Total</span>
                  <span className="col-span-1" />
                </div>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <input className="col-span-5 input-field text-xs py-2" placeholder="Service rendu..." readOnly />
                    <input className="col-span-2 input-field text-xs py-2 text-center" placeholder="1" readOnly />
                    <input className="col-span-2 input-field text-xs py-2 text-center" placeholder="0 USD" readOnly />
                    <span className="col-span-2 text-right text-xs text-muted-foreground">0 USD</span>
                    <button className="col-span-1 text-red-400 text-sm">✕</button>
                  </div>
                </div>
                <div className="border-t border-border px-4 py-2">
                  <button className="text-xs text-[#B388FF] hover:underline">+ Ajouter une ligne</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span><span>0 USD</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxe (0%)</span><span>0 USD</span>
                </div>
                <div className="flex justify-between font-bold text-foreground border-t border-border pt-1">
                  <span>Total</span><span style={{ color: '#B388FF' }}>0 USD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-ghost flex-1">Sauvegarder brouillon</button>
              <button
                className="btn-primary flex-1"
                style={{ backgroundColor: '#B388FF', color: '#08080C' }}
              >
                📤 Envoyer la facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
