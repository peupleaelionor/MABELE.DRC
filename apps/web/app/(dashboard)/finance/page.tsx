'use client'

import { useState } from 'react'

const SAMPLE_TONTINES = [
  {
    id: '1',
    nom: 'Groupe Lingala Business',
    montant: 100,
    devise: 'USD',
    frequence: 'MENSUEL',
    membres: 10,
    maxMembres: 12,
    monTour: 3,
    score: 98,
  },
  {
    id: '2',
    nom: 'Tontine Femmes Entrepreneurs',
    montant: 50,
    devise: 'USD',
    frequence: 'HEBDOMADAIRE',
    membres: 8,
    maxMembres: 10,
    monTour: null,
    score: 100,
  },
]

const SAMPLE_TRANSACTIONS = [
  { id: '1', type: 'received', label: 'Tontine Lingala Business', amount: 1000, devise: 'USD', date: '2025-01-15', via: 'Airtel Money' },
  { id: '2', type: 'sent', label: 'Cotisation mensuelle', amount: 100, devise: 'USD', date: '2025-01-10', via: 'Airtel Money' },
  { id: '3', type: 'received', label: 'Remboursement client', amount: 250, devise: 'USD', date: '2025-01-08', via: 'M-Pesa' },
  { id: '4', type: 'sent', label: 'Loyer Gombe', amount: 1200, devise: 'USD', date: '2025-01-05', via: 'Orange Money' },
]

const MOBILE_MONEY = [
  { name: 'Airtel Money', emoji: '🔴', color: '#FF5252', balanceUSD: 45230 / 2780 },
  { name: 'M-Pesa', emoji: '🟢', color: '#00C853', balanceUSD: 12850 / 2780 },
  { name: 'Orange Money', emoji: '🟠', color: '#FFB300', balanceUSD: 8400 / 2780 },
]

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'tontine' | 'transactions'>('wallet')

  const totalBalance = MOBILE_MONEY.reduce((s, m) => s + m.balanceUSD, 0)

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          💰 KangaPay
        </h1>
        <p className="text-muted-foreground">Mobile Money · Tontines · Paiements</p>
      </div>

      {/* Balance Card */}
      <div
        className="rounded-[24px] p-6 mb-6"
        style={{
          background: 'linear-gradient(135deg, #FFB300, #FF8F00)',
        }}
      >
        <p className="text-sm font-medium text-yellow-900 mb-1">Solde total</p>
        <div className="text-4xl font-display font-bold text-yellow-900 mb-1">
          {totalBalance.toFixed(2)} USD
        </div>
        <p className="text-sm text-yellow-800">≈ {(totalBalance * 2780).toLocaleString('fr-FR')} CDF</p>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2 rounded-[10px] text-sm font-semibold bg-yellow-900/20 text-yellow-900 hover:bg-yellow-900/30 transition-all">
            📤 Envoyer
          </button>
          <button className="flex-1 py-2 rounded-[10px] text-sm font-semibold bg-yellow-900/20 text-yellow-900 hover:bg-yellow-900/30 transition-all">
            📥 Recevoir
          </button>
          <button className="flex-1 py-2 rounded-[10px] text-sm font-semibold bg-yellow-900/20 text-yellow-900 hover:bg-yellow-900/30 transition-all">
            📱 QR Code
          </button>
        </div>
      </div>

      {/* Mobile Money Accounts */}
      <h2 className="text-sm font-semibold text-foreground mb-3">Mes comptes Mobile Money</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {MOBILE_MONEY.map((acc) => (
          <div key={acc.name} className="card-base flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${acc.color}20` }}
            >
              {acc.emoji}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{acc.name}</p>
              <p className="text-sm font-bold" style={{ color: acc.color }}>
                {acc.balanceUSD.toFixed(2)} USD
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {[
          { id: 'wallet', label: '💳 Portefeuille' },
          { id: 'tontine', label: '🤝 Tontines' },
          { id: 'transactions', label: '📋 Historique' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-[#FFB300] text-[#FFB300]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Payer une facture', emoji: '🧾', color: '#B388FF' },
            { label: 'Recharger', emoji: '⚡', color: '#FFB300' },
            { label: 'Retirer', emoji: '💵', color: '#00C853' },
            { label: 'Payer marchand', emoji: '🏪', color: '#26C6DA' },
          ].map((action) => (
            <button
              key={action.label}
              className="card-base card-hover p-4 text-center cursor-pointer"
              style={{ borderColor: `${action.color}30` }}
            >
              <div className="text-3xl mb-2">{action.emoji}</div>
              <div className="text-xs font-medium text-foreground">{action.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Tontine Tab */}
      {activeTab === 'tontine' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Mes tontines</h3>
            <button
              className="btn-primary text-xs px-4 py-2"
              style={{ backgroundColor: '#FFB300', color: '#08080C' }}
            >
              + Rejoindre / Créer
            </button>
          </div>
          <div className="space-y-4">
            {SAMPLE_TONTINES.map((t) => (
              <div key={t.id} className="card-base">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{t.nom}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t.frequence} · {t.membres}/{t.maxMembres} membres
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: '#FFB300' }}>
                      {t.montant} {t.devise}
                    </div>
                    <div className="text-xs text-muted-foreground">/ cotisation</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Score de confiance:</span>
                    <span className="badge bg-green-500/20 text-green-400 text-xs">{t.score}/100</span>
                  </div>
                  {t.monTour && (
                    <span className="badge text-xs" style={{ backgroundColor: '#FFB30020', color: '#FFB300' }}>
                      🎯 Tour #{t.monTour}
                    </span>
                  )}
                </div>

                <div className="mt-3 w-full bg-muted rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(t.membres / t.maxMembres) * 100}%`, backgroundColor: '#FFB300' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {SAMPLE_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="card-base flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  backgroundColor: tx.type === 'received' ? '#00C85320' : '#FF525220',
                }}
              >
                {tx.type === 'received' ? '📥' : '📤'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{tx.label}</p>
                <p className="text-xs text-muted-foreground">{tx.date} · {tx.via}</p>
              </div>
              <div
                className="text-sm font-bold flex-shrink-0"
                style={{ color: tx.type === 'received' ? '#00C853' : '#FF5252' }}
              >
                {tx.type === 'received' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.devise}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
