import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@mabele/shared',
    '@mabele/database',
    '@mabele/core-billing',
    '@mabele/core-events',
    '@mabele/core-auth',
    '@mabele/core-rate-limit',
    '@mabele/core-logger',
    '@mabele/core-qr',
    '@mabele/core-wallet',
    '@mabele/ui-tokens',
    '@mabele/ui-components',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
