import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MABELE — La plateforme digitale du Congo',
    template: '%s | MABELE',
  },
  description:
    'La super-plateforme digitale tout-en-un pour 112 millions de Congolais. Immobilier, Emploi, Marché, AgriTech, Finance et plus.',
  keywords: ['DRC', 'Congo', 'plateforme', 'immobilier', 'emploi', 'marché', 'fintech', 'agritech'],
  authors: [{ name: 'TechFlow Solutions' }],
  creator: 'TechFlow Solutions',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://mabele.cd'),
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    url: 'https://mabele.cd',
    title: 'MABELE — La plateforme digitale du Congo',
    description: 'La super-plateforme digitale tout-en-un pour 112 millions de Congolais.',
    siteName: 'MABELE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MABELE — La plateforme digitale du Congo',
    description: 'La super-plateforme digitale tout-en-un pour 112 millions de Congolais.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08080C',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
