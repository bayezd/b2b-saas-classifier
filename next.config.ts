import { productionConfig } from './src/config/production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    domains: ['*'],
    minimumCacheTTL: 60,
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: Object.entries(productionConfig.security.headers).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]
  },

  // Enable static optimization where possible
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Optimize bundle size
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      })
    }

    return config
  },
}

export default nextConfig
