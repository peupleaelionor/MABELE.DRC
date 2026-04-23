'use client'
// ─── Orders — Dark Premium ─────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ACC = '#E05C1A'

type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

interface Order {
  id: string
  reference: string
  description: string
  amount: number
  devise: string
  provider: string
  type: string
  status: OrderStatus
  createdAt: string
}

const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: 'rgba(251,191,36,0.15)',  color: '#FBBF24', label: 'En attente'  },
  COMPLETED: { bg: 'rgba(34,197,94,0.15)',   color: '#22C55E', label: 'Complété'    },
  FAILED:    { bg: 'rgba(239,68,68,0.15)',   color: '#EF4444', label: 'Échoué'      },
  CANCELLED: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.40)', label: 'Annulé' },
}

const PROVIDER_ICON: Record<string, string> = {
  ORANGE_MONEY: '🟠',
  AIRTEL_MONEY: '🔴',
  WALLET:       '💳',
  STRIPE:       '💳',
}

// Mock data shown while API loads or if not authenticated
const MOCK_ORDERS: Order[] = [
  { id:'1', reference:'PAY-LB4X2Z-AB12', description:'iPhone 13 Pro — 256GB',    amount:750,  devise:'USD', provider:'ORANGE_MONEY', type:'PURCHASE',             status:'COMPLETED', createdAt:'2024-03-03T10:00:00Z' },
  { id:'2', reference:'PAY-MC9Y3W-CD34', description:'Boost annonce immobilier', amount:15,   devise:'USD', provider:'WALLET',       type:'LISTING_BOOST',        status:'COMPLETED', createdAt:'2024-03-02T14:30:00Z' },
  { id:'3', reference:'PAY-ND7A1V-EF56', description:'Abonnement Premium',        amount:25,   devise:'USD', provider:'AIRTEL_MONEY', type:'PREMIUM_SUBSCRIPTION', status:'PENDING',   createdAt:'2024-03-01T09:15:00Z' },
  { id:'4', reference:'PAY-OE5B8U-GH78', description:'Réservation appartement',  amount:1200, devise:'USD', provider:'ORANGE_MONEY', type:'PURCHASE',             status:'FAILED',    createdAt:'2024-02-28T16:00:00Z' },
]

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | OrderStatus>('all')

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setOrders(d.data)
        else setOrders(MOCK_ORDERS) // fallback to mock for demo
      })
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false))
  }, [])

  const displayed = orders.filter(o => filter === 'all' || o.status === filter)

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="font-bold text-2xl text-white">📦 Mes commandes</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Historique de vos paiements et achats
          </p>
        </div>
        <Link href="/finance"
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ border: `1px solid ${ACC}`, color: ACC }}>
          💳 Wallet
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {([
          ['all',       'Tout'],
          ['COMPLETED', 'Complétés'],
          ['PENDING',   'En attente'],
          ['FAILED',    'Échoués'],
          ['CANCELLED', 'Annulés'],
        ] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              border:          `1px solid ${filter === val ? ACC : 'rgba(255,255,255,0.10)'}`,
              backgroundColor: filter === val ? 'rgba(224,92,26,0.12)' : 'transparent',
              color:           filter === val ? ACC : 'rgba(255,255,255,0.45)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl h-24 animate-pulse"
                 style={{ backgroundColor: '#242424' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 rounded-xl"
             style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-4xl mb-3">📦</div>
          <p className="font-semibold text-white">Aucune commande</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Vos achats apparaîtront ici
          </p>
          <Link href="/market"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: ACC }}>
            Explorer le marché →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(order => {
            const st = STATUS_STYLE[order.status]
            return (
              <div key={order.id} className="rounded-xl p-4"
                   style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                       style={{ backgroundColor: '#2D2D2D' }}>
                    {PROVIDER_ICON[order.provider] ?? '💰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-white text-sm leading-tight truncate">
                        {order.description}
                      </p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {order.reference}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold" style={{ color: ACC }}>
                        {order.amount.toLocaleString('fr')} {order.devise}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA */}
      {!loading && orders.length > 0 && (
        <div className="text-center mt-8">
          <Link href="/market"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border: `1px solid ${ACC}`, color: ACC }}>
            Continuer mes achats →
          </Link>
        </div>
      )}
    </div>
  )
}
