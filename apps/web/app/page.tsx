// ─── MABELE Landing Page ──────────────────────────────────────────────────────
// Source: Board 1 — Web App Overview / Landing
// White-first · Royal Blue headline · Golden Yellow CTAs
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MABELE — Tout pour chercher, vendre, travailler et payer en RDC',
  description: 'La super-plateforme digitale pour 112 millions de Congolais. Immobilier, Emploi, Marché, AgriTech, Finance et plus.',
}

const SERVICES = [
  { icon: '🏠', label: 'Immobilier',   href: '/immo',      desc: 'Achetez, vendez ou louez partout en RDC' },
  { icon: '💼', label: 'Emploi',       href: '/emploi',    desc: "Des milliers d'offres à travers le pays" },
  { icon: '🛒', label: 'Marché',       href: '/market',    desc: 'Petites annonces et produits divers' },
  { icon: '💰', label: 'KangaPay',     href: '/finance',   desc: 'Paiements mobiles, tontines, transferts' },
  { icon: '🌾', label: 'Agriculture',  href: '/agri',      desc: 'Producteurs et acheteurs agricoles' },
  { icon: '🧾', label: 'NKISI',        href: '/outils',    desc: 'Factures, devis et comptabilité' },
]

const TRUST_FEATURES = [
  { icon: '🛡', title: 'Identité Validée',    desc: 'Profils vérifiés et badgés pour chaque utilisateur.' },
  { icon: '🔒', title: 'Paiement Sécurisé',   desc: 'Toutes les transactions passent par KangaPay.' },
  { icon: '📱', title: 'KangaPay mobile',      desc: 'Payez et recevez de l\'argent depuis votre téléphone.' },
]

const STATS = [
  { value: '112M', label: 'Congolais', sub: 'à connecter' },
  { value: '26',   label: 'Provinces', sub: 'couvertes' },
  { value: '8',    label: 'Modules',   sub: 'intégrés' },
  { value: '100%', label: 'Mobile',    sub: 'Money compatible' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-xs" style={{ borderColor: '#D0DBE8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="MABELE" className="h-9" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/',        label: 'Accueil'   },
              { href: '#services',label: 'Solutions'  },
              { href: '/about',   label: 'À Propos'  },
              { href: '/contact', label: 'Contact'   },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: '#3D526B' }}
                onMouseOver={(e) => ((e.target as HTMLElement).style.color = '#1B4FB3')}
                onMouseOut={(e) =>  ((e.target as HTMLElement).style.color = '#3D526B')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#3D526B' }}
            >
              Se connecter
            </Link>
            <Link href="/register"
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-blue transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.30)' }}
            >
              Créer mon compte
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle bg decoration */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(circle, #1B4FB3, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

            {/* Left: copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border"
                   style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1B4FB3' }}>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Beta · Kinshasa, RDC 🇨🇩
              </div>

              <h1 className="font-display font-bold leading-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#0C1E47' }}>
                Tout pour chercher, vendre, travailler et payer en RDC.
              </h1>

              <p className="text-lg mb-3" style={{ color: '#3D526B' }}>
                L'application qui connecte toute la RDC.
              </p>
              <p className="text-base mb-8" style={{ color: '#8FA4BA' }}>
                Immobilier, emploi, marché, agriculture, finance — une seule plateforme
                pour <strong style={{ color: '#0C1E47' }}>112 millions de Congolais</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 20px rgba(245,166,35,0.35)' }}
                >
                  🚀 Créer mon compte
                </Link>
                <Link href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold border transition-all hover:opacity-90"
                  style={{ borderColor: '#1B4FB3', color: '#1B4FB3' }}
                >
                  Se connecter →
                </Link>
              </div>

              {/* App store badges (placeholder) */}
              <div className="flex gap-3">
                {[
                  { store: '🍎 App Store', sub: 'Disponible sur' },
                  { store: '🤖 Google Play', sub: 'Télécharger sur' },
                ].map((b) => (
                  <button key={b.store}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white opacity-60 cursor-not-allowed text-left"
                    style={{ borderColor: '#D0DBE8' }}
                    disabled
                  >
                    <span className="text-xl">{b.store.split(' ')[0]}</span>
                    <div>
                      <p className="text-[10px]" style={{ color: '#8FA4BA' }}>{b.sub}</p>
                      <p className="text-xs font-semibold" style={{ color: '#0C1E47' }}>
                        {b.store.split(' ').slice(1).join(' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: register card */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-2xl border shadow-lg p-6 max-w-md mx-auto"
                   style={{ borderColor: '#D0DBE8', boxShadow: '0 8px 40px rgba(12,30,71,0.12)' }}>
                <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#0C1E47' }}>
                  Créer mon compte
                </h2>
                <p className="text-sm mb-5" style={{ color: '#8FA4BA' }}>
                  Rejoignez des millions de Congolais sur MABELE
                </p>

                {/* User type selection */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8FA4BA' }}>
                  Je suis un(e)...
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'particulier', icon: '👤', label: 'Particulier' },
                    { id: 'agent',       icon: '🏠', label: 'Agent Immobilier' },
                  ].map((t) => (
                    <label key={t.id}
                      className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all hover:border-primary"
                      style={{ borderColor: '#D0DBE8' }}
                    >
                      <input type="radio" name="usertype" value={t.id} className="accent-blue-600" />
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-medium" style={{ color: '#0C1E47' }}>{t.label}</span>
                    </label>
                  ))}
                </div>

                {/* Name field */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D526B' }}>
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    placeholder="Jean-Pierre Mutombo"
                    className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none"
                    style={{ borderColor: '#D0DBE8', color: '#0C1E47' }}
                  />
                </div>

                {/* Phone field */}
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D526B' }}>
                    Numéro de téléphone
                  </label>
                  <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#D0DBE8' }}>
                    <div className="flex items-center gap-1.5 px-3 border-r select-none"
                         style={{ borderColor: '#D0DBE8', backgroundColor: '#F5F8FC' }}>
                      <span>🇨🇩</span>
                      <span className="text-sm font-medium" style={{ color: '#3D526B' }}>+243</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="81 234 5678"
                      className="flex-1 px-3 py-3 text-sm bg-white focus:outline-none"
                      style={{ color: '#0C1E47' }}
                    />
                  </div>
                </div>

                <Link href="/register"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 16px rgba(245,166,35,0.30)' }}
                >
                  Créer mon compte →
                </Link>

                <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: '#8FA4BA' }}>
                  En vous inscrivant, vous acceptez nos{' '}
                  <Link href="/terms" className="underline" style={{ color: '#1B4FB3' }}>Conditions d'utilisation</Link>
                  {' '}et notre{' '}
                  <Link href="/privacy" className="underline" style={{ color: '#1B4FB3' }}>Politique de confidentialité</Link>.
                </p>
                <p className="text-xs text-center mt-2" style={{ color: '#8FA4BA' }}>
                  Déjà un compte ?{' '}
                  <Link href="/login" className="font-semibold" style={{ color: '#1B4FB3' }}>Se connecter</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor: '#F5F8FC', borderTop: '1px solid #E8EEF4', borderBottom: '1px solid #E8EEF4' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <p className="font-display font-bold text-3xl sm:text-4xl" style={{ color: '#1B4FB3' }}>{s.value}</p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: '#0C1E47' }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8FA4BA' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#0C1E47' }}>
              Nos Services Clés
            </h2>
            <p style={{ color: '#8FA4BA' }}>8 modules conçus pour la réalité économique congolaise.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <Link key={s.label} href={s.href}
                className="group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 text-white"
                style={{ background: 'linear-gradient(135deg, #1A3260, #0C1E47)', boxShadow: '0 4px 20px rgba(12,30,71,0.15)' }}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg mb-1">{s.label}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.desc}</p>
                <span className="text-sm font-semibold transition-colors group-hover:underline"
                      style={{ color: '#F5A623' }}>
                  Explorer →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section style={{ backgroundColor: '#F5F8FC', borderTop: '1px solid #E8EEF4' }} className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#0C1E47' }}>
              Détails de Confiance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_FEATURES.map((f) => (
              <div key={f.title}
                className="bg-white rounded-2xl p-6 border text-center"
                style={{ borderColor: '#D0DBE8', boxShadow: '0 2px 12px rgba(12,30,71,0.06)' }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#0C1E47' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8FA4BA' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #0F3286, #0C1E47)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            MABELE dans votre poche
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Rejoignez des milliers de Congolais qui utilisent déjà MABELE chaque jour.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#F5A623', color: '#0C1E47', boxShadow: '0 4px 24px rgba(245,166,35,0.40)' }}
          >
            🚀 Commencer gratuitement
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Gratuit · Mobile Money · Sans carte bancaire
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ borderColor: '#E8EEF4', backgroundColor: '#F5F8FC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <img src="/logo.svg" alt="MABELE" className="h-8 mb-3" />
              <p className="text-sm" style={{ color: '#8FA4BA' }}>
                La super-plateforme digitale de la République Démocratique du Congo.
              </p>
            </div>
            {[
              { title: 'Modules',    links: [['Immobilier', '/immo'], ['Emploi', '/emploi'], ['Marché', '/market'], ['AgriTech', '/agri']] },
              { title: 'Outils',     links: [['NKISI', '/outils'], ['Congo Data', '/data'], ['KangaPay', '/finance']] },
              { title: 'Entreprise', links: [['À propos', '/about'], ['Contact', '/contact'], ['Conditions', '/terms'], ['Confidentialité', '/privacy']] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3" style={{ color: '#0C1E47' }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm transition-colors" style={{ color: '#8FA4BA' }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
               style={{ borderColor: '#E8EEF4', color: '#8FA4BA' }}>
            <p>© 2025 MABELE. Tous droits réservés.</p>
            <p>Fait avec ❤️ pour la 🇨🇩 RDC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
