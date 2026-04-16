import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MABELE — La plateforme digitale du Congo',
    template: '%s | MABELE',
  },
  description:
    'Tout pour chercher, vendre, travailler et payer en RDC. La super-plateforme digitale pour 112 millions de Congolais.',
  keywords: ['DRC', 'Congo', 'plateforme', 'immobilier', 'emploi', 'marché', 'fintech', 'KangaPay', 'agritech'],
  authors: [{ name: 'MABELE' }],
  creator: 'MABELE',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://mabele.cd'),
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    url: 'https://mabele.cd',
    title: 'MABELE — La plateforme digitale du Congo',
    description: 'Tout pour chercher, vendre, travailler et payer en RDC.',
    siteName: 'MABELE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MABELE — La plateforme digitale du Congo',
    description: 'Tout pour chercher, vendre, travailler et payer en RDC.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1B4FB3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
