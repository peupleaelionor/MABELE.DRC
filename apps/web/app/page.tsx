import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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
    color: '#BB902A',
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
    id: 'sink',
    name: 'SINK',
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
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1A1A2E', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image src="/favicon.svg" alt="MABELE" width={36} height={36} style={{ borderRadius: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '1px' }}>MABELE</span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#8A8A80', letterSpacing: '2px', textTransform: 'uppercase' }}>BY FLOW TECH DRC</span>
            </div>
          </Link>
          <Link href="/lovable" aria-label="Menu" style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(180deg, #FDF6E3 0%, #FEF9EF 60%, #FFFFFF 100%)', padding: '48px 20px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Beta Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '6px 16px', marginBottom: '28px', fontSize: '13px', fontWeight: 600, color: '#1E6B3A', letterSpacing: '0.5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            BETA — KINSHASA, RDC
          </div>

          {/* Main Heading */}
          <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 900, lineHeight: 1.1, fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '24px', color: '#1A1A2E' }}>
            L&apos;application qui{' '}
            <span style={{ color: '#1D4ED8' }}>connecte</span>
            {' '}toute la{' '}
            <span style={{ color: '#BB902A' }}>République Démocratique</span>
            {' '}du Congo
          </h1>

          {/* Description */}
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#6B7280', marginBottom: '36px', maxWidth: '560px' }}>
            Cherchez, vendez, travaillez et payez dans une seule application.
            Immobilier, emploi, marché, paiements mobiles — tout est rassemblé dans MABELE.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#D4A017',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                padding: '16px 32px',
                borderRadius: '14px',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                border: 'none',
              }}
            >
              Créer un compte
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/immo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: '#1A1A2E',
                fontWeight: 600,
                fontSize: '15px',
                padding: '16px 32px',
                borderRadius: '14px',
                textDecoration: 'none',
                border: '1.5px solid #D1D5DB',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Découvrir
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '48px 20px', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {stats.map((stat) => (
            <div key={stat.value} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#D4A017', marginBottom: '4px', fontFamily: "'Playfair Display', Georgia, serif" }}>
                {stat.value}
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#1A1A2E' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#1A1A2E', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>Tous vos besoins, une seule plateforme</h2>
            <p style={{ color: '#6B7280', maxWidth: '480px', margin: '0 auto', fontSize: '15px' }}>
              8 modules essentiels conçus spécialement pour la réalité économique congolaise.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                style={{
                  display: 'block',
                  background: '#FAFAFA',
                  border: '1px solid #F3F4F6',
                  borderRadius: '16px',
                  padding: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '12px',
                    backgroundColor: `${mod.color}18`,
                  }}
                >
                  {mod.emoji}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: mod.color }}>
                  {mod.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{mod.description}</p>
                <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, color: mod.color }}>
                  Explorer →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why MABELE Section */}
      <section style={{ padding: '64px 20px', background: '#FAFAFA', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#1A1A2E', fontFamily: "'Playfair Display', Georgia, serif" }}>Pourquoi MABELE ?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
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
              <div key={item.title} style={{ textAlign: 'center', padding: '28px 20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '12px', background: '#FEF3C7', fontSize: '14px', color: '#92400E', marginBottom: '20px' }}>
            📲 Application mobile — Bientôt disponible
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#1A1A2E', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '12px' }}>
            MABELE dans votre poche
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px', fontSize: '15px', lineHeight: 1.6 }}>
            L&apos;application mobile MABELE sera disponible sur iOS et Android très prochainement.
            Inscrivez-vous pour être notifié en premier.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <span style={{ padding: '14px 24px', borderRadius: '12px', border: '1.5px solid #D1D5DB', color: '#9CA3AF', fontSize: '14px', fontWeight: 600 }}>
              🍎 App Store — Bientôt
            </span>
            <span style={{ padding: '14px 24px', borderRadius: '12px', border: '1.5px solid #D1D5DB', color: '#9CA3AF', fontSize: '14px', fontWeight: 600 }}>
              🤖 Play Store — Bientôt
            </span>
          </div>
        </div>
      </section>

      {/* Mobile App Link */}
      <section style={{ padding: '0 20px 48px', textAlign: 'center' }}>
        <Link href="/lovable" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#D4A017', fontWeight: 600, textDecoration: 'none' }}>
          📱 Accéder à l&apos;app mobile MABELE →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F3F4F6', padding: '48px 20px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Image src="/favicon.svg" alt="MABELE" width={28} height={28} style={{ borderRadius: '6px' }} />
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', fontFamily: "'Playfair Display', Georgia, serif" }}>MABELE</span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.6 }}>
                La super-plateforme digitale de la République Démocratique du Congo.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1A1A2E', marginBottom: '12px', fontSize: '14px' }}>Modules</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link href="/immo" style={{ color: '#6B7280', textDecoration: 'none' }}>Immobilier</Link></li>
                <li><Link href="/emploi" style={{ color: '#6B7280', textDecoration: 'none' }}>Emploi</Link></li>
                <li><Link href="/market" style={{ color: '#6B7280', textDecoration: 'none' }}>Marché</Link></li>
                <li><Link href="/agri" style={{ color: '#6B7280', textDecoration: 'none' }}>AgriTech</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1A1A2E', marginBottom: '12px', fontSize: '14px' }}>Outils</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><Link href="/outils" style={{ color: '#6B7280', textDecoration: 'none' }}>SINK</Link></li>
                <li><Link href="/data" style={{ color: '#6B7280', textDecoration: 'none' }}>Congo Data</Link></li>
                <li><Link href="/finance" style={{ color: '#6B7280', textDecoration: 'none' }}>KangaPay</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1A1A2E', marginBottom: '12px', fontSize: '14px' }}>Entreprise</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li><span style={{ color: '#6B7280', cursor: 'pointer' }}>À propos</span></li>
                <li><span style={{ color: '#6B7280', cursor: 'pointer' }}>Contact</span></li>
                <li><Link href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Conditions</Link></li>
                <li><Link href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px', color: '#9CA3AF' }}>
            <p>© 2025 Flow Tech DRC. Tous droits réservés.</p>
            <p>Fait avec ❤️ pour la 🇨🇩 RDC</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
