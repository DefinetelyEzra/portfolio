import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Enhanced image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compress bundles
  compress: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Reduce large dependencies
  serverExternalPackages: ['nodemailer'],

  // Webpack optimizations for when NOT using turbopack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Split react and react-dom
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 40,
          },
          // Split large animation libraries
          animations: {
            name: 'animations',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            priority: 30,
          },
          // Split icons
          icons: {
            name: 'icons',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react-icons|lucide-react)[\\/]/,
            priority: 25,
          },
          // Everything else from node_modules
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 20,
            minChunks: 1,
          },
        },
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Add cache headers for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Specific caching for images
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;