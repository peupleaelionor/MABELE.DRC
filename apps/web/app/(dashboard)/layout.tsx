'use client'
// ─── Dashboard Layout — Dark Premium ─────────────────────────────────────────
// Source: Board 2 — dark sidebar + orange accent + bottom nav
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',  icon: '⊞', label: 'Accueil'       },
  { href: '/immo',       icon: '🏘', label: 'Immobilier'    },
  { href: '/emploi',     icon: '💼', label: 'Emploi'        },
  { href: '/market',     icon: '🛒', label: 'Marché'        },
  { href: '/agri',       icon: '🌾', label: 'AgriTech'      },
  { href: '/logistique', icon: '🚛', label: 'Logistique'    },
  { href: '/finance',    icon: '💰', label: 'KangaPay'      },
  { href: '/outils',     icon: '🧾', label: 'NKISI'         },
  { href: '/data',       icon: '📊', label: 'Congo Data'    },
  { href: '/messages',   icon: '💬', label: 'Messages', badge: 2 },
]

const BOTTOM_NAV = [
  { href: '/dashboard', icon: '⊞',  label: 'Accueil'    },
  { href: '/search',    icon: '🔍', label: 'Chercher'   },
  { href: '/publish',   icon: '+',  label: '',   cta: true },
  { href: '/messages',  icon: '💬', label: 'Messages'   },
  { href: '/profile',   icon: '👤', label: 'Profil'     },
]

const BG   = '#1A1A1A'
const SURF = '#242424'
const ACC  = '#E05C1A'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 w-60"
             style={{ backgroundColor: '#191919', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="w-8 h-8 flex-shrink-0" />
            <span className="font-bold text-white text-lg tracking-wide">MABELE</span>
          </Link>
          <p className="text-xs mt-0.5 ml-10" style={{ color: 'rgba(255,255,255,0.30)' }}>
            🇨🇩 Beta · Kinshasa
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
             style={{ color: 'rgba(255,255,255,0.25)' }}>
            Navigation
          </p>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  color:           active ? ACC : 'rgba(255,255,255,0.55)',
                  backgroundColor: active ? 'rgba(224,92,26,0.12)' : 'transparent',
                  fontWeight:      active ? 600 : 500,
                }}>
                <span className="w-5 text-center text-base">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                        style={{ backgroundColor: ACC, color: 'white' }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User card */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/profile"
            className="flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                 style={{ backgroundColor: ACC, color: 'white' }}>
              J
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Jean-Pierre</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>⭐ Score Trust 850</p>
            </div>
            <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.30)' }}>⚙</span>
          </Link>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header className="lg:hidden sticky top-0 z-30"
              style={{ backgroundColor: '#191919', borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 12px rgba(0,0,0,0.40)' }}>
        <div className="h-14 flex items-center gap-3 px-4">
          <Link href="/dashboard" className="flex-shrink-0">
            <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
          </Link>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            <input type="search" placeholder="Rechercher sur MABELE..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl focus:outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-base">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACC }} />
          </button>
          <Link href="/profile"
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: ACC, color: 'white' }}>
            J
          </Link>
        </div>
      </header>

      {/* ── Desktop Top Bar ── */}
      <div className="hidden lg:flex sticky top-0 z-20 items-center gap-4 px-6 h-14 lg:ml-60"
           style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1 relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>🔍</span>
          <input type="search" placeholder="Rechercher sur MABELE..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/publish"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: ACC, color: 'white', boxShadow: '0 2px 12px rgba(224,92,26,0.35)' }}>
            + Publier une annonce
          </Link>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-base">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACC }} />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-6">
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
           style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 -4px 24px rgba(0,0,0,0.50)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-end justify-around h-16 px-2">
          {BOTTOM_NAV.map((item) => {
            if (item.cta) {
              return (
                <Link key="publish" href="/publish" className="flex flex-col items-center -mt-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                       style={{ backgroundColor: ACC, color: 'white', boxShadow: '0 4px 20px rgba(224,92,26,0.50)' }}>
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
                      style={{ color: active ? ACC : 'rgba(255,255,255,0.40)' }}>
                  {item.label}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: ACC }} />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
