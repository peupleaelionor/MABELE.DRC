// ─── Congo Data ───────────────────────────────────────────────────────────────
// Source: Board 2 — white-first, blue module color #1B4FB3
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Congo Data — Données Économiques RDC',
  description: 'Tableaux de bord et données économiques de la République Démocratique du Congo.',
}

const MACRO_DATA = [
  { label: 'PIB 2024',      value: '66,5 Md$',  change: '+6,2%', icon: '📈', positive: true  },
  { label: 'Inflation',     value: '23,4%',      change: '-2,1%', icon: '📊', positive: true  },
  { label: 'Taux BCC',      value: '25%',        change: '0%',    icon: '🏦', positive: false },
  { label: 'USD/CDF',       value: '2 780',      change: '+1,2%', icon: '💱', positive: false },
  { label: 'Population',    value: '112,5M',     change: '+3,1%', icon: '👥', positive: true  },
  { label: 'Mobile money',  value: '67%',        change: '+8,4%', icon: '📱', positive: true  },
]

const SECTORS = [
  { sector: 'Mines & Métaux', share: 62, icon: '⛏', color: '#F5A623' },
  { sector: 'Agriculture',    share: 18, icon: '🌾', color: '#16A34A' },
  { sector: 'Services',       share: 12, icon: '🏢', color: '#1B4FB3' },
  { sector: 'Industrie',      share:  5, icon: '🏭', color: '#0891B2' },
  { sector: 'Autre',          share:  3, icon: '📦', color: '#8FA4BA' },
]

const PROVINCES = [
  { province: 'Haut-Katanga',   pib: '22,4 Md$', population: '4,1M',  mining: true  },
  { province: 'Kinshasa',       pib: '14,8 Md$', population: '17,2M', mining: false },
  { province: 'Lualaba',        pib: '8,9 Md$',  population: '2,0M',  mining: true  },
  { province: 'Nord-Kivu',      pib: '5,2 Md$',  population: '8,1M',  mining: false },
  { province: 'Kongo-Central',  pib: '3,8 Md$',  population: '5,6M',  mining: false },
]

export default function DataPage() {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#0C1E47' }}>📊 Congo Data</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8FA4BA' }}>Sources: BCC, INS, Banque Mondiale</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
             style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          En direct · Janv. 2025
        </div>
      </div>

      {/* Macro Indicators */}
      <h2 className="font-semibold text-base mb-3" style={{ color: '#0C1E47' }}>Indicateurs Macro</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {MACRO_DATA.map((d) => (
          <div key={d.label} className="bg-white rounded-xl p-4 text-center"
               style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
            <div className="text-2xl mb-1">{d.icon}</div>
            <div className="text-base font-bold" style={{ color: '#1B4FB3' }}>{d.value}</div>
            <div className="text-[10px] mt-0.5 mb-1" style={{ color: '#8FA4BA' }}>{d.label}</div>
            <div className="text-[10px] font-semibold"
                 style={{ color: d.positive ? '#16A34A' : '#E02020' }}>
              {d.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sector Breakdown */}
        <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
          <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>Composition du PIB</h2>
          <div className="space-y-4">
            {SECTORS.map((s) => (
              <div key={s.sector}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#3D526B' }}>
                    <span>{s.icon}</span>
                    <span>{s.sector}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.share}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: '#F5F8FC' }}>
                  <div className="h-2 rounded-full transition-all duration-700"
                       style={{ width: `${s.share}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Provinces */}
        <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E8EEF4', boxShadow: '0 1px 6px rgba(12,30,71,0.05)' }}>
          <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>Top Provinces par PIB</h2>
          <div className="space-y-3">
            {PROVINCES.map((p, i) => (
              <div key={p.province} className="flex items-center gap-3 p-3 rounded-xl"
                   style={{ backgroundColor: '#F5F8FC' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: '#EFF6FF', color: '#1B4FB3' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium" style={{ color: '#0C1E47' }}>{p.province}</span>
                    {p.mining && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: '#FFF7E6', color: '#D4881A' }}>⛏ Mining</span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: '#8FA4BA' }}>👥 {p.population}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: '#1B4FB3' }}>{p.pib}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E8EEF4' }}>
        <h2 className="font-semibold text-base mb-4" style={{ color: '#0C1E47' }}>Exporter les données</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '📥 CSV',         fmt: 'csv'  },
            { label: '📊 Excel',       fmt: 'xlsx' },
            { label: '📄 PDF Report',  fmt: 'pdf'  },
            { label: '🔗 API JSON',    fmt: 'api'  },
          ].map((btn) => (
            <button key={btn.fmt}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ border: '1px solid #1B4FB3', color: '#1B4FB3', backgroundColor: 'white' }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
