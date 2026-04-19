'use client'
// ─── Tontine — Dark Premium ────────────────────────────────────────────────────
import { useState } from 'react'

const ACC = '#E05C1A'

const MY_TONTINES = [
  { id:'1', name:'Tontine Famille Mutombo', members:8,  montantMensuel:'50 USD',  cycle:'Mensuel', prochain:'Jean-Pierre Mutombo', progress:3, total:8,  status:'active' },
  { id:'2', name:'Groupe Amis Lingwala',    members:12, montantMensuel:'100 USD', cycle:'Mensuel', prochain:'Marie K.',            progress:7, total:12, status:'active' },
]

const MEMBERS = [
  { name:'Jean-Pierre M.', avatar:'J', turn:3, paid:true  },
  { name:'Nadine N.',       avatar:'N', turn:1, paid:true  },
  { name:'Marie K.',        avatar:'M', turn:2, paid:false },
  { name:'Paul N.',         avatar:'P', turn:4, paid:true  },
]

export default function TontinePage() {
  const [selected, setSelected] = useState('1')
  const tontine = MY_TONTINES.find(t => t.id === selected)!

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-white">🤝 Tontine</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Épargne collective sécurisée
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: ACC, boxShadow: '0 2px 8px rgba(224,92,26,0.30)' }}>
          + Créer un groupe
        </button>
      </div>

      <h2 className="font-semibold text-sm text-white mb-3">Mes groupes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {MY_TONTINES.map((t) => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className="rounded-xl p-4 text-left transition-all"
            style={{
              backgroundColor: '#242424',
              border: `1.5px solid ${selected === t.id ? ACC : 'rgba(255,255,255,0.08)'}`,
              boxShadow: selected === t.id ? '0 2px 12px rgba(224,92,26,0.20)' : undefined,
            }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
              <span>👥 {t.members} membres</span>
              <span>💰 {t.montantMensuel}/{t.cycle.toLowerCase()}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span>Tour {t.progress}/{t.total}</span>
                <span>Prochain: {t.prochain}</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="h-1.5 rounded-full transition-all"
                     style={{ width: `${(t.progress / t.total) * 100}%`, backgroundColor: ACC }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-5"
           style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="font-semibold text-base text-white mb-4">{tontine.name}</h3>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label:'Montant mensuel', val:tontine.montantMensuel,                                       icon:'💰' },
            { label:'Membres',         val:tontine.members.toString(),                                    icon:'👥' },
            { label:'Pot total',       val:`${parseInt(tontine.montantMensuel) * tontine.members} USD`,  icon:'🏦' },
          ].map((s) => (
            <div key={s.label}
                 className="rounded-xl p-3 text-center"
                 style={{ backgroundColor: '#2D2D2D' }}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="font-bold text-sm text-white">{s.val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-sm text-white mb-3">Membres & Paiements</h4>
        <div className="space-y-2">
          {MEMBERS.map((m) => (
            <div key={m.name}
                 className="flex items-center gap-3 p-3 rounded-xl"
                 style={{ backgroundColor: '#2D2D2D' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                   style={{ backgroundColor: ACC }}>
                {m.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{m.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Tour #{m.turn}</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: m.paid ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color:           m.paid ? '#22C55E'               : '#EF4444',
                    }}>
                {m.paid ? '✓ Payé' : '⏳ En attente'}
              </span>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
          💰 Payer ma cotisation — {tontine.montantMensuel}
        </button>
      </div>
    </div>
  )
}
