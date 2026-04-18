'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/immo', label: 'Immobilier', emoji: '🏠', color: '#BB902A' },
  { href: '/emploi', label: 'Emploi', emoji: '💼', color: '#26C6DA' },
  { href: '/market', label: 'Marché', emoji: '🛒', color: '#FF5252' },
  { href: '/agri', label: 'Agri', emoji: '🌾', color: '#00C853' },
  { href: '/outils', label: 'SINK', emoji: '🧾', color: '#B388FF' },
  { href: '/data', label: 'Data', emoji: '📊', color: '#448AFF' },
  { href: '/finance', label: 'KangaPay', emoji: '💰', color: '#FFB300' },
  { href: '/bima', label: 'Bima Santé', emoji: '🏥', color: '#FF4081' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-border">
          <Link href="/">
            <span className="text-2xl font-display font-bold text-gradient-gold">MABELE</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">🇨🇩 Super-plateforme</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Modules
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    style={active ? { backgroundColor: `${item.color}20`, color: item.color } : {}}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.label}</span>
                    {active && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-[10px] bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Jean-Pierre</p>
              <p className="text-xs text-muted-foreground">Particulier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {/* Top bar — mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-glass-dark border-b border-border h-14 flex items-center justify-between px-4">
          <Link href="/">
            <span className="text-xl font-display font-bold text-gradient-gold">MABELE</span>
          </Link>
          <button className="p-2 rounded-[10px] bg-muted text-foreground text-sm">
            👤
          </button>
        </header>

        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Bottom Navigation — mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-[10px] min-w-0 flex-1"
              >
                <span className="text-lg">{item.emoji}</span>
                <span
                  className="text-[10px] font-medium truncate w-full text-center"
                  style={{ color: active ? item.color : '#9090A0' }}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
