import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mabele/shared', '@mabele/database'],
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
