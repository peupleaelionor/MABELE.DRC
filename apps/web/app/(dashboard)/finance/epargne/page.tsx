'use client'
// ─── KangaPay — Épargne ───────────────────────────────────────────────────────
// Source: Board 3 — Épargne personnelle, objectifs
import { useState } from 'react'

const GOALS = [
  { id:'1', name:'Voiture Toyota',      target:15000, saved:4200,  emoji:'🚗', color:'#1B4FB3', deadline:'Déc. 2025' },
  { id:'2', name:'Loyer 6 mois',        target:6000,  saved:6000,  emoji:'🏠', color:'#16A34A', deadline:'Atteint ✓'  },
  { id:'3', name:'Fonds d\'urgence',    target:2000,  saved:750,   emoji:'🛡', color:'#F5A623', deadline:'En cours'   },
]

const TRANSACTIONS = [
  { id:'1', desc:'Dépôt automatique',     amount:'+50 USD',    date:'14 avr.',  positive:true  },
  { id:'2', desc:'Dépôt automatique',     amount:'+50 USD',    date:'14 mars',  positive:true  },
  { id:'3', desc:'Retrait partiel',        amount:'-200 USD',   date:'5 mars',   positive:false },
  { id:'4', desc:'Dépôt manuel',          amount:'+100 USD',   date:'1 fév.',   positive:true  },
]

export default function EpargnePage() {
  const [showAdd, setShowAdd] = useState(false)
  const totalSaved = GOALS.reduce((s, g) => s + g.saved, 0)

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🏦 Épargne</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Construisez votre avenir</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 2px 8px rgba(245,166,35,0.30)' }}>
          + Nouvel objectif
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-2xl p-6 mb-6 text-white"
           style={{ background: 'linear-gradient(135deg, #1A3260, #0C1E47)', boxShadow: '0 4px 20px rgba(12,30,71,0.18)' }}>
        <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Épargne totale</p>
        <p className="text-3xl font-bold">{totalSaved.toLocaleString('fr-FR')} <span className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>USD</span></p>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.50)' }}>Réparti sur {GOALS.length} objectifs</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
            + Déposer
          </button>
          <button className="flex-1 py-2 rounded-lg text-sm font-semibold border"
                  style={{ borderColor: 'rgba(255,255,255,0.30)', color: 'white' }}>
            Retirer
          </button>
        </div>
      </div>

      {/* Goals */}
      <h2 className="font-semibold text-base mb-3" style={{ color: '#0C1E47' }}>Mes objectifs</h2>
      <div className="space-y-3 mb-6">
        {GOALS.map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
          const done = pct === 100
          return (
            <div key={goal.id} className="bg-white rounded-xl p-4"
                 style={{ border: `1px solid ${done ? '#16A34A30' : '#E8EEF4'}`, boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ backgroundColor: `${goal.color}15` }}>
                  {goal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: '#0C1E47' }}>{goal.name}</p>
                    {done && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>✓ Atteint</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#8FA4BA' }}>
                    {goal.saved.toLocaleString('fr-FR')} / {goal.target.toLocaleString('fr-FR')} USD · {goal.deadline}
                  </p>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: goal.color }}>{pct}%</p>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F5F8FC' }}>
                <div className="h-2 rounded-full transition-all duration-700"
                     style={{ width: `${pct}%`, backgroundColor: goal.color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent transactions */}
      <h2 className="font-semibold text-base mb-3" style={{ color: '#0C1E47' }}>Historique</h2>
      <div className="bg-white rounded-xl divide-y" style={{ border: '1px solid #E8EEF4', divideColor: '#F5F8FC' }}>
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: tx.positive ? '#DCFCE7' : '#FEE2E2' }}>
              {tx.positive ? '📥' : '📤'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#0C1E47' }}>{tx.desc}</p>
              <p className="text-xs" style={{ color: '#8FA4BA' }}>{tx.date}</p>
            </div>
            <p className="text-sm font-bold"
               style={{ color: tx.positive ? '#16A34A' : '#DC2626' }}>
              {tx.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Add Goal Modal overlay */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(12,30,71,0.40)' }}
             onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm"
               style={{ border: '1px solid #E8EEF4', boxShadow: '0 8px 40px rgba(12,30,71,0.20)' }}
               onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>Nouvel objectif d'épargne</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#3D526B' }}>Nom de l'objectif</label>
                <input placeholder="ex: Voiture, Voyage, Logement..." readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#3D526B' }}>Montant cible (USD)</label>
                <input placeholder="0" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#3D526B' }}>Dépôt automatique mensuel</label>
                <input placeholder="50 USD/mois" readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1px solid #D0DBE8', color: '#0C1E47' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #E8EEF4', color: '#3D526B', backgroundColor: 'white' }}>
                Annuler
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
                Créer →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
