'use client'
// ─── KangaPay — Tontine ───────────────────────────────────────────────────────
// Source: Board 3 — Tontine digitale, épargne collective
import { useState } from 'react'

const MY_TONTINES = [
  {
    id: '1',
    name: 'Tontine Famille Mutombo',
    members: 8,
    montantMensuel: '50 USD',
    cycle: 'Mensuel',
    prochain: 'Jean-Pierre Mutombo',
    progress: 3,
    total: 8,
    status: 'active',
  },
  {
    id: '2',
    name: 'Groupe Amis Lingwala',
    members: 12,
    montantMensuel: '100 USD',
    cycle: 'Mensuel',
    prochain: 'Marie K.',
    progress: 7,
    total: 12,
    status: 'active',
  },
]

const MEMBERS = [
  { name: 'Jean-Pierre M.', avatar: 'J', turn: 3, paid: true  },
  { name: 'Nadine N.',       avatar: 'N', turn: 1, paid: true  },
  { name: 'Marie K.',        avatar: 'M', turn: 2, paid: false },
  { name: 'Paul N.',         avatar: 'P', turn: 4, paid: true  },
]

export default function TontinePage() {
  const [selected, setSelected] = useState('1')
  const tontine = MY_TONTINES.find(t => t.id === selected)!

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>🤝 Tontine</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Épargne collective sécurisée</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 2px 8px rgba(245,166,35,0.30)' }}>
          + Créer un groupe
        </button>
      </div>

      {/* My Groups */}
      <h2 className="font-semibold text-sm mb-3" style={{ color: '#0C1E47' }}>Mes groupes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {MY_TONTINES.map((t) => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className="bg-white rounded-xl p-4 text-left transition-all"
            style={{
              border: `1.5px solid ${selected === t.id ? '#F5A623' : '#E8EEF4'}`,
              boxShadow: selected === t.id ? '0 2px 12px rgba(245,166,35,0.20)' : '0 1px 4px rgba(12,30,71,0.05)',
            }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ color: '#0C1E47' }}>{t.name}</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>Active</span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#8FA4BA' }}>
              <span>👥 {t.members} membres</span>
              <span>💰 {t.montantMensuel}/{t.cycle.toLowerCase()}</span>
            </div>
            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: '#8FA4BA' }}>
                <span>Tour {t.progress}/{t.total}</span>
                <span>Prochain: {t.prochain}</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F5F8FC' }}>
                <div className="h-1.5 rounded-full transition-all"
                     style={{ width: `${(t.progress / t.total) * 100}%`, backgroundColor: '#F5A623' }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected tontine detail */}
      <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 8px rgba(12,30,71,0.07)' }}>
        <h3 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>{tontine.name}</h3>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Montant mensuel', val: tontine.montantMensuel, icon: '💰' },
            { label: 'Membres',         val: tontine.members.toString(),         icon: '👥' },
            { label: 'Pot total',       val: `${parseInt(tontine.montantMensuel) * tontine.members} USD`, icon: '🏦' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center"
                 style={{ backgroundColor: '#F5F8FC' }}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="font-bold text-sm" style={{ color: '#0C1E47' }}>{s.val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8FA4BA' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Members list */}
        <h4 className="font-semibold text-sm mb-3" style={{ color: '#0C1E47' }}>Membres & Paiements</h4>
        <div className="space-y-2">
          {MEMBERS.map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl"
                 style={{ backgroundColor: '#F5F8FC' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                   style={{ backgroundColor: '#1B4FB3', color: 'white' }}>
                {m.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#0C1E47' }}>{m.name}</p>
                <p className="text-xs" style={{ color: '#8FA4BA' }}>Tour #{m.turn}</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: m.paid ? '#DCFCE7' : '#FEE2E2',
                      color:           m.paid ? '#16A34A' : '#DC2626',
                    }}>
                {m.paid ? '✓ Payé' : '⏳ En attente'}
              </span>
            </div>
          ))}
        </div>

        {/* Pay CTA */}
        <button className="mt-5 w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.30)' }}>
          💰 Payer ma cotisation — {tontine.montantMensuel}
        </button>
      </div>
    </div>
  )
}
