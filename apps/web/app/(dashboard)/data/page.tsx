import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Congo Data — Données Économiques RDC',
  description: 'Tableaux de bord et données économiques de la République Démocratique du Congo.',
}

const MACRO_DATA = [
  { label: 'PIB 2024', value: '66.5 Md$', change: '+6.2%', icon: '📈', positive: true },
  { label: 'Inflation', value: '23.4%', change: '-2.1%', icon: '📊', positive: true },
  { label: 'Taux BCC', value: '25%', change: '0%', icon: '🏦', positive: false },
  { label: 'USD/CDF', value: '2,780', change: '+1.2%', icon: '💱', positive: false },
  { label: 'Population', value: '112.5M', change: '+3.1%', icon: '👥', positive: true },
  { label: 'Mobile money', value: '67%', change: '+8.4%', icon: '📱', positive: true },
]

const SECTOR_DATA = [
  { sector: 'Mines & Métaux', share: 62, icon: '⛏', color: '#BB902A' },
  { sector: 'Agriculture', share: 18, icon: '🌾', color: '#00C853' },
  { sector: 'Services', share: 12, icon: '🏢', color: '#448AFF' },
  { sector: 'Industrie', share: 5, icon: '🏭', color: '#26C6DA' },
  { sector: 'Autre', share: 3, icon: '📦', color: '#9090A0' },
]

const PROVINCES_DATA = [
  { province: 'Haut-Katanga', pib: '22.4 Md$', population: '4.1M', mining: true },
  { province: 'Kinshasa', pib: '14.8 Md$', population: '17.2M', mining: false },
  { province: 'Lualaba', pib: '8.9 Md$', population: '2.0M', mining: true },
  { province: 'Nord-Kivu', pib: '5.2 Md$', population: '8.1M', mining: false },
  { province: 'Kongo-Central', pib: '3.8 Md$', population: '5.6M', mining: false },
]

export default function DataPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          📊 Congo Data
        </h1>
        <p className="text-muted-foreground">
          Données économiques en temps réel — Sources: BCC, INS, Banque Mondiale
        </p>
      </div>

      {/* Last updated */}
      <div className="card-base p-3 mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Dernière mise à jour: Janvier 2025 · Données officielles BCC & INS
      </div>

      {/* Macro Indicators */}
      <h2 className="text-lg font-semibold text-foreground mb-3">Indicateurs Macro</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {MACRO_DATA.map((d) => (
          <div
            key={d.label}
            className="card-base text-center"
            style={{ borderColor: '#448AFF30' }}
          >
            <div className="text-2xl mb-1">{d.icon}</div>
            <div className="text-lg font-bold" style={{ color: '#448AFF' }}>{d.value}</div>
            <div className="text-[10px] text-muted-foreground mb-1">{d.label}</div>
            <div
              className={`text-[10px] font-semibold ${d.positive ? 'text-green-400' : 'text-red-400'}`}
            >
              {d.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sector Breakdown */}
        <div className="card-base">
          <h2 className="text-lg font-semibold text-foreground mb-4">Composition du PIB</h2>
          <div className="space-y-3">
            {SECTOR_DATA.map((s) => (
              <div key={s.sector}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span>{s.icon}</span>
                    <span>{s.sector}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.share}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${s.share}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provinces */}
        <div className="card-base">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Provinces par PIB</h2>
          <div className="space-y-3">
            {PROVINCES_DATA.map((p, i) => (
              <div key={p.province} className="flex items-center gap-3 p-2 rounded-[10px] bg-muted">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: '#448AFF20', color: '#448AFF' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">{p.province}</span>
                    {p.mining && <span className="text-[10px] text-yellow-400">⛏ Mining</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">👥 {p.population}</span>
                </div>
                <span className="text-sm font-bold text-right" style={{ color: '#448AFF' }}>{p.pib}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="card-base p-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">Exporter les données</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-outline text-sm" style={{ borderColor: '#448AFF', color: '#448AFF' }}>
            📥 CSV
          </button>
          <button className="btn-outline text-sm" style={{ borderColor: '#448AFF', color: '#448AFF' }}>
            📊 Excel
          </button>
          <button className="btn-outline text-sm" style={{ borderColor: '#448AFF', color: '#448AFF' }}>
            📄 PDF Report
          </button>
          <button className="btn-outline text-sm" style={{ borderColor: '#448AFF', color: '#448AFF' }}>
            🔗 API JSON
          </button>
        </div>
      </div>
    </div>
  )
}
