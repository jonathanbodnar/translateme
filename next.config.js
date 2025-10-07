/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Server external packages (updated from experimental)
  serverExternalPackages: ['@prisma/client'],
  
  // Disable ESLint during builds for Railway deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checks during builds for Railway deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization for Railway
  images: {
    domains: [],
    unoptimized: true, // Disable image optimization for Railway
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
