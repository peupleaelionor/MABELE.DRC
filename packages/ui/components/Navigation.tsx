// ─── MABELE Navigation Components ─────────────────────────────────────────────
// Source: Board 4 — Top Navigation · Bottom Navigation · Sidebar
// Board 2 — Dashboard Layout

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Top Navigation (public landing) ──────────────────────────────────────────

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="MABELE" className="h-9" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/"        className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Accueil</Link>
          <Link href="#services" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Solutions</Link>
          <Link href="/about"   className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">À Propos</Link>
          <Link href="/contact" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-2">
          <Link href="/login"    className="btn-ghost text-sm hidden sm:inline-flex">Se connecter</Link>
          <Link href="/register" className="btn-primary text-sm">Créer mon compte</Link>
        </div>
      </div>
    </nav>
  )
}

// ── Dashboard Sidebar (desktop) ───────────────────────────────────────────────

const SIDEBAR_NAV = [
  { href: '/dashboard', icon: '🏠', label: 'Tableau de Bord' },
  { href: '/emploi',    icon: '💼', label: 'Emploi' },
  { href: '/market',    icon: '🛒', label: 'Marché' },
  { href: '/logistique',icon: '🚚', label: 'Logistique' },
  { href: '/agri',      icon: '🌾', label: 'AgriTech' },
  { href: '/finance',   icon: '💰', label: 'KangaPay' },
  { href: '/messages',  icon: '💬', label: 'Messages', badge: 3 },
  { href: '/profile',   icon: '👤', label: 'Mon Profil' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-navy fixed top-0 left-0 h-full z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
          <span
            className="font-bold text-lg text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            MABELE
          </span>
        </Link>
        <p className="text-white/40 text-[11px] mt-0.5 ml-10">🇨🇩 Super-plateforme</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        {SIDEBAR_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : ''}`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-gold text-gold-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User card at bottom */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-sm font-bold text-navy flex-shrink-0">
            J
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Jean-Pierre</p>
            <p className="text-white/40 text-xs">Score Trust 850</p>
          </div>
          <button className="text-white/40 hover:text-white ml-auto">⚙</button>
        </div>
      </div>
    </aside>
  )
}

// ── Dashboard Top Bar (mobile + desktop content header) ───────────────────────

interface DashboardTopBarProps {
  title?:   string
  showSearch?: boolean
}

export function DashboardTopBar({ title, showSearch = false }: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border shadow-xs">
      <div className="h-14 flex items-center gap-3 px-4">
        {/* Mobile: logo */}
        <Link href="/dashboard" className="lg:hidden flex-shrink-0">
          <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
        </Link>

        {/* Title or search */}
        {title && !showSearch && (
          <h1 className="flex-1 font-semibold text-text-primary text-base">{title}</h1>
        )}
        {showSearch && (
          <div className="flex-1 mx-2">
            <input
              type="search"
              placeholder="Rechercher sur MABELE..."
              className="input h-9 text-sm bg-bg-subtle border-border-light pl-8"
            />
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/publish" className="btn-primary text-xs py-2 px-3 hidden sm:inline-flex">
            + Publier
          </Link>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-subtle">
            <span className="text-base">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error border-2 border-white" />
          </button>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-sm font-bold text-navy">
            J
          </Link>
        </div>
      </div>
    </header>
  )
}

// ── Bottom Navigation (mobile) ────────────────────────────────────────────────

const BOTTOM_NAV = [
  { href: '/dashboard', icon: '🏠', label: 'Accueil'    },
  { href: '/search',    icon: '🔍', label: 'Rechercher' },
  null, // center CTA slot
  { href: '/messages',  icon: '💬', label: 'Messages'   },
  { href: '/profile',   icon: '👤', label: 'Profil'     },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-nav safe-bottom">
      <div className="flex items-end justify-around h-16 px-2">
        {BOTTOM_NAV.map((item, i) => {
          if (item === null) {
            // Center publish CTA
            return (
              <Link
                key="publish"
                href="/publish"
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-gold shadow-gold flex items-center justify-center text-navy text-2xl font-bold animate-pulse-ring">
                  +
                </div>
              </Link>
            )
          }

          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-2 flex-1"
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? '#1B4FB3' : '#8FA4BA' }}
              >
                {item.label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
