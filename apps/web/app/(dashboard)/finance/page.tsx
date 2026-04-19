'use client'
// ─── KangaPay Wallet — Dark Premium ───────────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

const TRANSACTIONS = [
  { id:'1', icon:'💸', label:'Paiement',    amount:-260,    currency:'CDF', date:'Mar 3, 2024',  positive:false },
  { id:'2', icon:'🌾', label:'OEA Agri',    amount:150000,  currency:'CDF', date:'Mar 2, 2024',  positive:true  },
  { id:'3', icon:'🤝', label:'Tontine',     amount:-1000,   currency:'CDF', date:'Mar 1, 2024',  positive:false },
  { id:'4', icon:'💵', label:'Versement',   amount:500,     currency:'CDF', date:'Fév 28, 2024', positive:true  },
  { id:'5', icon:'📤', label:'Transaction', amount:-145,    currency:'CDF', date:'Fév 27, 2024', positive:false },
]

const QUICK = [
  { icon:'💸', label:'Envoyer',    href:'/finance/envoyer'    },
  { icon:'📥', label:'Recevoir',   href:'/finance/recevoir'   },
  { icon:'⬜', label:'Scanner',    href:'/finance/merchant'   },
  { icon:'🤝', label:'Tontine',    href:'/finance/tontine'    },
  { icon:'💹', label:'Épargne',    href:'/finance/epargne'    },
  { icon:'📋', label:'Historique', href:'/finance/historique' },
  { icon:'🏪', label:'Marchands',  href:'/finance/merchant'   },
  { icon:'💳', label:'Services',   href:'/services'           },
]

export default function FinancePage() {
  const [tab, setTab] = useState<'tout'|'envois'|'recus'>('tout')
  const filtered = TRANSACTIONS.filter(t =>
    tab === 'tout' || (tab === 'envois' && !t.positive) || (tab === 'recus' && t.positive)
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>

      {/* Wallet header — dark orange gradient */}
      <div className="px-4 pt-6 pb-16"
           style={{ background: `linear-gradient(135deg, #2A1A0A, #1A0D04)`, borderBottom: '1px solid rgba(224,92,26,0.20)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>KangaPay Wallet</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>JP Mutombo</p>
          </div>
          <button className="text-white/40 text-xl">⋯</button>
        </div>
        <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Solde disponible</p>
        <p className="font-bold text-white" style={{ fontSize:'2.5rem', lineHeight:1 }}>
          1.250.000 <span className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>CDF</span>
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>≈ 245 USD</p>
        <div className="flex gap-3 mt-5">
          <Link href="/finance/envoyer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.40)' }}>
            ✈ Envoyer
          </Link>
          <Link href="/finance/recevoir"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all hover:bg-white/10"
            style={{ borderColor:'rgba(255,255,255,0.20)', color:'white' }}>
            ⬜ Scanner QR
          </Link>
        </div>
      </div>

      {/* Content overlapping */}
      <div className="px-4 -mt-8 pb-6 space-y-4">

        {/* Quick actions */}
        <div className="rounded-2xl p-4"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
            Actions rapides
          </p>
          <div className="grid grid-cols-4 gap-3">
            {QUICK.map(q => (
              <Link key={q.label} href={q.href} className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-105"
                     style={{ backgroundColor: '#2D2D2D', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {q.icon}
                </div>
                <span className="text-[10px] font-medium text-center"
                      style={{ color: 'rgba(255,255,255,0.50)' }}>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl overflow-hidden"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="font-semibold text-sm text-white">Transactions récentes</p>
            <Link href="/finance/historique" className="text-xs font-medium" style={{ color: ACC }}>
              Voir tout →
            </Link>
          </div>

          <div className="flex px-4 gap-1 mb-2">
            {(['tout','envois','recus'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
                style={{
                  backgroundColor: tab === t ? ACC : 'transparent',
                  color: tab === t ? 'white' : 'rgba(255,255,255,0.40)',
                }}>
                {t === 'tout' ? 'Tout' : t === 'envois' ? 'Envois' : 'Reçus'}
              </button>
            ))}
          </div>

          <div>
            {filtered.map((tx, i) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3"
                   style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                     style={{ backgroundColor: '#2D2D2D' }}>
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{tx.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.date}</p>
                </div>
                <p className="text-sm font-bold flex-shrink-0"
                   style={{ color: tx.positive ? '#22C55E' : '#EF4444' }}>
                  {tx.positive ? '+' : ''}{tx.amount.toLocaleString('fr')} {tx.currency}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
