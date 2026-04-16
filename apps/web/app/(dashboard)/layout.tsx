'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
// Source: Board 2 — navy sidebar + white content + golden CTAs

const NAV = [
  { href: '/dashboard', icon: '🏠', label: 'Tableau de Bord' },
  { href: '/emploi',    icon: '💼', label: 'Emploi'          },
  { href: '/market',    icon: '🛒', label: 'Marché'          },
  { href: '/agri',      icon: '🌾', label: 'AgriTech'        },
  { href: '/finance',   icon: '💰', label: 'KangaPay'        },
  { href: '/outils',    icon: '🧾', label: 'NKISI'           },
  { href: '/data',      icon: '📊', label: 'Congo Data'      },
  { href: '/messages',  icon: '💬', label: 'Messages', badge: 2 },
]

const BOTTOM_NAV = [
  { href: '/dashboard', icon: '🏠', label: 'Accueil'    },
  { href: '/search',    icon: '🔍', label: 'Rechercher' },
  { href: '/publish',   icon: '+',  label: '',    cta: true },
  { href: '/messages',  icon: '💬', label: 'Messages'   },
  { href: '/profile',   icon: '👤', label: 'Profil'     },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F8FC' }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 w-60"
        style={{ backgroundColor: '#0C1E47' }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="w-8 h-8 flex-shrink-0" />
            <span className="font-bold text-white text-lg tracking-wide">MABELE</span>
          </Link>
          <p className="text-xs mt-0.5 ml-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
            🇨🇩 Super-plateforme
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
             style={{ color: 'rgba(255,255,255,0.30)' }}>
            Navigation
          </p>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color:           active ? '#F5A623' : 'rgba(255,255,255,0.65)',
                  backgroundColor: active ? 'rgba(245,166,35,0.15)' : 'transparent',
                  fontWeight:      active ? 600 : 500,
                }}
                onMouseOver={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
                onMouseOut={(e)  => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                        style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User card */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/profile"
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                 style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
              J
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Jean-Pierre</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>⭐ Score Trust 850</p>
            </div>
            <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>⚙</span>
          </Link>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header className="lg:hidden sticky top-0 z-30 bg-white"
              style={{ borderBottom: '1px solid #E8EEF4', boxShadow: '0 1px 4px rgba(12,30,71,0.06)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/dashboard" className="flex-shrink-0">
            <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
          </Link>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input type="search" placeholder="Rechercher sur MABELE..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg"
              style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', outline: 'none', color: '#0C1E47' }} />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: '#F5F8FC' }}>
            <span className="text-base">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <Link href="/profile"
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: '#F5A623', color: '#0C1E47' }}>
            J
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">

        {/* Desktop top bar */}
        <div className="hidden lg:flex sticky top-0 z-20 bg-white items-center gap-4 px-6 h-14"
             style={{ borderBottom: '1px solid #E8EEF4', boxShadow: '0 1px 4px rgba(12,30,71,0.04)' }}>
          <div className="flex-1 relative max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#8FA4BA' }}>🔍</span>
            <input type="search" placeholder="Rechercher sur MABELE..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg"
              style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4', outline: 'none', color: '#0C1E47' }} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/publish"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 2px 8px rgba(245,166,35,0.30)' }}>
              + Publier une Annonce
            </Link>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: '#F5F8FC', border: '1px solid #E8EEF4' }}>
              <span className="text-base">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white"
           style={{ borderTop: '1px solid #E8EEF4', boxShadow: '0 -2px 12px rgba(12,30,71,0.07)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-end justify-around h-16 px-2">
          {BOTTOM_NAV.map((item) => {
            if (item.cta) {
              return (
                <Link key="publish" href="/publish" className="flex flex-col items-center -mt-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                       style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.40)' }}>
                    +
                  </div>
                </Link>
              )
            }
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center gap-0.5 py-1 px-2 flex-1">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium"
                      style={{ color: active ? '#1B4FB3' : '#8FA4BA' }}>
                  {item.label}
                </span>
                {active && <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#1B4FB3' }} />}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
