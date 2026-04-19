'use client'
// ─── Épargne — Dark Premium ────────────────────────────────────────────────────
import { useState } from 'react'

const ACC = '#E05C1A'

const GOALS = [
  { id:'1', name:'Voiture Toyota',   target:15000, saved:4200, emoji:'🚗', color:'#1B4FB3', deadline:'Déc. 2025' },
  { id:'2', name:'Loyer 6 mois',     target:6000,  saved:6000, emoji:'🏠', color:'#16A34A', deadline:'Atteint ✓' },
  { id:'3', name:"Fonds d'urgence",  target:2000,  saved:750,  emoji:'🛡', color:ACC,       deadline:'En cours'  },
]

const TRANSACTIONS = [
  { id:'1', desc:'Dépôt automatique', amount:'+50 USD',  date:'14 avr.',  positive:true  },
  { id:'2', desc:'Dépôt automatique', amount:'+50 USD',  date:'14 mars',  positive:true  },
  { id:'3', desc:'Retrait partiel',   amount:'-200 USD', date:'5 mars',   positive:false },
  { id:'4', desc:'Dépôt manuel',      amount:'+100 USD', date:'1 fév.',   positive:true  },
]

export default function EpargnePage() {
  const [showAdd, setShowAdd] = useState(false)
  const totalSaved = GOALS.reduce((s, g) => s + g.saved, 0)

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-white">🏦 Épargne</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>Construisez votre avenir</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: ACC, boxShadow: '0 2px 8px rgba(224,92,26,0.30)' }}>
          + Nouvel objectif
        </button>
      </div>

      <div className="rounded-2xl p-6 mb-6"
           style={{ background: 'linear-gradient(135deg, #2A1A0A, #1A0D04)', border: `1px solid rgba(224,92,26,0.25)`, boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}>
        <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.50)' }}>Épargne totale</p>
        <p className="text-3xl font-bold text-white">
          {totalSaved.toLocaleString('fr-FR')} <span className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>USD</span>
        </p>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.40)' }}>Réparti sur {GOALS.length} objectifs</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: ACC, boxShadow: '0 2px 8px rgba(224,92,26,0.25)' }}>
            + Déposer
          </button>
          <button className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.70)' }}>
            Retirer
          </button>
        </div>
      </div>

      <h2 className="font-semibold text-sm text-white mb-3">Mes objectifs</h2>
      <div className="space-y-3 mb-6">
        {GOALS.map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
          const done = pct === 100
          return (
            <div key={goal.id} className="rounded-xl p-4"
                 style={{
                   backgroundColor: '#242424',
                   border: `1px solid ${done ? 'rgba(34,197,94,0.20)' : 'rgba(255,255,255,0.06)'}`,
                 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ backgroundColor: `${goal.color}20` }}>
                  {goal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{goal.name}</p>
                    {done && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>✓ Atteint</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {goal.saved.toLocaleString('fr-FR')} / {goal.target.toLocaleString('fr-FR')} USD · {goal.deadline}
                  </p>
                </div>
                <p className="text-sm font-bold flex-shrink-0" style={{ color: goal.color }}>{pct}%</p>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="h-2 rounded-full transition-all duration-700"
                     style={{ width: `${pct}%`, backgroundColor: goal.color }} />
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="font-semibold text-sm text-white mb-3">Historique</h2>
      <div className="rounded-2xl overflow-hidden"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TRANSACTIONS.map((tx, i) => (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3"
               style={{ borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: tx.positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }}>
              {tx.positive ? '📥' : '📤'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{tx.desc}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.date}</p>
            </div>
            <p className="text-sm font-bold"
               style={{ color: tx.positive ? '#22C55E' : '#EF4444' }}>
              {tx.amount}
            </p>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(0,0,0,0.60)' }}
             onClick={() => setShowAdd(false)}>
          <div className="rounded-2xl p-6 w-full max-w-sm"
               style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.50)' }}
               onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-base text-white mb-4">Nouvel objectif d'épargne</h3>
            <div className="space-y-3">
              {[
                { label:"Nom de l'objectif", placeholder:'ex: Voiture, Voyage, Logement...' },
                { label:'Montant cible (USD)', placeholder:'0' },
                { label:'Dépôt automatique mensuel', placeholder:'50 USD/mois' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-medium mb-1.5"
                         style={{ color: 'rgba(255,255,255,0.50)' }}>{f.label}</label>
                  <input placeholder={f.placeholder} readOnly
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                    style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)' }}>
                Annuler
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: ACC }}>
                Créer →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
