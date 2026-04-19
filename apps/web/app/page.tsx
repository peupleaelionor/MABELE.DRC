// ─── MABELE Landing Page — Dark Premium ──────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MABELE — Tout pour chercher, vendre, travailler et payer en RDC',
  description: 'La super-plateforme digitale pour 112 millions de Congolais. Immobilier, Emploi, Marché, AgriTech, Finance et plus.',
}

const SERVICES = [
  { icon: '🏘', label: 'Immobilier',  href: '/immo',       desc: 'Achetez, vendez ou louez partout en RDC' },
  { icon: '💼', label: 'Emploi',      href: '/emploi',     desc: "Des milliers d'offres à travers le pays" },
  { icon: '🛒', label: 'Marché',      href: '/market',     desc: 'Petites annonces et produits divers' },
  { icon: '💰', label: 'KangaPay',    href: '/finance',    desc: 'Paiements mobiles, tontines, transferts' },
  { icon: '🌾', label: 'Agriculture', href: '/agri',       desc: 'Producteurs et acheteurs agricoles' },
  { icon: '🚛', label: 'Logistique',  href: '/logistique', desc: 'Transport & livraison en RDC' },
  { icon: '🧾', label: 'NKISI',       href: '/outils',     desc: 'Factures, devis et comptabilité' },
  { icon: '📊', label: 'Congo Data',  href: '/data',       desc: 'Données économiques en temps réel' },
]

const TRUST_FEATURES = [
  { icon: '🛡', title: 'Identité Validée',    desc: 'Profils vérifiés et badgés pour chaque utilisateur.' },
  { icon: '🔒', title: 'Paiement Sécurisé',   desc: 'Toutes les transactions passent par KangaPay.' },
  { icon: '📱', title: 'KangaPay mobile',      desc: "Payez et recevez de l'argent depuis votre téléphone." },
]

const STATS = [
  { value: '112M', label: 'Congolais', sub: 'à connecter' },
  { value: '26',   label: 'Provinces', sub: 'couvertes' },
  { value: '8',    label: 'Modules',   sub: 'intégrés' },
  { value: '100%', label: 'Mobile',    sub: 'Money compatible' },
]

const ACC = '#E05C1A'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50"
           style={{ backgroundColor: 'rgba(25,25,25,0.92)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="MABELE" className="h-9 w-9" />
            <span className="font-bold text-white text-lg tracking-wide">MABELE</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/',         label: 'Accueil'   },
              { href: '#services', label: 'Solutions'  },
              { href: '/about',    label: 'À Propos'  },
              { href: '/contact',  label: 'Contact'   },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.70)' }}>
              Se connecter
            </Link>
            <Link href="/register"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
              Créer mon compte
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
             style={{ background: `radial-gradient(circle, ${ACC}, transparent)` }} />
        <div className="absolute top-40 -left-20 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
             style={{ background: `radial-gradient(circle, #FF8C42, transparent)` }} />

        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

            {/* Left: copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
                   style={{ backgroundColor: 'rgba(224,92,26,0.12)', border: '1px solid rgba(224,92,26,0.25)', color: ACC }}>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Beta · Kinshasa, RDC 🇨🇩
              </div>

              <h1 className="font-bold leading-tight mb-6 text-white"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Tout pour chercher, vendre, travailler et payer en RDC.
              </h1>

              <p className="text-lg mb-3" style={{ color: 'rgba(255,255,255,0.70)' }}>
                L'application qui connecte toute la RDC.
              </p>
              <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Immobilier, emploi, marché, agriculture, finance — une seule plateforme
                pour <strong className="text-white">112 millions de Congolais</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-95 text-white"
                  style={{ backgroundColor: ACC, boxShadow: '0 4px 20px rgba(224,92,26,0.40)' }}>
                  🚀 Créer mon compte
                </Link>
                <Link href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all"
                  style={{ border: `1px solid rgba(255,255,255,0.20)`, color: 'rgba(255,255,255,0.80)' }}>
                  Se connecter →
                </Link>
              </div>

              <div className="flex gap-3">
                {[
                  { store: '🍎 App Store', sub: 'Disponible sur' },
                  { store: '🤖 Google Play', sub: 'Télécharger sur' },
                ].map((b) => (
                  <button key={b.store}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl opacity-40 cursor-not-allowed text-left"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' }}
                    disabled>
                    <span className="text-xl">{b.store.split(' ')[0]}</span>
                    <div>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.sub}</p>
                      <p className="text-xs font-semibold text-white">
                        {b.store.split(' ').slice(1).join(' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: register card */}
            <div className="mt-14 lg:mt-0">
              <div className="rounded-2xl p-6 max-w-md mx-auto"
                   style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.40)' }}>
                <h2 className="font-bold text-xl text-white mb-1">Créer mon compte</h2>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  Rejoignez des millions de Congolais sur MABELE
                </p>

                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Je suis un(e)...
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'particulier', icon: '👤', label: 'Particulier' },
                    { id: 'agent',       icon: '🏠', label: 'Agent Immobilier' },
                  ].map((t) => (
                    <label key={t.id}
                      className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <input type="radio" name="usertype" value={t.id} className="accent-orange-500" />
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-sm font-medium text-white">{t.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Nom Complet
                  </label>
                  <input type="text" placeholder="Jean-Pierre Mutombo"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                    style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.10)' }} />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Numéro de téléphone
                  </label>
                  <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                    <div className="flex items-center gap-1.5 px-3 select-none"
                         style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
                      <span>🇨🇩</span>
                      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>+243</span>
                    </div>
                    <input type="tel" placeholder="81 234 5678"
                      className="flex-1 px-3 py-3 text-sm text-white focus:outline-none"
                      style={{ backgroundColor: '#2A2A2A' }} />
                  </div>
                </div>

                <Link href="/register"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: ACC, boxShadow: '0 4px 16px rgba(224,92,26,0.35)' }}>
                  Créer mon compte →
                </Link>

                <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  En vous inscrivant, vous acceptez nos{' '}
                  <Link href="/terms" className="underline" style={{ color: ACC }}>Conditions d'utilisation</Link>
                  {' '}et notre{' '}
                  <Link href="/privacy" className="underline" style={{ color: ACC }}>Politique de confidentialité</Link>.
                </p>
                <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Déjà un compte ?{' '}
                  <Link href="/login" className="font-semibold" style={{ color: ACC }}>Se connecter</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <p className="font-bold text-3xl sm:text-4xl" style={{ color: ACC }}>{s.value}</p>
              <p className="font-semibold text-sm mt-0.5 text-white">{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl mb-3 text-white">Nos Services Clés</h2>
            <p style={{ color: 'rgba(255,255,255,0.40)' }}>8 modules conçus pour la réalité économique congolaise.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <Link key={s.label} href={s.href}
                className="group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
                style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg text-white mb-1">{s.label}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
                <span className="text-sm font-semibold transition-colors group-hover:underline"
                      style={{ color: ACC }}>
                  Explorer →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section style={{ backgroundColor: '#191919', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-white mb-3">Sécurité & Confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_FEATURES.map((f) => (
              <div key={f.title}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: '#242424', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.30)' }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4"
               style={{ background: `linear-gradient(135deg, rgba(224,92,26,0.15), rgba(224,92,26,0.05))`, borderTop: '1px solid rgba(224,92,26,0.20)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">MABELE dans votre poche</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Rejoignez des milliers de Congolais qui utilisent déjà MABELE chaque jour.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACC, boxShadow: '0 4px 24px rgba(224,92,26,0.45)' }}>
            🚀 Commencer gratuitement
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.30)' }}>
            Gratuit · Mobile Money · Sans carte bancaire
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#191919' }} className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/favicon.svg" alt="MABELE" className="w-8 h-8" />
                <span className="font-bold text-white">MABELE</span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                La super-plateforme digitale de la République Démocratique du Congo.
              </p>
            </div>
            {[
              { title: 'Modules',    links: [['Immobilier', '/immo'], ['Emploi', '/emploi'], ['Marché', '/market'], ['AgriTech', '/agri']] as [string,string][] },
              { title: 'Outils',     links: [['NKISI', '/outils'], ['Congo Data', '/data'], ['KangaPay', '/finance']] as [string,string][] },
              { title: 'Entreprise', links: [['À propos', '/about'], ['Contact', '/contact'], ['Conditions', '/terms'], ['Confidentialité', '/privacy']] as [string,string][] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm text-white mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm transition-colors"
                            style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.30)' }}>
            <p>© 2025 MABELE. Tous droits réservés.</p>
            <p>Fait avec ❤️ pour la 🇨🇩 RDC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
