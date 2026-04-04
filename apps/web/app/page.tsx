import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MABELE — La plateforme digitale du Congo',
  description:
    'La super-plateforme digitale tout-en-un pour 112 millions de Congolais. Immobilier, Emploi, Marché, AgriTech, Finance et plus.',
}

const modules = [
  {
    id: 'immo',
    name: 'Immobilier',
    emoji: '🏠',
    color: '#D4A017',
    description: 'Achetez, vendez ou louez votre bien immobilier partout en RDC.',
    href: '/immo',
  },
  {
    id: 'emploi',
    name: 'Emploi',
    emoji: '💼',
    color: '#26C6DA',
    description: "Des milliers d'offres d'emploi à travers toutes les provinces.",
    href: '/emploi',
  },
  {
    id: 'market',
    name: 'Marché',
    emoji: '🛒',
    color: '#FF5252',
    description: 'Achetez et vendez tout ce que vous voulez en toute sécurité.',
    href: '/market',
  },
  {
    id: 'agri',
    name: 'AgriTech',
    emoji: '🌾',
    color: '#00C853',
    description: 'Connectez producteurs et acheteurs de produits agricoles.',
    href: '/agri',
  },
  {
    id: 'nkisi',
    name: 'NKISI',
    emoji: '🧾',
    color: '#B388FF',
    description: 'Gérez votre business: devis, factures, comptabilité.',
    href: '/outils',
  },
  {
    id: 'data',
    name: 'Congo Data',
    emoji: '📊',
    color: '#448AFF',
    description: 'Données économiques et tableaux de bord en temps réel.',
    href: '/data',
  },
  {
    id: 'kangapay',
    name: 'KangaPay',
    emoji: '💰',
    color: '#FFB300',
    description: 'Mobile money, tontines numériques et paiements sécurisés.',
    href: '/finance',
  },
  {
    id: 'bima',
    name: 'Bima Santé',
    emoji: '🏥',
    color: '#FF4081',
    description: 'Souscrivez à votre assurance santé en quelques clics.',
    href: '/bima',
  },
]

const stats = [
  { value: '112M', label: 'Congolais', sublabel: 'à connecter' },
  { value: '67%', label: 'Pénétration', sublabel: 'mobile' },
  { value: '8.7Md$', label: 'Plan Numérique', sublabel: 'DRC 2025–2030' },
  { value: '26', label: 'Provinces', sublabel: 'couvertes' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-gradient-gold">MABELE</span>
            <span className="text-xs text-muted-foreground hidden sm:block">🇨🇩 RDC</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm hidden sm:flex">
              Se connecter
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4A017, transparent)' }}
        />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Beta — Kinshasa, RDC
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
            <span className="text-gradient-gold">MABELE</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-display mb-4">
            La plateforme digitale tout-en-un
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Pour <strong className="text-foreground">112 millions de Congolais</strong> —
            Immobilier, Emploi, Marché, Agriculture, Finance et bien plus, dans une seule application.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              🚀 Créer mon compte
            </Link>
            <Link href="/immo" className="btn-outline text-base px-8 py-4 w-full sm:w-auto">
              Explorer la plateforme
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratuit · Mobile Money · 🇨🇩 Fait pour la RDC
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-foreground font-semibold text-sm">{stat.label}</div>
              <div className="text-muted-foreground text-xs">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Tous vos besoins, une seule plateforme</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              8 modules essentiels conçus spécialement pour la réalité économique congolaise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="card-base card-hover group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: `${mod.color}20` }}
                >
                  {mod.emoji}
                </div>
                <h3
                  className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
                  style={{ color: mod.color }}
                >
                  {mod.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                <div
                  className="mt-4 text-xs font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1"
                  style={{ color: mod.color }}
                >
                  Explorer →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why MABELE Section */}
      <section className="py-20 px-4 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Pourquoi MABELE ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📱',
                title: 'Mobile First',
                desc: "Conçu pour fonctionner sur tout type de smartphone, même avec une connexion limitée.",
              },
              {
                icon: '💵',
                title: 'Mobile Money',
                desc: 'Paiements via Airtel Money, M-Pesa, Orange Money — pas besoin de carte bancaire.',
              },
              {
                icon: '🔒',
                title: 'Sécurisé & Local',
                desc: "Vos données restent en RDC. Transactions sécurisées et vérification d'identité.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-[16px] bg-background border border-border">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-base inline-block px-8 py-3 mb-6 text-sm text-muted-foreground">
            📲 Application mobile — Bientôt disponible
          </div>
          <h2 className="section-title mb-4">
            MABELE dans votre poche
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            L&apos;application mobile MABELE sera disponible sur iOS et Android très prochainement.
            Inscrivez-vous pour être notifié en premier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-outline w-full sm:w-auto opacity-60 cursor-not-allowed">
              🍎 App Store — Bientôt
            </button>
            <button className="btn-outline w-full sm:w-auto opacity-60 cursor-not-allowed">
              🤖 Play Store — Bientôt
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-2xl font-display font-bold text-gradient-gold">MABELE</span>
              <p className="text-muted-foreground text-sm mt-2">
                La super-plateforme digitale de la République Démocratique du Congo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Modules</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/immo" className="hover:text-primary transition-colors">Immobilier</Link></li>
                <li><Link href="/emploi" className="hover:text-primary transition-colors">Emploi</Link></li>
                <li><Link href="/market" className="hover:text-primary transition-colors">Marché</Link></li>
                <li><Link href="/agri" className="hover:text-primary transition-colors">AgriTech</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Outils</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/outils" className="hover:text-primary transition-colors">NKISI</Link></li>
                <li><Link href="/data" className="hover:text-primary transition-colors">Congo Data</Link></li>
                <li><Link href="/finance" className="hover:text-primary transition-colors">KangaPay</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-primary transition-colors cursor-pointer">À propos</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Contact</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Conditions</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Confidentialité</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 TechFlow Solutions. Tous droits réservés.</p>
            <p className="flex items-center gap-1">
              Fait avec ❤️ pour la 🇨🇩 RDC
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
